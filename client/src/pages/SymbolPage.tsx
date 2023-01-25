import React, { useState, useEffect, useContext, SyntheticEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { ClipLoader } from "react-spinners";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { UserAuth } from "../functions/UserAuth";
import { AuthContext } from "../context/AuthContext";

const FINANCIAL_MODELING_API_KEY = import.meta.env
  .VITE_FINANCIAL_MODELING_API_KEY;
const FINANCIAL_MODELING_API_KEY_2 = import.meta.env
  .VITE_FINANCIAL_MODELING_API_KEY_2;
const FINANCIAL_MODELING_API_KEY_3 = import.meta.env
  .VITE_FINANCIAL_MODELING_API_KEY_3;
const TRADING_URL = "http://localhost:3000/api/trading";
const WATCHLIST_URL = "http://localhost:3300/api/watchlist"; // Note: after previous prisma migration in the backend 3000 Port is not working therefore using 3300

interface Data {
  adjClose: number;
  change: number;
  changeOverTime: number;
  changePercent: number;
  close: number;
  date: string;
  high: number;
  label: string;
  low: number;
  open: number;
  unadjustedVolume: number;
  volume: number;
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
  const params = useParams();
  const [dailyData, setDailyData] = useState<Data[]>([]);
  const [chartData, setChartData] = useState<number[][]>([]);
  const [companyQuote, setCompanyQuote] = useState<CompanyQuote[]>([]);
  const [tradingData, setTradingData] = useState<TradingData>({
    action: "buy",
    price: 0,
    symbol: "",
    quantity: 0,
    userEmail: "",
  });
  const [userEmail, setUserEmail] = useState("");
  const [watchlistLoading, setWatchlistLoading] = useState(false);
  const [orderLoading, setOrderLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const checkAuth = async () => {
      const userinfo = await UserAuth();
      if (userinfo === undefined) {
        navigate("/login");
      } else {
        setUserEmail(userinfo.email);
        setIsAuthenticated(true);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    fetchDaily();
    fetchCompanyQuote();
  }, [params.symbol]);

  useEffect(() => {
    if (Array.isArray(dailyData)) {
      let data = dailyData.map((item: Data) => {
        return [
          Date.parse(item.date),
          item.open,
          item.high,
          item.low,
          item.close,
        ];
      });
      setChartData(data);
    }
  }, [dailyData]);

  const fetchDaily = async () => {
    try {
      const response = await axios.get(
        `https://financialmodelingprep.com/api/v3/historical-price-full/${params.symbol}?apikey=${FINANCIAL_MODELING_API_KEY}`
      );
      if (response) {
        setDailyData(response.data.historical);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCompanyQuote = async () => {
    try {
      const response = await axios.get(
        `https://financialmodelingprep.com/api/v3/quote/${params.symbol}?apikey=${FINANCIAL_MODELING_API_KEY}`
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

  const handleAddToWatchlist = async (e: SyntheticEvent) => {
    e.preventDefault();
    setWatchlistLoading(true);
    try {
      const response = await axios.post(
        WATCHLIST_URL,
        {
          userEmail: userEmail,
          symbol: companyQuote[0].symbol,
          companyName: companyQuote[0].name,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response);
    } catch (err) {
      console.log(err);
    } finally {
      setWatchlistLoading(false);
    }
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setOrderLoading(true);
    try {
      const response = await axios.post(
        TRADING_URL,
        {
          action: tradingData.action,
          price: tradingData.price,
          symbol: tradingData.symbol,
          quantity: tradingData.quantity,
          userEmail: userEmail,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response?.data);
      if (response.status === 201) {
        setTradingData({
          action: "buy",
          price: companyQuote[0].previousClose,
          symbol: companyQuote[0].symbol,
          quantity: 0,
          userEmail: userEmail,
        });
        setMessage("Trade executed successfully");
      }
    } catch (err) {
      console.log(err);
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

  const options = {
    chart: {
      type: "candlestick",
      zoomType: "x",
    },
    title: {
      text: "Daily Candlestick Chart",
    },
    xAxis: {
      type: "datetime",
    },
    yAxis: {
      title: {
        text: "Price",
      },
    },
    series: [
      {
        type: "candlestick",
        name: "Daily Candlesticks",
        data: chartData,
        pointWidth: 16,
        turboThreshold: 0,
      },
    ],
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
            onClick={handleAddToWatchlist}
          >
            {watchlistLoading ? (
              <ClipLoader size={20} color="#123abc" />
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
      {/* <HighchartsReact highcharts={Highcharts} options={options} /> */}
      <br />
      {message}
      <Form onSubmit={handleSubmit}>
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
