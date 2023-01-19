import "./App.css";
import { useState, createContext } from "react";
import { Routes, Route } from "react-router-dom";
import NavigationBar from "./components/NavigationBar";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import SymbolPage from "./pages/SymbolPage";

export const LoginContext = createContext({
  isLoggedIn: false,
  setIsLoggedIn: (isLoggedIn: boolean) => {},
});

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      <div className="App">
        <NavigationBar />
        <Routes>
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<HomePage />} />
          <Route path="/symbol/:symbol" element={<SymbolPage />} />
          <Route
            path="*"
            element={<p>The page you are searching is not found</p>}
          />
        </Routes>
      </div>
    </LoginContext.Provider>
  );
}

export default App;
