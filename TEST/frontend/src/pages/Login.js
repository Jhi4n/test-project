import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./../styles/Auth.css";

const Login = () => {
  const { login } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:5000/auth/login", form);
      login(data.token, data.role);
    } catch (error) {
      setError("Credenciales inválidas. Intenta nuevamente.");
    }
  };

  return (
    <div className="auth-container">
      <h1>Iniciar Sesión</h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Usuario"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        />
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <span
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
      {error && <p className="auth-error">{error}</p>}
      <div className="auth-register">
        <p>¿No tienes una cuenta?</p>
        <Link to="/register" className="auth-register-btn">
          Registrarse
        </Link>
      </div>
    </div>
  );
};

export default Login;
