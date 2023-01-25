import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../functions/UserAuth";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

interface UserData {
  userName: string;
  email: string;
}

interface WatchlistData {
  id: number;
  symbol: string;
  companyName: string;
}

interface Quote {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changesPercentage: number;
  volume: number;
}

const FINANCIAL_MODELING_API_KEY = import.meta.env
  .VITE_FINANCIAL_MODELING_API_KEY;
const FINANCIAL_MODELING_API_KEY_2 = import.meta.env
  .VITE_FINANCIAL_MODELING_API_KEY_2;

const WatchlistPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [userData, setUserData] = useState<UserData>({
    userName: "",
    email: "",
  });
  const [watchlistData, setWatchlistData] = useState<WatchlistData[] | null>(
    null
  );
  const [quotes, setQuotes] = useState<Quote[]>([]);

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
    const fetchWatchlist = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/watchlist/${userData.email}`
        );
        console.log(response.data.watchlist);
        setWatchlistData(response.data.watchlist);
      } catch (err) {
        console.log(err);
      }
    };
    fetchWatchlist();
  }, [userData]);

  useEffect(() => {
    if (watchlistData) {
      const watchlistSymbols = watchlistData.map(
        (watchlist) => watchlist.symbol
      );
      const symbols = watchlistSymbols.join(",");
      const fetchQuotes = async () => {
        try {
          const response = await axios.get<Quote[]>(
            `https://financialmodelingprep.com/api/v3/quote/${symbols}?apikey=${FINANCIAL_MODELING_API_KEY}`
          );
          console.log(response.data);
          setQuotes(response.data);
        } catch (err) {
          console.log(err);
        }
      };
      fetchQuotes();
    }
  }, [watchlistData]);

  const handleDelete = async (symbol: string) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/watchlist/${userData.email}/${symbol}`
      );
      if (response.data.error) {
        console.log(response.data.error);
      } else {
        setQuotes((prevQuotes) =>
          prevQuotes.filter((quote) => quote.symbol !== symbol)
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <h3>{userData.userName}'s Watchlist</h3>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Security Name</th>
            <th>Last (USD)</th>
            <th>Change (USD)</th>
            <th>Change %</th>
            <th>Volume</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {isAuthenticated && quotes ? (
            quotes.map((watchlist, index) => (
              <tr key={index}>
                <td>
                  {" "}
                  <span
                    className="watchlist-symbol-button"
                    onClick={() => navigate(`/symbol/${watchlist.symbol}`)}
                  >
                    {watchlist?.symbol}
                  </span>
                </td>
                <td>{watchlist?.name}</td>
                <td>{watchlist?.price}</td>
                <td>{watchlist?.change}</td>
                <td>
                  {watchlist?.changesPercentage
                    .toFixed(2)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                  %
                </td>
                <td>
                  {watchlist?.volume
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </td>
                <td>
                  <button onClick={() => handleDelete(watchlist.symbol)}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
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
    </>
  );
};

export default WatchlistPage;
