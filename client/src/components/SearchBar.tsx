import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";

const FINANCIAL_MODELING_API_KEY = import.meta.env
  .VITE_FINANCIAL_MODELING_API_KEY;
const FINANCIAL_MODELING_API_KEY_2 = import.meta.env
  .VITE_FINANCIAL_MODELING_API_KEY_2;
const FINANCIAL_MODELING_API_KEY_3 = import.meta.env
  .VITE_FINANCIAL_MODELING_API_KEY_3;
const FINANCIAL_MODELING_API_KEY_4 = import.meta.env
  .VITE_FINANCIAL_MODELING_API_KEY_4;
interface Ticker {
  symbol: string;
  name: string;
}
const SearchBar: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [tickers, setTickers] = useState<Ticker[]>([]);
  const navigate = useNavigate();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(event.target.value);
  };

  useEffect(() => {
    const fetchTickers = async () => {
      if (!searchText) {
        return;
      }
      try {
        const response = await axios.get(
          `https://financialmodelingprep.com/api/v3/search?query=${searchText}&limit=7&exchange=NASDAQ,NYSE&apikey=${FINANCIAL_MODELING_API_KEY}`
        );
        console.log(response.data);
        setTickers(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTickers();
  }, [searchText]);

  const handleClick = (ticker: Ticker) => {
    navigate(`/symbol/${ticker.symbol}`);
    setSearchText("");
  };

  return (
    <>
      <div style={{ display: "flex" }}>
        <Form className="d-flex">
          <Form.Control
            type="search"
            placeholder="Search here"
            className="me-2"
            aria-label="Search"
            value={searchText}
            onChange={handleChange}
          />
          <Button variant="outline-success">Search</Button>
        </Form>
        <div className="search-results">
          {searchText.length > 0
            ? tickers.map((ticker) => (
                <div
                  key={ticker.symbol}
                  className="single-search-result"
                  onClick={() => handleClick(ticker)}
                >
                  {ticker.name}
                </div>
              ))
            : null}
        </div>
      </div>
    </>
  );
};

export default SearchBar;
