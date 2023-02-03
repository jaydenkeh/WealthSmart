import "./App.css";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import { AuthContextProvider } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import SymbolPage from "./pages/SymbolPage";
import PortfolioPage from "./pages/PortfolioPage";
import WatchlistPage from "./pages/WatchlistPage";
import TradeHistoryPage from "./pages/TradeHistoryPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <AuthContextProvider
      value={{ isAuthenticated, setIsAuthenticated, isLoading, setIsLoading }}
    >
      <div className="App">
        <NavigationBar />
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/symbol/:symbol" element={<SymbolPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/watchlist" element={<WatchlistPage />} />
          <Route path="/trade-history" element={<TradeHistoryPage />} />
          <Route
            path="*"
            element={<p>The page you are searching is not found</p>}
          />
        </Routes>
      </div>
    </AuthContextProvider>
  );
}

export default App;
