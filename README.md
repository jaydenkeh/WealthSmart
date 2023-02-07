<a name="readme-top"></a>

![Wealth Smart banner](https://user-images.githubusercontent.com/113533303/216263693-668b96f0-8397-4bed-8026-4a80a07ca2ff.png)

<br />

## Project Description

Wealth Smart is a full stack web application built with TypeScript, React, Express, Prisma, and PostgreSQL. The app allows users to signup, login, keep track of securities in a watchlist, and perform simulated paper trading with the U.S stock market - each newly created account will start off with a total cash balance of USD100,000.

## Snippets

![](https://github.com/jaydenkeh/WealthSmart/blob/main/client/public/WealthSmart-SignupLogin-demo.gif)

Main page upon successful login, user will be able to view the largest companies by market cap and top gainers/losers (of the day) of the U.S market. Data presented is real-time and obtained from Financial Modeling Prep API
![WealthSmart_MainPage](https://user-images.githubusercontent.com/113533303/216250885-ba9cd5ed-0908-425f-924c-d9dd18147d26.png)
![WealthSmart_MainPage_2](https://user-images.githubusercontent.com/113533303/216253034-f1d1f596-9cf4-4756-b538-abf378177297.png)

Clicking into the ticker lead users to the trading page where the one year candlestick chart is presented using highcharts; user can decide on the price and quantity to buy/sell for specific ticker
![WealthSmart_TradingPage](https://user-images.githubusercontent.com/113533303/216252977-68fe551d-c4d8-424d-8cf6-227aec953eaa.png)

User existing holdings will be presented in the portfolio page
![WealthSmart_PortfolioPage](https://user-images.githubusercontent.com/113533303/216253079-7562f8fc-3663-4ff3-90c9-849bbc5f5003.png)

User can add or delete ticker from their watchlist
![WealthSmart_WatchlistPage](https://user-images.githubusercontent.com/113533303/216253109-6fb140c0-e92b-4979-8c61-e450158dec78.png)

## Technical Used

Project is built with the following technologies:

- TypeScript
- React
- React Bootstrap
- Fontawesome
- highcharts
- PostgreSQL
- Prisma
- ExpressJS
- JWT
- bcrypt
- Axios

## Planning and Development Process

- [x] Client

  - Signup and Login pages set up with JWT authentication
  - Home page and main dashboard (TopMarketCap & TopGainersLosers)
  - Navigation Bar
  - Symbol Page:
    - Chart component plotting daily candlesticks over one year period
    - Paper trading form logic to allow buy/sell order execution
    - Symbol quote information
    - Add to/remove from watchlist logic
  - Portfolio Page:
    - User portfolio table
    - User account values (Total Cash Balance, Total Securities Value, Total Accumulated Profit/Loss)
  - Trade History Page
  - Watchlist Page
    - Remove from watchlist button & logic
  - Search bar logic
    - Ping API to fetch results and redirect user to Symbol Page upon clicking ticker
  - Pagination (TopMarketCap, PortfolioPage, TradeHistoryPage, WatchlistPage)
  - Loader in App.tsx

- [x] Server

  - POST Endpoints
    - Signup (password hashing with bcrypt)
    - Login (JWT authentication)
    - Trading (handle paper trading orders)
    - Portfolio creation when user execute buy order for the first time for new ticker
    - Add to watchlist
    - Account value balances of user created upon initial sign up
  - GET Endpoints
    - checkAuth (for protecting routes in frontend)
    - Get user porfolio records
    - Get user trading history
    - Get user watchlist
  - PUT Endpoints
    - Update user portfolio records when user execute buy or sell order
    - Update user account value balances when a buy or sell order is executed
  - DELETE Endpoints
    - Delete user portfolio records when quantity sold equals current quantity holding
    - Delete from watchlist
  - Prisma and PostgreSQL database setup
    - Models

## API Used

- Financial Modeling Prep API

## Contact

- https://github.com/jaydenkeh

## License

This project is licensed under the terms of the [MIT License](LICENSE).

<p align="left">(<a href="#readme-top">back to top</a>)</p>
