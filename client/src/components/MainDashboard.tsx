import React, { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import axios from "axios";

//TODO ping the API to get the data
//TODO set up toggles to toggle between the different markets
//? Implement ALPHA VANTAGE Search Query API for Search bar function

// const ALPHA_VANTAGE_API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;
const FINANCIAL_MODELING_API_KEY = import.meta.env
  .VITE_FINANCIAL_MODELING_API_KEY;
interface Data {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changesPercentage: number;
}

const MainDashboard: React.FC = () => {
  const [gainers, setGainers] = useState<Data[] | null>(null);
  const [losers, setLosers] = useState<Data[] | null>(null);

  const fetchGainLose = async () => {
    try {
      const [gainersResponse, losersResponse] = await axios.all([
        axios.get<Data[]>(
          `https://financialmodelingprep.com/api/v3/stock_market/gainers?apikey=${FINANCIAL_MODELING_API_KEY}`
        ),
        axios.get<Data[]>(
          `https://financialmodelingprep.com/api/v3/stock_market/losers?apikey=${FINANCIAL_MODELING_API_KEY}`
        ),
      ]);
      if (gainersResponse && losersResponse) {
        setGainers(gainersResponse.data);
        setLosers(losersResponse.data);
        console.log(gainersResponse.data);
        console.log(losersResponse.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchGainLose();
  }, []);

  return (
    <>
      <h2>US STOCK MARKET</h2>
      <h4>Today Top Gainers</h4>
      <Table striped>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Name</th>
            <th>Price</th>
            <th>Change</th>
            <th>Change %</th>
          </tr>
        </thead>
        <tbody>
          {gainers &&
            gainers.map((data, i) => (
              <tr key={i}>
                <td>{data?.symbol}</td>
                <td>{data?.name}</td>
                <td>{data?.price}</td>
                <td>{data?.change}</td>
                <td>{data?.changesPercentage}</td>
              </tr>
            ))}
        </tbody>
      </Table>
      <h4>Today Top Losers</h4>
      <Table striped>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Name</th>
            <th>Price</th>
            <th>Change</th>
            <th>Change %</th>
          </tr>
        </thead>
        <tbody>
          {losers &&
            losers.map((data, i) => (
              <tr key={i}>
                <td>{data?.symbol}</td>
                <td>{data?.name}</td>
                <td>{data?.price}</td>
                <td>{data?.change}</td>
                <td>{data?.changesPercentage}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    </>
  );
};

export default MainDashboard;
