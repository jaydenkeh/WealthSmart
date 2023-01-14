import React, { useState, useEffect } from "react";
import TopGainersLosers from "./TopGainersLosers";

//TODO set up toggles to toggle between the different markets
//TODO set up i. Stock Price (Real time) for different exchanges(?)
//TODO set up Most Active together with Top Gainers/Losers
//TODO set up individual stock page to allow adding to watchlist + paper trading
//TODO different tabs to set up - Stock Screener + News
//? Implement ALPHA VANTAGE Search Query API for Search bar function

// const ALPHA_VANTAGE_API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;

const MainDashboard: React.FC = () => {
  return (
    <>
      <h2>US STOCK MARKET</h2>
      <TopGainersLosers />
    </>
  );
};

export default MainDashboard;
