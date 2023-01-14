import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import axios from "axios";

interface Data {
  symbol: string;
  companyName: string;
  marketCap: number;
  price: number;
  volume: number;
  exchangeShortName: string;
  industry: string;
}

const FINANCIAL_MODELING_API_KEY = import.meta.env
  .VITE_FINANCIAL_MODELING_API_KEY;

const url =
  "https://financialmodelingprep.com/api/v3/stock-screener?marketCapMoreThan=75000000000&apikey=";

const TopMarketCap: React.FC = () => {
  return <div>TopMarketCap</div>;
};

export default TopMarketCap;
