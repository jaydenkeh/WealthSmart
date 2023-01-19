import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

export const UserAuth = async () => {
  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  try {
    const response = await axios.get("http://localhost:3000/api/me", config);
    console.log("Test", response);
    if (response.data) {
      return { ...response.data.data.user };
    } else {
      return "Error";
    }
  } catch (error) {
    console.log(error);
  }
};
