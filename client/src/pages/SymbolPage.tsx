import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

const FINANCIAL_MODELING_API_KEY = import.meta.env
  .VITE_FINANCIAL_MODELING_API_KEY;

const SymbolPage: React.FC = () => {
  const params = useParams();
  const [daily, setDaily] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchDaily = async () => {
    setLoading(true); // to implement loading component
    try {
      const response = await axios.get(
        `https://financialmodelingprep.com/api/v3/historical-price-full/${params.symbol}?apikey=${FINANCIAL_MODELING_API_KEY}`
      );
      if (response) {
        setDaily(response.data);
        console.log(response.data);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDaily();
  }, [params.symbol]);

  const options: Highcharts.Options = {
    title: {
      text: "1-minute and 5-minute Candlestick Chart",
    },
    plotOptions: {
      candlestick: {
        dataGrouping: {
          forced: true,
          units: [["minute", [1]]],
        },
      },
    },
    series: [
      {
        type: "candlestick",
        name: "1-minute Candlesticks",
        upColor: "green",
        color: "red",
        data: [
          [1483228800000, 36.35, 36.45, 36.05, 36.25],
          [1483228800000, 36.35, 45, 36.05, 36.25],
          [1483228800000, 36.35, 46.45, 36.05, 36.25],
          [1483228800000, 36.35, 56.45, 36.05, 36.25],
          [1483228800000, 36.35, 76.45, 36.05, 36.25],
          [1483315200000, 36.3, 36.4, 36.15, 36.35],
          [1483401600000, 36.35, 36.4, 36.25, 36.3],
          [1483488000000, 36.4, 36.45, 36.35, 36.4],
          [1483574400000, 36.45, 36.5, 36.4, 36.45],
        ],
      },
      {
        type: "candlestick",
        name: "5-minute Candlesticks",
        dataGrouping: {
          units: [["minute", [5]]],
        },
        data: [
          [1483228800000, 36.35, 36.45, 36.05, 36.25],
          [1483315200000, 36.3, 36.4, 36.15, 36.35],
          [1483401600000, 36.35, 36.4, 36.25, 36.3],
          [1483488000000, 36.4, 36.45, 36.35, 36.4],
          [1483574400000, 36.45, 36.5, 36.4, 36.45],
        ],
      },
    ],
  };

  return (
    <>
      <h2>US</h2>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </>
  );
};

export default SymbolPage;
