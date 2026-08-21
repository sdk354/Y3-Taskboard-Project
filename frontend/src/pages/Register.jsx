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
        className="auth-card"
        onSubmit={handleSubmit}
      >
        <h2>Create Account</h2>

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
          Register
        </button>

        <p>
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