import React from "react";
import { useAuth } from "../context/AuthContext";
import AdminDashboard from "./AdminDashboard";
import UserDashboard from "./UserDashboard";

const Dashboard = () => {
  const { role } = useAuth();

  if (!role) {
    return <p>Cargando...</p>;
  }

  if (role === "admin") {
    return <AdminDashboard />;
  } else if (role === "user") {
    return <UserDashboard />;
  } else {
    return <p>Error: Rol desconocido.</p>;
  }
};

export default Dashboard;
