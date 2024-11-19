import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./../styles/Header.css";

const Header = () => {
  const { token, logout, role } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="header">
      <h1 className="header-title">Eventos</h1>
      <nav className="header-nav">
        {!token ? (
          <>
            <Link to="/login" className="header-btn">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="header-btn">
              Registrarse
            </Link>
          </>
        ) : (
          <>
            {role === "admin" ? (
              <button onClick={handleLogout} className="header-btn">
                Cerrar Sesión
              </button>
            ) : (
              <>
                <Link to="/reservations" className="header-btn">
                  Mis Reservaciones
                </Link>
                <button onClick={handleLogout} className="header-btn">
                  Cerrar Sesión
                </button>
              </>
            )}
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
