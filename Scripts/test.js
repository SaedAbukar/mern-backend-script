const fs = require("fs");
const path = require("path");
const bg = ".";
const job = ".";
const id = ".";
const params = ".";
const token = ".";
// Directory structure
const structure = {
  src: {
    context: ["AuthContext.jsx"],
    hooks: [
      "useAutoLogout.jsx",
      "useField.jsx",
      "useLogin.jsx",
      "useSignup.jsx",
    ],
    layouts: ["MainLayout.js"],
  },
  rootFiles: [".env", "App.jsx", "main.jsx"], // These go to the root
};

// Content templates for various files
const fileTemplates = {
  "AuthContext.jsx": `import React, { createContext, useState, useContext, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [redirectPath, setRedirectPath] = useState('/');

  useEffect(() => {
    const storedAuth = sessionStorage.getItem('isAuthenticated');
    if (storedAuth) {
      setIsAuthenticated(JSON.parse(storedAuth));
    }
  }, []);


  const login = (user) => {
    setIsAuthenticated(true); 
    // sessionStorage.setItem("user", JSON.stringify(user));
    sessionStorage.setItem("user", JSON.stringify(user));
    console.log("User logged successfully!");
    sessionStorage.setItem('isAuthenticated', 'true');
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('user');
  };

  // const setRedirectLocation = (path) => {
  //   setRedirectPath(path);
  // };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};`,

  "useAutoLogout.jsx": `import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export const useAutoLogout = () => {
  const { logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const logoutTimer = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      const user = JSON.parse(sessionStorage.getItem('user'));
      if (user && user.token) {
        const payload = JSON.parse(atob(user.token.split('.')[1]));
        const expirationTime = payload.exp * 1000; // Convert to milliseconds
        const timeUntilExpiration = expirationTime - Date.now();

        if (timeUntilExpiration <= 0) {
          // Token has already expired
          toast.error('Your session has expired. Please log in again.');
          logout();
          navigate('/login');
        } else {
          // Set timer for automatic logout
          logoutTimer.current = setTimeout(() => {
            logout();
            navigate('/login');
          }, timeUntilExpiration);
        }
      }
    }

    return () => {
      if (logoutTimer.current) {
        clearTimeout(logoutTimer.current);
      }
    };
  }, [isAuthenticated, logout, navigate]);
};`,
  "useField.jsx": `// useField.js

import { useState } from "react";

const useField = (type, id, initialValue = "") => {
  const [value, setValue] = useState(initialValue);

  const onChange = (event) => setValue(event.target.value);

  return {
    id,
    type,
    value,
    onChange,
  };
};
export default useField;`,
  "useLogin.jsx": `import useField from "../hooks/useField";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from '../context/AuthContext';

const useLogin = () => {
  const usernameField = useField("username", "username");
  const passwordField = useField("password", "password");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (username, password) => {
    try {
      const response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.ok) {
        toast.success("User Login Successful");
        const user = await response.json();
        login(user); // Call the context login to update the state if needed
        navigate("/");  // Navigate to the home page after successful login
      } else {
        const errorData = await response.json(); // Get error details
        console.error("Login failed:", errorData);
        toast.error(errorData.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  return { usernameField, passwordField, handleLogin };
};

export default useLogin;`,
  "useSignup.jsx": `import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const useSignup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const handleSignup = async (
    name,
    username,
    password,
    phone_number,
    gender,
    date_of_birth,
    membership_status,
    address,
    profile_picture
  ) => {
    try {
      const response = await fetch("/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          username,
          password,
          phone_number,
          gender,
          date_of_birth,
          membership_status,
          address,
          profile_picture
        }),
      });

      if (response.ok) {
        const user = await response.json();
        login(user);
        navigate("/");
      } else {
        console.error("Signup failed");
      }
    } catch (error) {
      console.error('Error during signup:', error);
      setError('An unexpected error occurred');
    }
  };

  return {
    handleSignup,
  };
};

export default useSignup;`,

  "MainLayout.jsx": `import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";

// MainLayout.jsx
const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <ToastContainer />
    </>
  );
};

export default MainLayout;`,

  "App.jsx": `import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import JobsPage from "./pages/JobsPage";
import NotFoundPage from "./pages/NotFoundPage";
import JobPage, { jobLoader } from "./pages/JobPage";
import AddJobPage from "./pages/AddJobPage";
import EditJobPage from "./pages/EditJobPage";
import SignupComponent from "./pages/SignupComponent";
import LoginPage from "./pages/LoginPage";
import { useState } from "react";
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

const AppContent = () => {
  // Add New Job
  const addJob = async (newJob) => {
    const user = JSON.parse(sessionStorage.getItem("user")); // Get the user from sessionStorage
    const token = user ? user.token : null; // Extract the token

    console.log('job:', newJob)
    console.log("user", user)
    console.log(token)
    
    if (!token) {
      console.error("No token found, user not authenticated");
      return false;
    }

    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          Authorization: "Bearer ${token}!!!",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newJob),
      });

      if (res.ok) {
        const createdJob = await res.json();
        return createdJob;
        toast.success('Job added successfully!');
      } else {
        const errorData = await res.json();
        console.error("Failed to add job:", errorData);
        return false;
      }
    } catch (error) {
      console.error("An error occurred:", error);
      return false;
    }
  };

  // Delete Job
  const deleteJob = async (id) => {
    const user = JSON.parse(sessionStorage.getItem("user")); // Get the user from sessionStorage
    const token = user ? user.token : null; // Extract the token

    if (!token) {
      console.error("No token found, user not authenticated");
      return false;
    }

    const res = await fetch("/api/jobs/${id}!!!", {
      method: "DELETE",
      headers: {
        Authorization: "Bearer ${token}!!!", // Add the Authorization header with the token
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      console.log("Job deleted successfully");
      return true;
    } else {
      const errorData = await res.json();
      console.error("Failed to delete job:", errorData);
      return false;
    }
  };

  // Update Job
  const updateJob = async (job) => {
    const user = JSON.parse(sessionStorage.getItem("user")); // Get the user from sessionStorage
    const token = user ? user.token : null; // Extract the token

    if (!token) {
      console.error("No token found, user not authenticated");
      return false;
    }

    console.log('job:', job)

    const res = await fetch("/api/jobs/${job.id}!!!", {
      method: "PUT",
      headers: {
        Authorization: "Bearer ${token}!!!", // Add the Authorization header
        "Content-Type": "application/json",
      },
      body: JSON.stringify(job),
    });

    if (res.ok) {
      const updatedJob = await res.json();
      console.log("Job updated successfully:", updatedJob);
      return updatedJob;
    } else {
      const errorData = await res.json();
      console.error("Failed to update job:", errorData);
      return false;
    }
  };

  // Router
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout/>}>
        <Route index element={<HomePage />} />
        <Route path="/jobs" element={<JobsPage />} />
        <Route
          path="/jobs/:id"
          element={<JobPage deleteJob={deleteJob}/>}
          loader={jobLoader}
        />
        
        <Route path="/add-job" element={
          <ProtectedRoute>
            <AddJobPage addJobSubmit={addJob} />
          </ProtectedRoute>
        } />

        <Route path="/edit-job/:id" element={
          <ProtectedRoute>
            <EditJobPage updateJobSubmit={updateJob} />
          </ProtectedRoute>
        }
          loader={jobLoader}
        />

        <Route path="/signup" element={<SignupComponent />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    )
  );

  return <RouterProvider router={router} />;
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;`,

  "main.jsx": `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,

  ".env": `REACT_APP_API_URL=http://localhost:5000`,
};

// Create files and directories based on structure
const createStructure = (baseDir, structure) => {
  Object.keys(structure).forEach((dir) => {
    if (dir === "rootFiles") {
      structure[dir].forEach((file) => {
        const filePath = path.join(baseDir, file);
        const content = fileTemplates[file] || "";
        fs.writeFileSync(filePath, content);
        console.log(`Created file: ${filePath}`);
      });
    } else if (typeof structure[dir] === "object") {
      const subDir = path.join(baseDir, dir);
      if (!fs.existsSync(subDir)) {
        fs.mkdirSync(subDir);
        console.log(`Created directory: ${subDir}`);
      }
      createStructure(subDir, structure[dir]);
    }
  });
};

// Define base directory and create structure
const baseDir = path.join(__dirname);
createStructure(baseDir, structure);

console.log("React app structure created successfully.");
