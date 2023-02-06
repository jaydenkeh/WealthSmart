import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../functions/UserAuth";
import { AuthContext } from "../context/AuthContext";
import { Table } from "react-bootstrap";
import { Pagination } from "react-bootstrap";
import axios from "axios";
import TradeHistory from "../assets/TradeHistory.jpg";
interface UserData {
  userName: string;
  email: string;
}

interface HistoryData {
  action: string;
  price: number;
  symbol: string;
  quantity: number;
  date: Date;
  profitloss: number;
}

const TradeHistoryPage: React.FC = () => {
  const { isAuthenticated, setIsAuthenticated, setIsLoading } =
    useContext(AuthContext);
  const [userData, setUserData] = useState<UserData>({
    userName: "",
    email: "",
  });
  const navigate = useNavigate();
  const [historyData, setHistoryData] = useState<HistoryData[]>([]);
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
    const fetchHistory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/trading/${userData.email}`
        );
        setHistoryData(response.data.tradingHistory);
        setTotalPages(
          Math.ceil(response.data.tradingHistory.length / itemsPerPage)
        );
      } catch (err) {
        console.log(err);
      }
    };
    fetchHistory();
  }, [userData]);

  return (
    <>
      <div className="trading-history-container">
        <h3>{userData.userName}'s Trading History</h3>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Date</th>
              <th>Action</th>
              <th>Symbol</th>
              <th>Quantity</th>
              <th>Price (USD)</th>
              <th>Profit/Loss (USD)</th>
            </tr>
          </thead>
          <tbody>
            {isAuthenticated && historyData ? (
              historyData
                .slice(
                  (currentPage - 1) * itemsPerPage,
                  currentPage * itemsPerPage
                )
                .map((history, index) => (
                  <tr key={index}>
                    <td>
                      {new Date(history?.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      {history?.action.charAt(0).toUpperCase() +
                        history?.action.slice(1)}
                    </td>
                    <td>{history?.symbol}</td>
                    <td>{history?.quantity}</td>
                    <td>
                      {history?.price
                        .toFixed(2)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </td>
                    <td>
                      {history.profitloss === 0
                        ? "No profit or loss made"
                        : history?.profitloss
                            .toFixed(2)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan={6}>Loading...</td>
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

        <img src={TradeHistory} className="trade-history-img" />
      </div>
    </>
  );
};

export default TradeHistoryPage;
