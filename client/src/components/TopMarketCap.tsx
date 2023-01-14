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

const TopMarketCap: React.FC = () => {
  const [market, setMarket] = useState<Data[] | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchMarket = async () => {
    setLoading(true); // to implement loading component
    try {
      const response = await axios.get<Data[]>(
        `https://financialmodelingprep.com/api/v3/stock-screener?marketCapMoreThan=75000000000&apikey=${FINANCIAL_MODELING_API_KEY}`
      );

      if (response) {
        setMarket(response.data);
        console.log(response.data);
      }
    } catch (err) {
      console.log(err);
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
            <th>Market cap</th>
            <th>Price</th>
            <th>Volume</th>
            <th>Exchange</th>
            <th>Industry</th>
          </tr>
        </thead>
        <tbody>
          {market &&
            market.map((data, i) => (
              <tr key={i}>
                <td>{data?.symbol}</td>
                <td>{data?.companyName}</td>
                <td>{data?.marketCap}</td>
                <td>{data?.price}</td>
                <td>{data?.volume}</td>
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
