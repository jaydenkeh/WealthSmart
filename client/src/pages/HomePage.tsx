import React from "react";
import MainDashboard from "../components/MainDashboard";
import NavigationBar from "../components/NavigationBar";

const HomePage: React.FC = () => {
  return (
    <>
      <NavigationBar />
      <MainDashboard />
    </>
  );
};

export default HomePage;
