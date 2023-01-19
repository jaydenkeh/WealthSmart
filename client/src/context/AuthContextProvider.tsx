import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

interface UserInfo {
  email: string | null;
  id: number | null;
  loading: boolean;
}

const UserContext = createContext<{
  userinfo: UserInfo;
  setUserInfo: React.Dispatch<React.SetStateAction<UserInfo>>;
}>({
  userinfo: { email: null, id: null, loading: false },
  setUserInfo: () => {},
});

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userinfo, setUserInfo] = useState<UserInfo>({
    email: null,
    id: null,
    loading: true,
  });
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/me",
          config
        );
        if (response.data && response.data.id) {
        }
        setUserInfo({
          email: response.data.data.user.email,
          id: response.data.data.user.id,
          loading: false,
        });
      } catch (error) {
        console.log(error);
      }
    };

    if (token) {
      fetchUser();
    } else {
      setUserInfo({ email: null, id: null, loading: false });
    }
  }, []);

  return (
    <UserContext.Provider value={{ userinfo, setUserInfo }}>
      {children}
    </UserContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(UserContext);
};
