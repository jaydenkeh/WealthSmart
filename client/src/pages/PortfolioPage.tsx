import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../functions/UserAuth";
import { AuthContext } from "../context/AuthContext";
import { Table } from "react-bootstrap";
import axios from "axios";
import Portfolio from "../assets/Portfolio.jpg";
import { Pagination } from "react-bootstrap";

const FINANCIAL_MODELING_API_KEY = import.meta.env
  .VITE_FINANCIAL_MODELING_API_KEY;
const FINANCIAL_MODELING_API_KEY_2 = import.meta.env
  .VITE_FINANCIAL_MODELING_API_KEY_2;
const FINANCIAL_MODELING_API_KEY_3 = import.meta.env
  .VITE_FINANCIAL_MODELING_API_KEY_3;
const FINANCIAL_MODELING_API_KEY_4 = import.meta.env
  .VITE_FINANCIAL_MODELING_API_KEY_4;
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
interface AccountValueData {
  totalCashBalance: number;
  accumulatedProfitLoss: number;
  userEmail: string;
}
interface Quote {
  symbol: string;
  price: number;
}

const PortfolioPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated, setIsLoading } =
    useContext(AuthContext);
  const [userData, setUserData] = useState<UserData>({
    userName: "",
    email: "",
  });
  const [portfolioData, setPortfolioData] = useState<PortfolioData[] | null>(
    null
  );
  const [accountValueData, setAccountValueData] =
    useState<AccountValueData | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

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
    fetchPortfolio();
    fetchUserAccountValue();
  }, [userData]);

  const fetchPortfolio = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/portfolio/${userData.email}`
      );
      setPortfolioData(response.data.portfolio);
      setTotalPages(Math.ceil(response.data.portfolio.length / itemsPerPage));
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUserAccountValue = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/accountvalue/${userData.email}`
      );
      setAccountValueData(response.data.accountValue);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const portfolioSymbols = portfolioData?.map(
      (portfolio) => portfolio.symbol
    );
    const symbols = portfolioSymbols?.join(",");
    const fetchQuotes = async () => {
      try {
        const response = await axios.get<Quote[]>(
          `https://financialmodelingprep.com/api/v3/quote/${symbols}?apikey=${FINANCIAL_MODELING_API_KEY}`
        );
        setQuotes(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchQuotes();
  }, [portfolioData]);

  // function calculates the current total securities and profit&loss values for presentation purpose
  const calculateTotals = () => {
    let totalSecuritiesValue = 0;
    let totalProfitLoss = 0;
    if (portfolioData && quotes.length > 0) {
      portfolioData.forEach((portfolio) => {
        let currentQuote = quotes.find(
          (quote) => quote.symbol === portfolio.symbol
        );
        if (currentQuote) {
          let profitLoss =
            (currentQuote.price - portfolio.purchasePrice) * portfolio.quantity;
          totalSecuritiesValue += currentQuote.price * portfolio.quantity;
          totalProfitLoss += profitLoss;
        }
      });
    }
    return [totalSecuritiesValue, totalProfitLoss];
  };

  const [totalSecuritiesValue, totalProfitLoss] = calculateTotals();

  return (
    <>
      <div className="portfolio-container">
        <h3>{userData.userName}'s Portfolio</h3>
        <div className="portfolio-values">
          <p>
            Total Cash Balance (USD): $
            {accountValueData?.totalCashBalance
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </p>
          <p>
            Total Securities Value (USD): $
            {totalSecuritiesValue
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </p>
          <p>
            Total Accumulated Profit and Loss (USD): $
            {(totalProfitLoss + (accountValueData?.accumulatedProfitLoss ?? 0))
              .toFixed(2)
              .toString()
              .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
          </p>
        </div>
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
              portfolioData
                .slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                )
                .map((portfolio, index) => {
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
                  let securityValue =
                    portfolio.purchasePrice * portfolio.quantity + profitLoss;
                  return (
                    <tr key={index}>
                      <td>
                        <span
                          className="portfolio-symbol-button"
                          onClick={() =>
                            navigate(`/symbol/${portfolio.symbol}`)
                          }
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
        {totalPages != 1 ? (
          <Pagination>
            <Pagination.First
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            />
            <Pagination.Prev
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            />
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Pagination.Item
                key={page}
                active={page === currentPage}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
            <Pagination.Last
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        ) : null}
        <img src={Portfolio} className="portfolio-img" />
      </div>
    </>
  );
};

export default PortfolioPage;
