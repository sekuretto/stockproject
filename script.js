// https://docs.anychart.com/Quick_Start/Quick_Start

// VARIABLES (UI ELEMENTS)
const alert = document.getElementById('alert');
const question = document.getElementById('question');
const date1 = document.getElementById('start');
const date2 = document.getElementById('end');
const submit = document.getElementById('submit');
const answer = document.getElementById('answer');
const answerdata = document.getElementById('answer-data');


// FETCH AND RETURN STOCK CSV DATA
async function getData() {
  return fetch("./HistoricalQuotes.csv")
    .then(response => response.text())
    .then(text => {
      //csv text
      return text;
    })
    .catch(err => console.log('failed', err));  
};


// PARSE STOCK CSV FOR OTHER FUNCTIONS AND REMOVE $ SIGNS
async function parseCSV (text) {
  let file = await getData();
  //console.log(file);
  let data = [];
  //split text into array
  let arr = file.split(/\r\n|\n/);
  arr.forEach((value, index) => {
    //each row into array
    let row = value.split(", ");   
    // change values to string and remove $ from each
    let items = [];
    let rivi;
    row.forEach((value, index) => {
      let item = value.toString();
      if(item.includes("$")) {
        let v = item.slice(1);           
        item = v;
      }
      items.push(item);  
    });
    rivi = items.join(", ");
    data.push(rivi);
  });
  // parse array data back into csv format
  let stock = data.join('\r\n');
  //console.log(stock);
  return stock;
}


// DRAW CHART WITH ANYCHART 
anychart.onDocumentLoad(async function () {
  let stockdata = await parseCSV();

  // re-order data for AnyChart
  // AnyChart candlestick chart data order: date, open, high, low, close
  let data = [];
  stockdata = stockdata.split(/\r\n|\n/);
  stockdata.forEach((value, index) => {
    //each row into array
    let row = value.split(", ");
    //reorder array for chart
    //remove volume (row[2])
    row.splice(2,1);
    //switch the place of "close"-values to last
    let close = row.splice(1,1);
    close.forEach((value) => {
      row.push(value);
    });
    data.push(row);   
  });
  stockdata = data.join('\r\n');
  
  // create an instance of a candlestick chart
  var chart = anychart.candlestick();
  // set the data
  chart.data(stockdata, {ignoreFirstRow: true, columnSeparator: ",", rowsSeparator: "\r\n"});
  // set chart title
  chart.title("Apple stock history");
  // set the container element 
  chart.container("history");
  // initiate chart display
  chart.draw();
});


//CHECK SELECTED DATES
//prevent entering dates on weekends
function checkDate(e) {
  let day = new Date(e.target.value).getDay();
  // Sunday - Saturday : 0 - 6
  if (day == 0 || day == 6) {
    let p = document.createElement("P");
    let text = document.createTextNode("Select only weekdays! (Monday - Friday)");
    p.appendChild(text);
    alert.appendChild(p);
    //remove after few seconds
    setTimeout(() => {
      alert.removeChild(p);
    }, 3000);
  }
};


// PARSE SELECTED DATES
function parseDate (data) {
  let date;
  data.toString();
  date = data.split("-").reverse();
  date = (date[1].toString()).concat("/", date[0].toString()).concat("/", date[2].toString());
  return date;
}

// CREATE TABLE ELEMENT FOR DATA
function createTable(arr, headers) {
  let table = document.createElement("TABLE");
  let header = table.createTHead();
  let headerrow = header.insertRow(0);
  headers.forEach((value, index) => {
    let headercell = headerrow.insertCell(index);
    headercell.innerHTML = headers[index];
  });
  let body = table.createTBody();
  arr.forEach((value, index) => {
    let row = body.insertRow(index);
    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    cell1.innerHTML = `${arr[index][0]}`;
    cell2.innerHTML = `${arr[index][1]}`;
    cell3.innerHTML = `${arr[index][2]}`;
  });

  // for (i = 0; i < arr.length; i++) {
  //   let row = body.insertRow(i);
  //   for (j = 0; j < headers.length; j++) {
  //     let cell = row.insertCell(j);
  //     cell.innerHTML = `${arr[i][headers[j]]}`;
  //   }
  // };

  answerdata.appendChild(table);
}


