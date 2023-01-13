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

  const fetchGainers = async () => {
    try {
      const response = await axios.get<Data[]>(
        `https://financialmodelingprep.com/api/v3/stock_market/gainers?apikey=${FINANCIAL_MODELING_API_KEY}`
      );
      if (response.data) {
        setGainers(response.data);
        console.log(response.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchGainers();
  }, []);

  return (
    <>
      <h2>US STOCK MARKET</h2>
      <h3>Today Top Gainers</h3>
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
        {/* To map out the table body*/}
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
      <h3>Today Top Losers</h3>
    </>
  );
};

export default MainDashboard;
