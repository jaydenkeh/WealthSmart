import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import MainDashboard from "../components/MainDashboard";
import { UserAuth } from "../functions/UserAuth";
import { AuthContext } from "../context/AuthContext";

const HomePage: React.FC = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const userinfo = await UserAuth();
      console.log(userinfo);
      if (userinfo === undefined) {
        navigate("/login");
      } else {
        setIsAuthenticated(true);
      }
    };
    checkAuth();
  }, []);

  return (
    <>
      <MainDashboard />
    </>
  );
};

export default HomePage;
