import React, { useState, useEffect } from "react";
import TopMarketCap from "./TopMarketCap";
import TopGainersLosers from "./TopGainersLosers";

//TODO set up toggles to toggle between the different markets
//TODO set up i. Stock Price (Real time) for different exchanges(?)
//TODO different tabs to set up - Stock Screener + News

const MainDashboard: React.FC = () => {
  return (
    <>
      <div className="main-dashboard-container">
        <h3>United States Stock Market</h3>
        <TopMarketCap />
        <TopGainersLosers />
      </div>
    </>
  );
};

export default MainDashboard;
