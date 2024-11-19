import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Header from "./Header";
import "./../styles/EventDetails.css";

const EventDetails = () => {
  const { token } = useAuth();
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvent(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar los detalles del evento:", err);
        setMessage("Error al cargar los detalles del evento.");
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id, token]);

  const handleReservation = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/reservations",
        { eventId: id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(response.data.message);
      const updatedEvent = { ...event, tickets: event.tickets - quantity };
      setEvent(updatedEvent);
      setQuantity(1);
    } catch (err) {
      console.error("Error al realizar la reserva:", err);
      setMessage(err.response?.data?.message || "Error al realizar la reserva.");
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <p className="message">Cargando detalles del evento...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div>
        <Header />
        <p className="message error">Error al cargar el evento.</p>
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="event-details-container">
        <h1>Detalles del Evento</h1>
        <h2>{event.name}</h2>
        <p>
          <strong>Fecha:</strong> {new Date(event.date).toLocaleDateString()}
        </p>
        <p>
          <strong>Ubicación:</strong> {event.location}
        </p>
        <p>
          <strong>Tickets Disponibles:</strong> {event.tickets}
        </p>

        <form className="reservation-form" onSubmit={handleReservation}>
          <h3>Reservar Tickets</h3>
          <input
            type="number"
            value={quantity}
            min="1"
            max={event.tickets}
            onChange={(e) => {
              const value = Number(e.target.value);
              if (value > event.tickets) {
                setMessage(
                  "No puedes reservar más tickets de los disponibles."
                );
              } else {
                setMessage("");
              }
              setQuantity(value);
            }}
            required
          />
          <button
            type="submit"
            disabled={quantity > event.tickets || quantity <= 0}
          >
            Reservar
          </button>
        </form>

        {message && (
          <p
            className={`message ${message.includes("Error") ? "error" : "success"
              }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default EventDetails;
