import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
const FINANCIAL_MODELING_API_KEY_2 = import.meta.env
  .VITE_FINANCIAL_MODELING_API_KEY_2;
const FINANCIAL_MODELING_API_KEY_3 = import.meta.env
  .VITE_FINANCIAL_MODELING_API_KEY_3;

const MARKET_CAP_URL = `https://financialmodelingprep.com/api/v3/stock-screener`;

const TopMarketCap: React.FC = () => {
  const [market, setMarket] = useState<Data[] | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchMarket = async () => {
    setLoading(true); // to implement loading component
    try {
      const response = await axios.get<Data[]>(MARKET_CAP_URL, {
        params: {
          marketCapMoreThan: 75000000000,
          isEtf: false,
          isActivelyTrading: true,
          exchange: "NYSE,NASDAQ",
          apikey: FINANCIAL_MODELING_API_KEY,
        },
      });
      if (response) {
        setMarket(response.data);
        console.log(response.data);
      }
    } catch (err) {
      console.log(err);
      // const response = await axios.get<Data[]>(MARKET_CAP_URL, {
      //   params: {
      //     marketCapMoreThan: 75000000000,
      //     isEtf: false,
      //     isActivelyTrading: true,
      //     exchange: "NYSE,NASDAQ",
      //     apikey: FINANCIAL_MODELING_API_KEY_2,
      //   },
      // });
      // if (response) {
      //   setMarket(response.data);
      //   console.log(response.data);
      // }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarket();
  }, []);

  return (
    <>
      <h4>Largest companies by market capitalization</h4>
      <Table striped>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Name</th>
            <th>Market cap (USD)</th>
            <th>Price (USD)</th>
            <th>Volume</th>
            <th>Exchange</th>
            <th>Industry</th>
          </tr>
        </thead>
        <tbody>
          {market &&
            market
              .filter((data) => data.volume && data.industry)
              .map((data, i) => (
                <tr key={i}>
                  <td>
                    <span
                      className="symbol-button"
                      onClick={() => navigate(`/symbol/${data.symbol}`)}
                    >
                      {data?.symbol}
                    </span>
                  </td>
                  <td>{data?.companyName}</td>
                  <td>
                    {data?.marketCap
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </td>
                  <td>{data?.price}</td>
                  <td>
                    {data?.volume
                      .toString()
                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  </td>
                  <td>{data?.exchangeShortName}</td>
                  <td>{data?.industry}</td>
                </tr>
              ))}
        </tbody>
      </Table>
    </>
  );
};

export default TopMarketCap;
