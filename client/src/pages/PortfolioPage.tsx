import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../functions/UserAuth";
import { AuthContext } from "../context/AuthContext";
import { Table } from "react-bootstrap";
import axios from "axios";

const FINANCIAL_MODELING_API_KEY = import.meta.env
  .VITE_FINANCIAL_MODELING_API_KEY;
const FINANCIAL_MODELING_API_KEY_2 = import.meta.env
  .VITE_FINANCIAL_MODELING_API_KEY_2;
const FINANCIAL_MODELING_API_KEY_3 = import.meta.env
  .VITE_FINANCIAL_MODELING_API_KEY_3;
interface UserData {
  userName: string;
  email: string;
}

interface PortfolioData {
  id: number;
  symbol: string;
  quantity: number;
  purchasePrice: number;
  userEmail: string;
}
interface Quote {
  symbol: string;
  price: number;
}

const PortfolioPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [userData, setUserData] = useState<UserData>({
    userName: "",
    email: "",
  });
  const [portfolioData, setPortfolioData] = useState<PortfolioData[] | null>(
    null
  );
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [totalAssets, setTotalAssets] = useState<number>(100000);
  const [securitiesValue, setSecuritiesValue] = useState<number>(0);
  const [cashBalance, setCashBalance] = useState<number>(0);
  const [profitLoss, setProfitLoss] = useState<number>(0);

  useEffect(() => {
    const checkAuth = async () => {
      const userAuth = await UserAuth();
      console.log(userAuth);
      if (userAuth) {
        setUserData({ userName: userAuth.userName, email: userAuth.email });
        setIsAuthenticated(true);
      } else {
        navigate("/login");
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/portfolio/${userData.email}`
        );
        console.log(response.data.portfolio);
        setPortfolioData(response.data.portfolio);
      } catch (err) {
        console.log(err);
      }
    };
    fetchPortfolio();
  }, [userData]);

  useEffect(() => {
    if (portfolioData) {
      const portfolioSymbols = portfolioData.map(
        (portfolio) => portfolio.symbol
      );
      const symbols = portfolioSymbols.join(",");
      let securitiesValue = 0;
      let profitLoss = 0;
      let totalAssets = 100000;
      const fetchQuotes = async () => {
        try {
          const response = await axios.get<Quote[]>(
            `https://financialmodelingprep.com/api/v3/quote/${symbols}?apikey=${FINANCIAL_MODELING_API_KEY_3}`
          );
          console.log(response.data);
          setQuotes(response.data);
          response.data.forEach((quote) => {
            portfolioData.forEach((portfolio) => {
              if (portfolio.symbol === quote.symbol) {
                securitiesValue += portfolio.purchasePrice * portfolio.quantity;
                profitLoss +=
                  (quote.price - portfolio.purchasePrice) * portfolio.quantity;
              }
            });
          });
          setSecuritiesValue(securitiesValue);
          setCashBalance(totalAssets - securitiesValue);
          setProfitLoss(profitLoss);
          setTotalAssets(totalAssets + profitLoss);
        } catch (err) {
          console.log(err);
        }
      };
      fetchQuotes();
    }
  }, [portfolioData]);

  return (
    <>
      <div className="user-portfolio">
        <h3>{userData.userName}'s Portfolio</h3>
        <p>
          Total Assets (USD): $
          {totalAssets
            .toFixed(2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </p>
        <p>
          Total Securities Value (USD): $
          {securitiesValue
            .toFixed(2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </p>
        <p>
          Cash Balance (USD): $
          {cashBalance
            .toFixed(2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </p>
        <p>
          Profit and Loss (USD): $
          {profitLoss
            .toFixed(2)
            .toString()
            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        </p>
        <h4>Current securities holdings</h4>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Position</th>
              <th>Purchase Price (USD)</th>
              <th>Security Value (USD)</th>
              <th>Profit/Loss (USD)</th>
            </tr>
          </thead>
          <tbody>
            {isAuthenticated && portfolioData ? (
              portfolioData.map((portfolio, index) => {
                let securityValue =
                  portfolio.purchasePrice * portfolio.quantity;
                let profitLoss = 0;
                if (quotes && quotes.length > 0) {
                  let currentQuote = quotes.find(
                    (quote) => quote.symbol === portfolio.symbol
                  );
                  if (currentQuote) {
                    profitLoss =
                      (currentQuote.price - portfolio.purchasePrice) *
                      portfolio.quantity;
                  }
                }
                return (
                  <tr key={index}>
                    <td>
                      <span
                        className="portfolio-symbol-button"
                        onClick={() => navigate(`/symbol/${portfolio.symbol}`)}
                      >
                        {portfolio?.symbol}
                      </span>
                    </td>
                    <td>{portfolio?.quantity}</td>
                    <td>
                      $
                      {portfolio?.purchasePrice
                        .toFixed(2)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </td>
                    <td>
                      $
                      {securityValue
                        .toFixed(2)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </td>
                    <td>
                      $
                      {profitLoss
                        .toFixed(2)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5}>Loading...</td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    </>
  );
};

export default PortfolioPage;
