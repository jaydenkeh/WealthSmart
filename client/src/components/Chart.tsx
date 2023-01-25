import React, { useState, useEffect } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import axios from "axios";

const FINANCIAL_MODELING_API_KEY = import.meta.env
  .VITE_FINANCIAL_MODELING_API_KEY;
const FINANCIAL_MODELING_API_KEY_2 = import.meta.env
  .VITE_FINANCIAL_MODELING_API_KEY_2;
const FINANCIAL_MODELING_API_KEY_3 = import.meta.env
  .VITE_FINANCIAL_MODELING_API_KEY_3;

interface ChartProps {
  symbol: string;
  name: string;
}
interface ChartData {
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
const Chart: React.FC<ChartProps> = ({ symbol, name }) => {
  const [dailyData, setDailyData] = useState<ChartData[]>([]);
  const [chartData, setChartData] = useState<number[][]>([]);

  useEffect(() => {
    const fetchDaily = async () => {
      try {
        const response = await axios.get(
          `https://financialmodelingprep.com/api/v3/historical-price-full/${symbol}?apikey=${FINANCIAL_MODELING_API_KEY_3}`
        );
        if (response) {
          setDailyData(response.data.historical);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchDaily();
  }, [symbol, name]);

  useEffect(() => {
    if (Array.isArray(dailyData)) {
      let oneYearAgo = new Date(
        new Date().setFullYear(new Date().getFullYear() - 1)
      );
      let data = dailyData
        .filter((item: ChartData) => new Date(item.date) >= oneYearAgo)
        .map((item: ChartData) => {
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

  const options = {
    chart: {
      type: "candlestick",
      zoomType: "x",
    },
    title: {
      text: `${name} One Year Candlestick Chart`,
    },
    xAxis: {
      type: "datetime",
    },
    yAxis: {
      title: {
        text: "Price",
      },
    },
    legend: {
      enabled: false,
    },
    plotOptions: {
      candlestick: {
        upColor: "green",
        color: "red",
        pointPadding: 1,
      },
    },
    series: [
      {
        data: chartData,
        pointWidth: 3,
      },
    ],
  };
  return (
    <>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </>
  );
};

export default Chart;