// CALCULATIONS
async function calc () {
  let stockdata = await parseCSV();
  let dataarr = stockdata.split(/\r\n|\n/);
  let data = dataarr.reverse();
  // data order: date, close/last, volume, open, high, low
  let q = question.value;
  // get and parse dates
  let d1 = parseDate(date1.value);
  let d2 = parseDate(date2.value);
  // find indexes that match the dates
  let alku;
  let loppu;
  // error if date doesn't exist in data (weekends)!
  // prevented by checking date input with checkDate()
  data.forEach((value) => {
    if (value.indexOf(d1) >= 0) {
      alku = data.indexOf(value);
    };
    if (value.indexOf(d2) >= 0) {
      loppu = data.indexOf(value);
    };
  });
  // data within data range
  let area = data.slice(alku, loppu + 1);
  //console.log(area);
  
  //get different values from date range
  let volume = [];
  let date = [];
  let open = [];
  let close = [];
  let high = [];
  let low = [];
  area.forEach((value) => {
    let row = value.split(", ");
    date.push(row[0]);
    volume.push(parseInt(row[2]));
    open.push(parseFloat(row[3]));
    close.push(parseFloat(row[1]));
    high.push(parseFloat(row[4]));
    low.push(parseFloat(row[5]));
  });
  
  switch (q) {
    case "A":
      // compare close values for trend
      let total = 0;
      let count = 0;
      for (i=1; i <= close.length; i++) {
        if (close[i] > close[i - 1]) {
          count++;
        } else if (close[i] < close[i - 1]) {
          if(total < count) {
            total = count;
            count = 0;
          } else {
            count = 0;
          }
        }
      }
      answer.innerHTML = `<p>Answer to question <strong>${q}</strong>:<br> Longest bullish trend lasted <strong>${total}</strong> days within ${d1} to ${d2}</p>`;
      break;

    case "B":
      // calculate daily stock price changes from high & low values
      let pricechange = [];
      let x = 0;
      for (i=0; i <= area.length - 1; i++) {
        x = Math.abs(high[i] - low[i]);
        pricechange.push(parseFloat(x.toFixed(4)));
      };

      // array for date, volume and pricechange
      let sorted = [];
      for (i=0; i <= date.length - 1; i++) {
        sorted.push([date[i], volume[i], pricechange[i]]);
      };

      // sort in descending order based on volume (sorted[index][1])
      sorted.sort((x,y) => {
        if(y[1] > x[1]) {
          return y[1] - x[1];
        } else {
          return y[2] - x[2];
        }
      });

      // find highest volume value
      let highprice = pricechange.indexOf(Math.max(...pricechange));
      let highdate = date[highprice];
      
      answer.innerHTML = `<p>Answer to question <strong>${q}</strong>:<br><br> Highest trading volume (<strong>${sorted[0][1]}</strong>) was on ${sorted[0][0]}.<br><br>
      Most significant price change (<strong>$ ${pricechange[highprice]}</strong>) happened on ${highdate}.<br><br>
      Data within date range sorted by volume:`;

      let headers = ["Date", "Volume", "Stock Price Change"];
      createTable(sorted, headers);
      break;

    case "C": 
      //calculate SMA for day N using the average value of closing prices between days N-1 to N-5
      let smaarr = [];
      for (i=5; i <= date.length; i++) {
        let sma = (close[i-5] + close[i-4] + close[i-3] + close[i-2] + close[i-1])/5;
        smaarr.push(sma);
      }

      //calculate how many percentages (%) is the difference between the opening price of the day and the calculated SMA 5 price of the day
      let percentages = [];
      for (i=0; i <= smaarr.length; i++) {
        let percent = (open[i+5] - smaarr[i])/(open[i+5] + smaarr[i]) * 100;
        percentages.push(percent);
      }
      
      //list of dates and price change percentages, ordered by price change percentages
      let comparison = [];
      for (i=5; i <= date.length - 1; i++) {
        let rivi = [date[i], percentages[i-5]];
        comparison.push(rivi);
      }
      comparison.sort((x,y) => {
        return y[1] - x[1];
      });
      
      answer.innerHTML = `<p>Answer to question <strong>${q}</strong>:<br><br> List of dates and price change percentages (opening price compared to SMA 5), sorted by %:`;
      let headers2 = ["Date", "Price Change (%)"];
      createTable(comparison, headers2);
      break;
  };
};

// EVENT LISTENERS
date1.addEventListener('input', checkDate);
date2.addEventListener('input', checkDate);
submit.addEventListener('click', calc);