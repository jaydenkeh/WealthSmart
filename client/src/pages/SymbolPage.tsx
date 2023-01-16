import React, { useState } from "react";
import { useParams } from "react-router-dom";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

const options = {
  title: {
    text: "My chart",
  },
  series: [
    {
      data: [1, 2, 3],
    },
  ],
};

const SymbolPage: React.FC = () => {
  const params = useParams();

  return (
    <>
      <h2>US</h2>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </>
  );
};

export default SymbolPage;
