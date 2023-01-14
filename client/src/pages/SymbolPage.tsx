import React from "react";
import { useParams } from "react-router-dom";

const params = useParams();
let test = params.symbol;
console.log(test);

const SymbolPage: React.FC = () => {
  return <div>Symbol Page</div>;
};

export default SymbolPage;
