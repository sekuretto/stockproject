Company has a new customer, Scrooge McDuck.  
  
Scrooge wants to make a fortune by analyzing historical stock market data, and he has ordered an application that provides some statistics about stock prices. However the app should not cost too much.  
  
Your job is to implement an MVP (minimum viable product) for Scrooge using any technology you want. (Web page, mobile application, console application, Web API etc.)  

1. Scrooge wants to import historical stock data from a CSV file into the application.  
  
Sample data can be downloaded via Nasdaq web site or API.  
Apple stock historical data:  
https://www.nasdaq.com/market-activity/stocks/aapl/historical  
https://www.nasdaq.com/api/v1/historical/AAPL/stocks/2020-01-20/2021-01-20  

CSV data format example:  
“Date, Close/Last, Volume, Open, High, Low  
01/19/2021, $127.83, 90757330, $127.78, $128.71, $126.938”  
  
2. Scrooge wants answers to following questions A - C.  

A) How many days was the longest bullish (upward) trend within a given date range?  
  
- Definition of an upward trend shall be: “Closing price of day N is higher than closing price of day N-1”  
- Read start date and end date of the date range from user input (or pass them as input parameters via the API if your MVP does not have an user interface).  
- Both start and end date shall be included to the date range.  
- Expected output: The max amount of days the stock price was increasing in a row  
  
Example: In Apple stock historical data the Close/Last price increased 3 days in a row between 01/06/2021 and 01/08/2021.  
  
B) Which dates within a given date range had a) the highest trading volume and b) the most significant stock price change within a day?  
  
- Use High and Low prices to calculate the stock price change within a day. (Stock price change from 2$ to 1$ is equally significant as change from 1$ to 2$.)  
- Expected output: List of dates, volumes and price changes. The list is ordered by volume and price change. So if two dates have the same volume, the one with the more significant price change should come first.   
  
C) Within a given date range, which dates had the best opening price compared to 5 days simple moving average (SMA 5)?  
  
- Calculate simple moving average for day N using the average value of closing prices between days N-1 to N-5.  
- Calculate how many percentages (%) is the difference between the opening price of the day and the calculated SMA 5 price of the day.  
- Expected output: List of dates and price change percentages. The list is ordered by price change percentages.  
  
You can return the source code for example via GitHub or email. Company will review the code, and we like clean, maintainable code that follows good coding conventions. You may ask if you have any questions, and have fun coding.  
