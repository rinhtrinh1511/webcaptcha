import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const { isSuccess } = useSelector((state) => state.info);
  const token = localStorage.getItem("token");

  if (token && isSuccess) {
    return <Navigate to="/" />;
  }

  return children;
};

export default PublicRoute;
