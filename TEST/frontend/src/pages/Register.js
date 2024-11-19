import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import "./../styles/Auth.css";

const Register = () => {
  const [form, setForm] = useState({ username: "", password: "", role: "user" });
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/auth/register", form);
      setMessage("Registro exitoso. Ahora puedes iniciar sesión.");
    } catch (error) {
      setMessage("Error al registrarse. Intenta nuevamente.");
    }
  };

  return (
    <div className="auth-container">
      <h1>Registro</h1>
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
        <select
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="user">Usuario</option>
          <option value="admin">Administrador</option>
        </select>
        <button type="submit">Registrarse</button>
      </form>
      {message && <p className="auth-message">{message}</p>}
      <div className="auth-register">
        <p>¿Ya tienes una cuenta?</p>
        <Link to="/login" className="auth-register-btn">
          Inicia Sesión
        </Link>
      </div>
    </div>
  );
};

export default Register;
