import React, { useState, useEffect, useContext, SyntheticEvent } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../functions/UserAuth";
import { AuthContext } from "../context/AuthContext";

interface UserData {
  userName: string;
  email: string;
}

const TradeHistoryPage: React.FC = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);
  const [userData, setUserData] = useState<UserData>({
    userName: "",
    email: "",
  });
  const navigate = useNavigate();

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

  return <div>TradeHistoryPage</div>;
};

export default TradeHistoryPage;
