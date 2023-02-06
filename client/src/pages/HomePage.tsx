import React, { useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import MainDashboard from "../components/MainDashboard";
import { UserAuth } from "../functions/UserAuth";
import { AuthContext } from "../context/AuthContext";

const HomePage: React.FC = () => {
  const { setIsAuthenticated, setIsLoading } = useContext(AuthContext);
  const navigate = useNavigate();

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
        setIsAuthenticated(true);
      } else {
        navigate("/login");
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
