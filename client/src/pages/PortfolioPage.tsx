import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../functions/UserAuth";
import { AuthContext } from "../context/AuthContext";
import { Table } from "react-bootstrap";

interface UserData {
  userName: string;
  email: string;
}

const PortfolioPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [userData, setUserData] = useState<UserData>({
    userName: "",
    email: "",
  });
  const [portfolioData, setPortfolioData] = useState([]);

  useEffect(() => {
    const checkAuth = async () => {
      const userAuth = await UserAuth();
      console.log(userAuth);
      if (userAuth === undefined) {
        navigate("/login");
      } else {
        setUserData(userAuth);
        setIsAuthenticated(true);
      }
    };
    checkAuth();
  }, []);

  return (
    <>
      <div className="user-portfolio">
        <h3>{userData.userName}'s Portfolio</h3>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Quantity</th>
              <th>Purchase Price</th>
            </tr>
          </thead>
          <tbody>
            {/* {portfolioData.map((portfolio, index) => (
            <tr key={index}>
              <td>{portfolio.symbol}</td>
              <td>{portfolio.quantity}</td>
              <td>{portfolio.purchasePrice}</td>
            </tr>
          ))} */}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default PortfolioPage;
