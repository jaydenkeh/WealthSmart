import React, { useState, useEffect, useContext, SyntheticEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { UserAuth } from "../functions/UserAuth";
import { AuthContext } from "../context/AuthContext";
import Chart from "../components/Chart";

const FINANCIAL_MODELING_API_KEY = import.meta.env
  .VITE_FINANCIAL_MODELING_API_KEY;
const FINANCIAL_MODELING_API_KEY_2 = import.meta.env
  .VITE_FINANCIAL_MODELING_API_KEY_2;
const FINANCIAL_MODELING_API_KEY_3 = import.meta.env
  .VITE_FINANCIAL_MODELING_API_KEY_3;
const TRADING_URL = "http://localhost:3000/api/trading";
const WATCHLIST_URL = "http://localhost:3000/api/watchlist";

interface UserData {
  userName: string;
  email: string;
}
interface CompanyQuote {
  name: string;
  symbol: string;
  price: number;
  changesPercentage: number;
  change: number;
  dayLow: number;
  dayHigh: number;
  yearLow: number;
  yearHigh: number;
  volume: number;
  open: number;
  previousClose: number;
}

interface TradingData {
  action: "buy" | "sell";
  price: number;
  symbol: string;
  quantity: number;
  userEmail: string;
}

const SymbolPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [userData, setUserData] = useState<UserData>({
    userName: "",
    email: "",
  });
  const params = useParams();
  const [companyQuote, setCompanyQuote] = useState<CompanyQuote[]>([]);
  const [tradingData, setTradingData] = useState<TradingData>({
    action: "buy",
    price: 0,
    symbol: "",
    quantity: 0,
    userEmail: "",
  });
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [isAddedToWatchlist, setIsAddedToWatchlist] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const userAuth = await UserAuth();
      console.log(userAuth);
      if (userAuth) {
        setUserData({ userName: userAuth.userName, email: userAuth.email });
        setIsAuthenticated(true);
      } else {
        navigate("/login");
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    fetchCompanyQuote();
  }, [params.symbol]);

  const fetchCompanyQuote = async () => {
    try {
      const response = await axios.get(
        `https://financialmodelingprep.com/api/v3/quote/${params.symbol}?apikey=${FINANCIAL_MODELING_API_KEY_3}`
      );
      if (response.data) {
        setCompanyQuote(response.data);
        setTradingData({
          ...tradingData,
          symbol: response.data[0].symbol,
          price: response.data[0].previousClose,
        });
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const checkWatchlist = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/watchlist/checkwatchlist/${userData.email}/${companyQuote[0]?.symbol}`
        );
        if (response.status === 200) {
          if (response?.data?.inWatchlist?.symbol === companyQuote[0]?.symbol) {
            setIsAddedToWatchlist(true);
          }
        } else if (response.status === 404) {
          setIsAddedToWatchlist(false);
        }
        console.log(response);
      } catch (err) {
        console.log(err);
      }
    };
    checkWatchlist();
  }, [companyQuote]);

  const handleAddToWatchlist = async () => {
    setWatchlistLoading(true);
    try {
      const response = await axios.post(
        WATCHLIST_URL,
        {
          userEmail: userData.email,
          symbol: companyQuote[0].symbol,
          companyName: companyQuote[0].name,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (err) {
      console.log(err);
    } finally {
      setWatchlistLoading(false);
      setIsAddedToWatchlist(true);
    }
  };

  const handleDeleteFromWatchlist = async () => {
    setWatchlistLoading(true);
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/watchlist/${userData.email}/${companyQuote[0].symbol}`
      );
    } catch (err) {
      console.log(err);
    } finally {
      setWatchlistLoading(false);
      setIsAddedToWatchlist(false);
    }
  };

  const handleOrder = async (e: SyntheticEvent) => {
    e.preventDefault();
    setOrderLoading(true);
    try {
      // check if its a buy or sell; if sell, check with current closing price and see if its a profit or loss
      const response = await axios.post(
        TRADING_URL,
        {
          action: tradingData.action,
          price: tradingData.price,
          symbol: tradingData.symbol,
          quantity: tradingData.quantity,
          userEmail: userData.email,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      if (response.status === 201) {
        setTradingData({
          action: "buy",
          price: companyQuote[0].previousClose,
          symbol: companyQuote[0].symbol,
          quantity: 0,
          userEmail: userData.email,
        });
        setMessage("Trade executed successfully");
      }
    } catch (err: any) {
      console.log(err);
      if (err.response.status === 400) {
        setMessage(err.response.data.message);
      }
    } finally {
      setOrderLoading(false);
    }
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.currentTarget;
    setTradingData({ ...tradingData, [name]: Number(value) });
    console.log(tradingData);
  };

  const handleChange2: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const { name, value } = e.currentTarget;
    setTradingData({ ...tradingData, [name]: value });
  };

  return (
    <>
      {isAuthenticated && companyQuote ? (
        <div className="company-quote">
          <h3>
            {companyQuote[0]?.name} - {companyQuote[0]?.symbol}
          </h3>
          <Button
            variant="primary"
            disabled={watchlistLoading}
            onClick={
              isAddedToWatchlist
                ? handleDeleteFromWatchlist
                : handleAddToWatchlist
            }
          >
            {watchlistLoading ? (
              <ClipLoader size={20} color="#123abc" />
            ) : isAddedToWatchlist ? (
              "Remove from Watchlist"
            ) : (
              "Add to Watchlist"
            )}
          </Button>
          <p>Price: {companyQuote[0]?.price}</p>
          <p>
            Change: {companyQuote[0]?.change} (
            {companyQuote[0]?.changesPercentage}%)
          </p>
          <div className="company-data-container">
            <p>Day High: {companyQuote[0]?.dayHigh}</p>
            <p>Day Low: {companyQuote[0]?.dayLow}</p>
            <p>52 Weeks High: {companyQuote[0]?.yearHigh}</p>
            <p>52 Weeks Low: {companyQuote[0]?.yearLow}</p>
            <p>Open: {companyQuote[0]?.open}</p>
            <p>Previous Close: {companyQuote[0]?.previousClose}</p>
            <p>Volume: {companyQuote[0]?.volume}</p>
          </div>
        </div>
      ) : null}
      <Chart symbol={companyQuote[0]?.symbol} name={companyQuote[0]?.name} />
      <br />
      {message}
      <Form onSubmit={handleOrder}>
        <Form.Group className="mb-3" controlId="action">
          <Form.Label>Action:</Form.Label>
          <Form.Select
            name="action"
            value={tradingData.action}
            onChange={handleChange2}
          >
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3" controlId="price">
          <Form.Label>Price:</Form.Label>
          <Form.Control
            type="number"
            step=".01"
            min="0"
            name="price"
            value={tradingData.price}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="quantity">
          <Form.Label>Quantity:</Form.Label>
          <Form.Control
            type="number"
            min="0"
            name="quantity"
            placeholder="Min Unit 1"
            onChange={handleChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit" disabled={orderLoading}>
          {orderLoading ? (
            <ClipLoader size={20} color="#123abc" />
          ) : (
            "Place Order"
          )}
        </Button>
      </Form>
    </>
  );
};

export default SymbolPage;
