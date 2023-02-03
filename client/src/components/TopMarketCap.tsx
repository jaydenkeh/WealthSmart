import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "react-bootstrap/Table";
import axios from "axios";
import { Pagination } from "react-bootstrap";
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
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 25;

  const fetchMarket = async () => {
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
        setTotalPages(Math.ceil(response.data.length / itemsPerPage));
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchMarket();
  }, []);

  return (
    <>
      <div className="market-cap-container">
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
                .slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                )
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
                    <td>
                      {data?.price
                        .toFixed(2)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </td>
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
        <Pagination>
          <Pagination.First onClick={() => setCurrentPage(1)} />
          <Pagination.Prev
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Pagination.Item
              key={page}
              active={page === currentPage}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </Pagination.Item>
          ))}
          <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} />
          <Pagination.Last onClick={() => setCurrentPage(totalPages)} />
        </Pagination>
      </div>
    </>
  );
};

export default TopMarketCap;
