import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import Trading from "../components/Trading";
import { UserAuth } from "../functions/UserAuth";
import { AuthContext } from "../context/AuthContext";

const FINANCIAL_MODELING_API_KEY = import.meta.env
  .VITE_FINANCIAL_MODELING_API_KEY;
const FINANCIAL_MODELING_API_KEY_2 = import.meta.env
  .VITE_FINANCIAL_MODELING_API_KEY_2;

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

const SymbolPage: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [dailyData, setDailyData] = useState<Data[]>([]);
  const [chartData, setChartData] = useState<number[][]>([]);
  const [companyQuote, setCompanyQuote] = useState<CompanyQuote[]>([]);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(false);
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
      console.log(chartData);
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
        console.log(response.data.historical);
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
      if (response) {
        setCompanyQuote(response.data);
        console.log(response.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
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
      <Trading
        userEmail={userEmail}
        symbol={companyQuote[0].symbol}
        previousClose={companyQuote[0].previousClose}
      />
    </>
  );
};

export default SymbolPage;
