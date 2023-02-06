import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "react-bootstrap/Table";
import axios from "axios";

interface Data {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changesPercentage: number;
}

const FINANCIAL_MODELING_API_KEY = import.meta.env
  .VITE_FINANCIAL_MODELING_API_KEY;
const FINANCIAL_MODELING_API_KEY_2 = import.meta.env
  .VITE_FINANCIAL_MODELING_API_KEY_2;

const TopGainersLosers: React.FC = () => {
  const [gainers, setGainers] = useState<Data[] | null>(null);
  const [losers, setLosers] = useState<Data[] | null>(null);
  const navigate = useNavigate();
  const today = new Date();
  const options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  };
  const formattedDate = today.toLocaleDateString("en-UK", options);

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
      <div className="gainers-losers-container">
        <div className="top-gainers-container">
          <h4>{formattedDate} Top Gainers</h4>
          <Table striped>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Name</th>
                <th>Price (USD)</th>
                <th>Change (USD)</th>
                <th>Change %</th>
              </tr>
            </thead>
            <tbody>
              {gainers &&
                gainers.map((data, i) => (
                  <tr key={i}>
                    <td>
                      <span
                        className="top-gainers-symbol-button"
                        onClick={() => navigate(`/symbol/${data.symbol}`)}
                      >
                        {data?.symbol}
                      </span>
                    </td>
                    <td>{data?.name}</td>
                    <td>
                      {data?.price
                        .toFixed(2)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </td>
                    <td>
                      {data?.change
                        .toFixed(2)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </td>
                    <td>
                      {data?.changesPercentage
                        .toFixed(2)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      %
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
        <div className="top-losers-container">
          <h4>{formattedDate} Top Losers</h4>
          <Table striped>
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Name</th>
                <th>Price (USD)</th>
                <th>Change (USD)</th>
                <th>Change %</th>
              </tr>
            </thead>
            <tbody>
              {losers &&
                losers.map((data, i) => (
                  <tr key={i}>
                    <td>
                      <span
                        className="top-losers-symbol-button"
                        onClick={() => navigate(`/symbol/${data.symbol}`)}
                      >
                        {data?.symbol}
                      </span>
                    </td>
                    <td>{data?.name}</td>
                    <td>
                      {data?.price
                        .toFixed(2)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </td>
                    <td>
                      {data?.change
                        .toFixed(2)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </td>
                    <td>
                      {data?.changesPercentage
                        .toFixed(2)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      %
                    </td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default TopGainersLosers;
