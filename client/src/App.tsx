import "./App.css";
import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";
import SymbolPage from "./pages/SymbolPage";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="signup" element={<SignupPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/symbol/:symbol" element={<SymbolPage />} />
        <Route
          path="*"
          element={<p>The page you are searching is not found</p>}
        />
      </Routes>
    </div>
  );
}

export default App;
