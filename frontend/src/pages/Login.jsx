import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      await login(username, password);

      navigate("/");
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
        <h2>Log in</h2>

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
          Login
        </button>

        <p className="auth-alt-action">
          Don't have an account?{" "}
          <Link to="/register">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Login;