import React, { useState } from "react";
import axios from "axios";
import Home from "./Home";
import "./Login.css";

function UserRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [role, setRole] = useState("user"); // Add role state

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/user/register", {
        name,
        email,
        password,
        role, // Send role to backend
      });
      console.log(response.data);
      // send to backend

      setName("");
      setEmail("");
      setPassword("");
      setMessage("User registered successfully!"); // Add this line
    } catch (error) {
      if (error.response) {
        if (
          error.response.data &&
          error.response.data.message === "User already exists"
        ) {
          setMessage("User already exists. Please login.");
        } else {
          setMessage(error.response.data.message || "Registration failed.");
        }
      } else {
        setMessage("Network error. Please try again.");
      }
    }
  }

  return (
    <div>
      <div className="form-container">
        <h2>Register</h2>
        <form action="" method="post" className="form" onSubmit={handleSubmit}>
          {/* register */}
          <label htmlFor="name">Name : </label>
          <input
            type="text"
            name="name"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <br />

          {/* email */}
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <br />
          {/* password */}
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />
          {/* role selection */}
          <label htmlFor="role">Role:</label>
          <select
            name="role"
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="employee">Employee</option>
          </select>
          <br />
          <button type="submit">Register</button>
          {message && <p>{message}</p>}
        </form>
      </div>
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(""); // Track user role after login

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/user/login", {
        email,
        password,
      });
      console.log(response.data);
      // set token to header

      localStorage.setItem("token", response.data.token);
     // add in the token in the cookie
     
      setEmail("");
      setPassword("");
      setMessage("User logged in successfully!");
      setIsLoggedIn(true);
      setUserRole(response.data.role || ""); // Save role from backend if provided
    } catch (error) {
      if (error.response) {
        if (
          error.response.data &&
          error.response.data.message === "User not found"
        ) {
          setMessage("User not found. Please register.");
        } else if (
          error.response.data &&
          error.response.data.message === "Incorrect password"
        ) {
          setMessage("Incorrect password. Please try again.");
        }
      } else {
        setMessage("Login failed. Please try again.");
      }
    }
  }

  if (isLoggedIn) {
    return (
      <>
        <Home />
        {userRole && <p>Role: {userRole}</p>}
      </>
    );
  }

  return (
    <div className="login-container">
      <form action="" method="post" onSubmit={handleSubmit}>
        <h1>Login</h1>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          name="email"
          id="emails"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label>Password</label>
        <input
          type="password"
          name="password"
          id="passwords"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">Login</button>
      </form>
      <p>{message && <p>{message}</p>}</p>
    </div>
  );
}

export { UserRegister, Login };
