import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { register } from "../api/auth";

function Register() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      await register(
        username,
        password
      );

      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-page">
      <form
        className="card auth-card"
        onSubmit={handleSubmit}
      >
        <span className="logo">bugboard</span>
        <h2>Create account</h2>

        {error && (
          <p className="form-error">
            {error}
          </p>
        )}

        <input
          className="auth-input"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <input
          className="auth-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button className="auth-submit" type="submit">
          Register
        </button>

        <p className="auth-alt-action">
          Already have an account?{" "}
          <Link to="/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Register;