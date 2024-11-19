import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./../styles/Home.css";

const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const EventList = ({ token }) => {
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({ date: "", location: "" });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/events", {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        setEvents(data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [token]);

  const filteredEvents = events.filter((event) => {
    const eventDate = new Date(event.date).toISOString().split("T")[0];
    const matchesDate = filters.date ? eventDate === filters.date : true;
    const matchesLocation = filters.location
      ? event.location.toLowerCase().includes(filters.location.toLowerCase())
      : true;

    return matchesDate && matchesLocation;
  });

  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="home-title">Eventos Disponibles</h1>
      </header>

      <div className="filters">
        <h2>Buscar Eventos</h2>
        <label htmlFor="date">Fecha</label>
        <input
          id="date"
          type="date"
          value={filters.date}
          onChange={(e) => setFilters({ ...filters, date: e.target.value })}
        />
        <label htmlFor="location">Lugar</label>
        <input
          id="location"
          type="text"
          placeholder="Buscar por lugar"
          value={filters.location}
          onChange={(e) =>
            setFilters({ ...filters, location: e.target.value })
          }
        />
      </div>

      <div className="home-events">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <Link
              to={`/events/${event.id}`}
              key={event.id}
              className="card"
            >
              <h2 className="card-title">{event.name}</h2>
              <p className="card-date">Fecha: {formatDate(event.date)}</p>
              <p className="card-location">Lugar: {event.location}</p>
              <p className="card-tickets">
                Tickets disponibles: {event.tickets}
              </p>
            </Link>
          ))
        ) : (
          <p className="home-no-events">
            No hay eventos disponibles para los filtros aplicados.
          </p>
        )}
      </div>
    </div>
  );
};

export default EventList;
