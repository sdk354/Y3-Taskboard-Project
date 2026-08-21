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
        className="auth-card"
        onSubmit={handleSubmit}
      >
        <h2>Login</h2>

        {error && (
          <p className="form-error">
            {error}
          </p>
        )}

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <button type="submit">
          Login
        </button>

        <p>
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