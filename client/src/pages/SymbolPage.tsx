import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

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
  vwap: number;
}

const SymbolPage: React.FC = () => {
  const params = useParams();
  const [dailyData, setDailyData] = useState<Data[]>([]);
  const [chartData, setChartData] = useState<number[][]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDaily();
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
      <h2>US</h2>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </>
  );
};

export default SymbolPage;
