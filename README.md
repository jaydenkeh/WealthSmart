<a name="readme-top"></a>

<!-- Insert Project Logo here -->

<br />
<div align="center">
<h3 align="center">Wealth Smart</h3>

  <p align="center">
    <em>financial web application with full CRUD functionality</em> 
    <br />
  </p>
</div>

## Project Description

Wealth Smart is a full stack web application built with TypeScript, React, Express, Prisma, and PostgreSQL. The app allows users to signup, login, keep track of securities in a watchlist, and perform simulated paper trading with the U.S stock market - each newly created account will start off with a total cash balance of USD100,000.

## Snippets

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

For this project, I've used the following technologies:

- TypeScript
- React
- React Bootstrap (for Frontend CSS)
- Fontawesome (for icons)
- highcharts (to plot the candlesticks chart)
- Vite
- PostgreSQL
- Prisma
- ExpressJS
- JWT
- bcrypt (for password hashing)

## Planning and Development Process

- [x] Setup Signup and Login pages with React Boostrap and Fontawesome
- [x] Setup Home page with navigation bar and main dashboard components
- [x] Setup U.S. stocks market daily top gainers and losers component and inserted to main dashboard
- [x] Setup largest companies by market capitalization component and inserted to main dashboard
- [x] Setup Symbol page for paper trading
- [x] Setup server routers: signupRouter, loginRouter

## API Used

- Financial Modeling Prep API

## Contact

- https://github.com/jaydenkeh

<p align="left">(<a href="#readme-top">back to top</a>)</p>
