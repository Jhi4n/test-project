import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./../styles/MyReservations.css";

const MyReservations = () => {
  const { token } = useAuth();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const userId = 1;
        const response = await axios.get(`http://localhost:5000/reservations/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Reservas recibidas desde el backend:", response.data);

        const groupedReservations = response.data.reduce((acc, reservation) => {
          const existing = acc.find((item) => item.event_id === reservation.event_id);
          if (existing) {
            existing.quantity += reservation.quantity;
          } else {
            acc.push({ ...reservation });
          }
          return acc;
        }, []);

        setReservations(groupedReservations);
        setLoading(false);
      } catch (err) {
        console.error("Error al cargar las reservas:", err);
        setError("No se pudieron cargar las reservas.");
        setLoading(false);
      }
    };

    fetchReservations();
  }, [token]);

  if (loading) return <p>Cargando reservas...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="reservations-container">
      <h1>Mis Reservas</h1>
      {reservations.length === 0 ? (
        <p>No tienes reservas realizadas.</p>
      ) : (
        <ul className="reservations-list">
          {reservations.map((reservation) => (
            <li key={reservation.event_id} className="reservation-card">
              <p><strong>Evento:</strong> {reservation.event_name}</p>
              <p><strong>Cantidad Total:</strong> {reservation.quantity}</p>
              <p>
                <strong>Última Fecha de Reserva:</strong>{" "}
                {reservation.created_at
                  ? new Date(reservation.created_at).toLocaleString("es-ES", {
                    dateStyle: "medium"
                  })
                  : "Fecha no disponible"}
              </p>
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => navigate("/dashboard")}>Volver al Dashboard</button>
    </div>
  );
};

export default MyReservations;
