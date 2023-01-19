import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainDashboard from "../components/MainDashboard";
import { UserAuth } from "../functions/UserAuth";

const HomePage: React.FC = () => {
  const [isAuthenticate, setIsAuthenticate] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const userinfo = await UserAuth();
      console.log(userinfo);
      if (userinfo === undefined) {
        navigate("/login");
      } else {
        setIsAuthenticate(true);
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
