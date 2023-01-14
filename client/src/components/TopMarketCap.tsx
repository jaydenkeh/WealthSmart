import React from "react";

const FINANCIAL_MODELING_API_KEY = import.meta.env
  .VITE_FINANCIAL_MODELING_API_KEY;

const url =
  "https://financialmodelingprep.com/api/v3/stock-screener?marketCapMoreThan=75000000000&apikey=";
const TopMarketCap: React.FC = () => {
  return <div>TopMarketCap</div>;
};

export default TopMarketCap;
