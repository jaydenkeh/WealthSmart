import React, { useState, useEffect, useContext, SyntheticEvent } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { UserAuth } from "../functions/UserAuth";
import { AuthContext } from "../context/AuthContext";

const FINANCIAL_MODELING_API_KEY = import.meta.env
  .VITE_FINANCIAL_MODELING_API_KEY;
const FINANCIAL_MODELING_API_KEY_2 = import.meta.env
  .VITE_FINANCIAL_MODELING_API_KEY_2;
const TRADING_URL = "http://localhost:3000/api/trading";

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
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    const checkAuth = async () => {
      const userinfo = await UserAuth();
      console.log(userinfo);
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
    setLoading(true); // to implement loading component
    try {
      const response = await axios.get(
        `https://financialmodelingprep.com/api/v3/historical-price-full/${params.symbol}?apikey=${FINANCIAL_MODELING_API_KEY_2}`
      );
      if (response) {
        setDailyData(response.data.historical);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanyQuote = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://financialmodelingprep.com/api/v3/quote/${params.symbol}?apikey=${FINANCIAL_MODELING_API_KEY_2}`
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
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
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
    }
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.currentTarget;
    setTradingData({ ...tradingData, [name]: parseFloat(value) });
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
      {isAuthenticated &&
        companyQuote &&
        companyQuote.map((data, i) => (
          <div key={i} className="company-quote">
            <h3>
              {data.name} - {data.symbol}
            </h3>
            <Button variant="primary">Add to Watchlist</Button>
            <p>
              Price: {data.price}
              <br />
              Change: {data.change} ({data.changesPercentage})
            </p>
            <div className="company-data-container">
              <p>
                High: {data.dayHigh}
                <br />
                Low: {data.dayLow}
              </p>
              <p>
                52 weeks High: {data.yearHigh}
                <br />
                52 weeks Low: {data.yearLow}
              </p>
              <p>
                Open: {data.open}
                <br />
                Previous Close: {data.previousClose}
              </p>
              <p>Volume: {data.volume}</p>
            </div>
          </div>
        ))}
      <HighchartsReact highcharts={Highcharts} options={options} />
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
            name="price"
            value={tradingData.price}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="quantity">
          <Form.Label>Quantity:</Form.Label>
          <Form.Control
            type="number"
            name="quantity"
            value={tradingData.quantity}
            onChange={handleChange}
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </>
  );
};

export default SymbolPage;
