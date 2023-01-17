import React, { useState, SyntheticEvent } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

interface FormData {
  action: "buy" | "sell";
  price: number;
  symbol: string;
  quantity: number;
}

const Trading: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    action: "buy",
    price: 0,
    symbol: "",
    quantity: 0,
  });

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    // Perform paper trading action here
    console.log(formData);
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { name, value } = e.currentTarget;
    setFormData({ ...formData, [name]: value });
  };

  const handleChange2: React.ChangeEventHandler<HTMLSelectElement> = (e) => {
    const { name, value } = e.currentTarget;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <>
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
