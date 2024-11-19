import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import Header from "./Header";
import "./../styles/AdminDashboard.css";

const AdminDashboard = () => {
  const { token, logout } = useAuth();
  const [events, setEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    name: "",
    date: "",
    location: "",
    tickets: 0,
  });
  const [editingEvent, setEditingEvent] = useState(null);
  const [search, setSearch] = useState("");
  const [stats, setStats] = useState({ totalEvents: 0, totalTickets: 0 });
  const [message, setMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/events", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvents(data);

        const totalTickets = data.reduce((sum, event) => sum + event.tickets, 0);
        setStats({ totalEvents: data.length, totalTickets });
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, [token]);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("es-ES", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:5000/events", newEvent, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Evento creado con éxito");
      setEvents((prev) => [...prev, { ...newEvent, id: data.eventId }]);
      setNewEvent({ name: "", date: "", location: "", tickets: 0 });
      setShowModal(false);
    } catch (error) {
      console.error("Error creating event:", error);
      setMessage("Error al crear el evento.");
    }
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setNewEvent({
      name: event.name,
      date: event.date.split("T")[0],
      location: event.location,
      tickets: event.tickets,
    });
    setShowModal(true);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/events/${editingEvent.id}`, newEvent, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Evento actualizado con éxito");
      setEvents((prev) =>
        prev.map((event) =>
          event.id === editingEvent.id ? { ...event, ...newEvent } : event
        )
      );
      setEditingEvent(null);
      setNewEvent({ name: "", date: "", location: "", tickets: 0 });
      setShowModal(false);
    } catch (error) {
      console.error("Error updating event:", error);
      setMessage("Error al actualizar el evento.");
    }
  };

  const handleDeleteEvent = async (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este evento?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("Evento eliminado con éxito");
      setEvents((prev) => prev.filter((event) => event.id !== id));
    } catch (error) {
      console.error("Error deleting event:", error);
      setMessage("Error al eliminar el evento.");
    }
  };

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(search.toLowerCase()) ||
    event.date.includes(search)
  );

  return (
    <div>
      <Header />
      <div className="dashboard-container">
        <h1>Dashboard de Administración de Eventos</h1>

        <button onClick={() => { setShowModal(true); setEditingEvent(null); setNewEvent({ name: "", date: "", location: "", tickets: 0 }); }} className="create-event-button">
          Crear Nuevo Evento
        </button>

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={() => setShowModal(false)}>&times;</span>
              <h2>{editingEvent ? "Editar Evento" : "Crear Nuevo Evento"}</h2>
              <form onSubmit={editingEvent ? handleSaveEdit : handleCreateEvent}>
                <div className="form-row">
                  <label htmlFor="name">Nombre del evento</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Nombre del evento"
                    value={newEvent.name}
                    onChange={(e) => setNewEvent({ ...newEvent, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row">
                  <label htmlFor="date">Fecha</label>
                  <input
                    id="date"
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row">
                  <label htmlFor="location">Ubicación</label>
                  <input
                    id="location"
                    type="text"
                    placeholder="Ubicación"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row">
                  <label htmlFor="tickets">Cantidad de Tickets</label>
                  <input
                    id="tickets"
                    type="number"
                    value={newEvent.tickets}
                    onChange={(e) => setNewEvent({ ...newEvent, tickets: Number(e.target.value) })}
                    required
                  />
                </div>

                <button type="submit">{editingEvent ? "Actualizar Evento" : "Crear Evento"}</button>
              </form>
            </div>
          </div>
        )}

        {message && <p className="message">{message}</p>}

        <h2>Eventos Existentes</h2>
        <input
          className="search-bar"
          type="text"
          placeholder="Buscar eventos por nombre o fecha"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ul className="event-list">
          {filteredEvents.map((event) => (
            <li key={event.id} className="event-item">
              <span>
                <strong>{event.name}</strong>
                <br />
                {formatDate(event.date)} en {event.location}
                <br />
                ({event.tickets} tickets disponibles)
              </span>
              <button onClick={() => handleEditEvent(event)}>Editar</button>
              <button onClick={() => handleDeleteEvent(event.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;
