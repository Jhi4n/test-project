import React from "react";
import EventList from "./EventList";
import Header from "./Header";

const Home = () => {
  return (
    <div>
      <Header />
      <EventList token={null} showLogout={false} />
    </div>
  );
};

export default Home;
