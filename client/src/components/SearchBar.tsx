import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";

const ALPHA_VANTAGE_API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;

interface Ticker {
  "1. symbol": string;
  "2. name": string;
}
const SearchBar: React.FC = () => {
  const [searchText, setSearchText] = useState("");
  const [tickers, setTickers] = useState([]);
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
          `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${searchText}&apikey=${ALPHA_VANTAGE_API_KEY}`
        );
        setTickers(response.data.bestMatches);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTickers();
  }, [searchText]);

  const handleClick = (ticker: Ticker) => {
    navigate(`/symbol/${ticker["1. symbol"]}`);
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
            ? tickers.slice(0, 5).map((ticker) => (
                <div
                  key={ticker["1. symbol"]}
                  className="single-search-result"
                  onClick={() => handleClick(ticker)}
                >
                  {ticker["2. name"]}
                </div>
              ))
            : null}
        </div>
      </div>
    </>
  );
};

export default SearchBar;
