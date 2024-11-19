import React from "react";
import { useAuth } from "../context/AuthContext";
import EventList from "./EventList";
import Header from "./Header";

const UserDashboard = () => {
  const { token } = useAuth();

  return (
    <div>
      <Header />
      <EventList token={token} showLogout={false} />
    </div>
  );
};

export default UserDashboard;
