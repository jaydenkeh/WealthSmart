import React, { useState, SyntheticEvent, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios, { AxiosError } from "axios";

interface Props {
  userEmail: string;
  symbol: string;
  previousClose: number;
}
interface FormData {
  action: "buy" | "sell";
  price: number;
  symbol: string;
  quantity: number;
  userEmail: string;
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

const FINANCIAL_MODELING_API_KEY = import.meta.env
  .VITE_FINANCIAL_MODELING_API_KEY;
const TRADING_URL = "http://localhost:3000/api/trading";

const Trading: React.FC<Props> = ({ userEmail, symbol, previousClose }) => {
  const [formData, setFormData] = useState<FormData>({
    action: "buy",
    price: previousClose,
    symbol: symbol,
    quantity: 0,
    userEmail: userEmail,
  });
  const [companyQuote, setCompanyQuote] = useState<CompanyQuote[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const params = useParams();

  useEffect(() => {
    fetchCompanyQuote();
  }, [params.symbol]);

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        TRADING_URL,
        {
          action: formData.action,
          price: formData.price,
          symbol: formData.symbol,
          quantity: formData.quantity,
          userEmail: formData.userEmail,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(response?.data);
      if (response.status === 201) {
        setFormData({
          action: "buy",
          price: previousClose,
          symbol: "",
          quantity: 0,
          userEmail: userEmail,
        });
        setMessage("Trade executed successfully");
      }
    } catch (err: any) {
      if (typeof err === "object" && "response" in err) {
        const axiosError = err as AxiosError;
        if (axiosError?.response?.status === 400) {
          setMessage(err.response.data.message);
        } else {
          setMessage("No Server Response");
        }
      }
    }
  };

  const fetchCompanyQuote = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://financialmodelingprep.com/api/v3/quote/${params.symbol}?apikey=${FINANCIAL_MODELING_API_KEY}`
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

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.currentTarget;
    setFormData({ ...formData, [name]: value });
    console.log(formData);
  };

  const handleChange2: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const { name, value } = e.currentTarget;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <>
      {message}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="action">
          <Form.Label>Action:</Form.Label>
          <Form.Select
            name="action"
            value={formData.action}
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
            value={formData.price}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="quantity">
          <Form.Label>Quantity:</Form.Label>
          <Form.Control
            type="number"
            name="quantity"
            value={formData.quantity}
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

export default Trading;
