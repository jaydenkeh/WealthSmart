import React, { useState, useEffect, useContext, SyntheticEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { SyncLoader } from "react-spinners";
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
const FINANCIAL_MODELING_API_KEY_4 = import.meta.env
  .VITE_FINANCIAL_MODELING_API_KEY_4;
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

const SymbolPage: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { isAuthenticated, setIsAuthenticated, setIsLoading } =
    useContext(AuthContext);
  const [userData, setUserData] = useState<UserData>({
    userName: "",
    email: "",
  });
  const [action, setAction] = useState<string>("buy");
  const [price, setPrice] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);
  const [companyQuote, setCompanyQuote] = useState<CompanyQuote[]>([]);
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [isAddedToWatchlist, setIsAddedToWatchlist] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

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
    checkWatchlist();
  }, [userData, params.symbol]);

  const fetchCompanyQuote = async () => {
    try {
      const response = await axios.get(
        `https://financialmodelingprep.com/api/v3/quote/${params.symbol}?apikey=${FINANCIAL_MODELING_API_KEY_3}`
      );
      if (response.data) {
        setCompanyQuote(response.data);
        setPrice(response.data[0].previousClose);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const checkWatchlist = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/watchlist/checkwatchlist/${userData.email}/${params.symbol}`
      );
      if (response.status === 200) {
        if (response?.data?.inWatchlist?.symbol === params.symbol) {
          setIsAddedToWatchlist(true);
        }
      } else if (response.status === 404) {
        setIsAddedToWatchlist(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

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
      const postaction = action;
      const postprice = price;
      const postquantity = quantity;
      const tradeResponse = await axios.post(TRADING_URL, {
        action: postaction,
        price: postprice,
        symbol: params.symbol,
        quantity: postquantity,
        userEmail: userData.email,
      });
      console.log(tradeResponse);
      if (tradeResponse.status === 201) {
        setAction("buy");
        setPrice(companyQuote[0].previousClose);
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

  return (
    <>
      {isAuthenticated && companyQuote ? (
        <div className="security-quote-container">
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
              <SyncLoader size={8} color="#123abc" />
            ) : isAddedToWatchlist ? (
              "Remove from Watchlist"
            ) : (
              "Add to Watchlist"
            )}
          </Button>
          <div className="security-data-container">
            <p>
              Price: $
              {companyQuote[0]?.price
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </p>
            <p>
              Change: $
              {companyQuote[0]?.change
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
              (
              {companyQuote[0]?.changesPercentage
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              %)
            </p>
            <p>
              Day High: $
              {companyQuote[0]?.dayHigh
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </p>
            <p>
              Day Low: $
              {companyQuote[0]?.dayLow
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </p>
            <p>
              52 Weeks High: $
              {companyQuote[0]?.yearHigh
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </p>
            <p>
              52 Weeks Low: $
              {companyQuote[0]?.yearLow
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </p>
            <p>
              Open: $
              {companyQuote[0]?.open
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </p>
            <p>
              Previous Close: $
              {companyQuote[0]?.previousClose
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </p>
            <p>
              Volume:{" "}
              {companyQuote[0]?.volume
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            </p>
          </div>
        </div>
      ) : null}
      <Chart symbol={companyQuote[0]?.symbol} name={companyQuote[0]?.name} />
      <br />
      {message}
      <div className="trading-form-container">
        <h5>Place Trade</h5>
        <Form onSubmit={handleOrder}>
          <Form.Group className="mb-3 col-4" controlId="action">
            <Form.Label>Action:</Form.Label>
            <Form.Select
              name="action"
              value={action}
              onChange={(e) => setAction(e.currentTarget.value)}
            >
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3 col-4" controlId="price">
            <Form.Label>Price:</Form.Label>
            <Form.Control
              type="number"
              step=".01"
              min="0"
              name="price"
              value={price}
              onChange={(e) => setPrice(Number(e.currentTarget.value))}
            />
          </Form.Group>

          <Form.Group className="mb-3 col-4" controlId="quantity">
            <Form.Label>Quantity:</Form.Label>
            <Form.Control
              type="number"
              min="0"
              name="quantity"
              placeholder="Min Unit 1"
              defaultValue={quantity}
              onChange={(e) => setQuantity(Number(e.currentTarget.value))}
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
      </div>
    </>
  );
};

export default SymbolPage;
