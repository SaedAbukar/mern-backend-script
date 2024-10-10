const fs = require("fs");
const path = require("path");
const baseName = process.argv[2];
if (!baseName) {
  console.error("Please provide a base name as an argument.");
  process.exit(1);
}

// Convert the base name to camel case
const toCamelCase = (str) => {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^(.)/, (c) => c.toLowerCase());
};

// Convert the base name to Pascal case
const toPascalCase = (str) => {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^(.)/, (c) => c.toUpperCase());
};

const camelCaseBaseName = toCamelCase(baseName);
const pascalCaseBaseName = toPascalCase(baseName);
// Directory structure
const structure = {
  src: {
    components: [
      "Card.jsx",
      "CheckBox.jsx",
      "Hero.jsx",
      "HomeCards.jsx",
      `${pascalCaseBaseName}Listing.jsx`,
      `${pascalCaseBaseName}Listings.jsx`,
      "Navbar.jsx",
      "ProtectedRoute.jsx",
      "Spinner.jsx",
      `ViewAll${pascalCaseBaseName}s.jsx`,
    ],
    context: ["AuthContext.jsx"],
    hooks: [
      "useAutoLogout.jsx",
      "useField.jsx",
      "useLogin.jsx",
      "useSignup.jsx",
    ],
    layouts: ["MainLayout.jsx"],
    pages: [
      `Add${pascalCaseBaseName}Page.jsx`,
      `${pascalCaseBaseName}Page.jsx`,
      "HomePage.jsx",
      `${pascalCaseBaseName}Page.jsx`,
      `${pascalCaseBaseName}sPage.jsx`,
      "LoginPage.jsx",
      "NotFoundPage.jsx",
      "SignupComponent.jsx",
    ],
  },
  rootFiles: [".env", "App.jsx", "index.css", "main.jsx", "package.json"], // These go to the root
};

// Content templates for various files
const fileTemplates = {
  "Card.jsx": `const Card = ({ children, bg = 'bg-gray-100' }) => {
  return <div className={\`\${bg}\ p-6 rounded-lg shadow-md}\`>{children}</div>;
};
export default Card;`,

  "CheckBox.jsx": `import React from 'react'

export default function MembershipStatus({ status, onStatusChange }) {
  
    const handleStatusChange = (e) => {
    onStatusChange(e.target.checked ? 'Member' : 'Not a Member');
  }

  return (
    <div>
      <label htmlFor="membership" className="block text-gray-700 font-bold mb-2">
        Membership Status:
      </label>
      <div className="flex items-center">
        <input
          id="membership"
          type="checkbox"
          className="mr-2"
          checked={status === 'Member'}
          onChange={handleStatusChange}
        />
        <span>Active Member</span>
      </div>
      {/* <p className="mt-2">Current Status: {status}</p> */}
    </div>
  )
}`,

  "Hero.jsx": `const Hero = ({
  title = 'Become a React Dev',
  subtitle = 'Find the React ${camelCaseBaseName} that fits your skill set',
}) => {
  return (
    <section className='bg-indigo-700 py-20 mb-4'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center'>
        <div className='text-center'>
          <h1 className='text-4xl font-extrabold text-white sm:text-5xl md:text-6xl'>
            {title}
          </h1>
          <p className='my-4 text-xl text-white'>{subtitle}</p>
        </div>
      </div>
    </section>
  );
};
export default Hero;`,

  "HomeCards.jsx": `import { Link } from 'react-router-dom';
import Card from './Card';
import { useAuth } from '../context/AuthContext';

const HomeCards = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className='py-4'>
      <div className='container-xl lg:container m-auto'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-lg'>
          <Card>
            <h2 className='text-2xl font-bold'>For Developers</h2>
            <p className='mt-2 mb-4'>
              Browse our React ${camelCaseBaseName}s and start your career today
            </p>
            <Link
              to='/${camelCaseBaseName}s'
              className='inline-block bg-black text-white rounded-lg px-4 py-2 hover:bg-gray-700'
            >
              Browse ${pascalCaseBaseName}s
            </Link>
          </Card>
          <Card bg='bg-indigo-100'>
            <h2 className='text-2xl font-bold'>For Employers</h2>
            <p className='mt-2 mb-4'>
              List your ${camelCaseBaseName} to find the perfect developer for the role
            </p>
            {isAuthenticated ? (
              <Link to='/add-${camelCaseBaseName}' className='inline-block bg-indigo-500 text-white rounded-lg px-4 py-2 hover:bg-indigo-600'>
                Add ${pascalCaseBaseName}
              </Link>
            ) : (
              <Link to="/login" className='inline-block bg-indigo-500 text-white rounded-lg px-4 py-2 hover:bg-indigo-600'>
                Login
              </Link> 
            )}
          </Card>
        </div>
      </div>
    </section>
  );
};
export default HomeCards;`,

  [`${pascalCaseBaseName}Listing.jsx`]: `import { useState } from 'react';
import { FaMapMarker } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ${pascalCaseBaseName}Listing = ({ ${camelCaseBaseName} }) => {
  const [showFullDescription, setShowFullDescription] = useState(false);

  let description = ${camelCaseBaseName}.description;

  if (!showFullDescription) {
    description = description.substring(0, 90) + '...';
  }

  return (
    <div className='bg-white rounded-xl shadow-md relative'>
      <div className='p-4'>
        <div className='mb-6'>
          <div className='text-gray-600 my-2'>{${camelCaseBaseName}.type}</div>
          <h3 className='text-xl font-bold'>{${camelCaseBaseName}.title}</h3>
        </div>

        <div className='mb-5'>{description}</div>

        <button
          onClick={() => setShowFullDescription((prevState) => !prevState)}
          className='text-indigo-500 mb-5 hover:text-indigo-600'
        >
          {showFullDescription ? 'Less' : 'More'}
        </button>

        <h3 className='text-indigo-500 mb-2'>{${camelCaseBaseName}.salary} / Year</h3>

        <div className='border border-gray-100 mb-5'></div>

        <div className='flex flex-col lg:flex-row justify-between mb-4'>
          <div className='text-orange-700 mb-3'>
            <FaMapMarker className='inline text-lg mb-1 mr-1' />
            {${camelCaseBaseName}.location}
          </div>
          <Link
            to={/\`\${camelCaseBaseName}s/$\{${camelCaseBaseName}.id}\`}
            className='h-[36px] bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg text-center text-sm'
          >
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
};
export default ${pascalCaseBaseName}Listing;`,

  [`${pascalCaseBaseName}Listings.jsx`]: `import { useState, useEffect } from "react";
import ${pascalCaseBaseName}Listing from "./${pascalCaseBaseName}Listing";
import Spinner from "./Spinner";

const ${pascalCaseBaseName}Listings = ({ isHome = false }) => {
  const [${camelCaseBaseName}s, set${pascalCaseBaseName}s] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch${pascalCaseBaseName}s = async () => {
      const apiUrl = isHome ? "/api/${camelCaseBaseName}s?_limit=3" : "/api/${camelCaseBaseName}s";
      try {
        const res = await fetch(apiUrl);
        const data = await res.json();
        set${pascalCaseBaseName}s(data);
      } catch (error) {
        console.log("Error fetching data", error);
      } finally {
        setLoading(false);
      }
    };

    fetch${pascalCaseBaseName}s();
  }, []);

  return (
    <section className="bg-blue-50 px-4 py-10">
      <div className="container-xl lg:container m-auto">
        <h2 className="text-3xl font-bold text-indigo-500 mb-6 text-center">
          {isHome ? "Recent ${pascalCaseBaseName}s" : "Browse ${pascalCaseBaseName}s"}
        </h2>

        {loading ? (
          <Spinner loading={loading} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {${camelCaseBaseName}s.length === 0 ? (
              <p>No ${camelCaseBaseName}s available at the moment.</p>
            ) : (
              ${camelCaseBaseName}s.map((${camelCaseBaseName}) => <${pascalCaseBaseName}Listing key={${camelCaseBaseName}.id} ${camelCaseBaseName}={${camelCaseBaseName}} />)
            )}
          </div>
        )}
      </div>
    </section>
  );
};
export default ${pascalCaseBaseName}Listings;`,

  "Navbar.jsx": `import { NavLink } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();

  const linkClass = ({ isActive }) =>
    isActive
      ? "bg-black text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2"
      : "text-white hover:bg-gray-900 hover:text-white rounded-md px-3 py-2";

  return (
    <nav className="bg-indigo-700 border-b border-indigo-500">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex flex-1 items-center justify-center md:items-stretch md:justify-start">
            <NavLink className="flex flex-shrink-0 items-center mr-4" to="/">
              <img className="h-10 w-auto" src={logo} alt="React ${pascalCaseBaseName}s" />
              <span className="hidden md:block text-white text-2xl font-bold ml-2">
                React ${pascalCaseBaseName}s
              </span>
            </NavLink>
            <div className="md:ml-auto">
              <div className="flex space-x-2">
                <NavLink to="/" className={linkClass}>
                  Home
                </NavLink>
                <NavLink to="/${camelCaseBaseName}s" className={linkClass}>
                  ${pascalCaseBaseName}s
                </NavLink>
                {isAuthenticated ? (
                  <>
                    <NavLink to="/add-${camelCaseBaseName}" className={linkClass}>
                      Add ${pascalCaseBaseName}
                    </NavLink>
                    <NavLink
                      className="text-white bg-indigo-800 hover:bg-red-800 rounded-md px-3 py-2"
                      onClick={logout}
                    >
                      Log out
                    </NavLink>
                  </>
                ) : (
                  <>
                    <NavLink to="/login" className={linkClass}>
                      Login
                    </NavLink>
                    <NavLink to="/signup" className={linkClass}>
                      Signup
                    </NavLink>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;`,

  "ProtectedRoute.jsx": `import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom'
import { useAutoLogout } from '../hooks/useAutoLogout';

export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  useAutoLogout();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
    // return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}`,

  "Spinner.jsx": `import ClipLoader from 'react-spinners/ClipLoader';

const override = {
  display: 'block',
  margin: '100px auto',
};

const Spinner = ({ loading }) => {
  return (
    <ClipLoader
      color='#4338ca'
      loading={loading}
      cssOverride={override}
      size={150}
    />
  );
};
export default Spinner;`,

  [`ViewAll${pascalCaseBaseName}s.jsx`]: `import { Link } from 'react-router-dom';

const ViewAll${pascalCaseBaseName}s = () => {
  return (
    <section className='m-auto max-w-lg my-10 px-6'>
      <Link
        to='/${camelCaseBaseName}s'
        className='block bg-black text-white text-center py-4 px-6 rounded-xl hover:bg-gray-700'
      >
        View All ${pascalCaseBaseName}s
      </Link>
    </section>
  );
};
export default ViewAll${pascalCaseBaseName}s;`,

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
  "useField.jsx": `// useField.jsx

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

  [`Add${pascalCaseBaseName}Page.jsx`]: `import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useField from '../hooks/useField';

const Add${pascalCaseBaseName}Page = ({ add${pascalCaseBaseName}Submit }) => {
  const title = useField('text', 'title');
  const description = useField('textarea', 'description');
  const salary = useField('select', 'salary');
  const companyName = useField('text', 'company');
  const contactEmail = useField('email', 'contact_email');
  const contactPhone = useField('tel', 'contact_phone');
  const location = useField('text', 'location');
  const postedDate = useField('date', 'postedDate');
  const type = useField('select','type');
  const status = useField('select', 'status');

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const new${pascalCaseBaseName} = {
      title: title.value,
      type: type.value,
      description: description.value,
      company: {
        name: companyName.value,
        contactEmail: contactEmail.value,
        contactPhone: contactPhone.value,
      },
      location: location.value,
      salary: salary.value,
      postedDate: postedDate.value,
      status: status.value,
    };

    add${pascalCaseBaseName}Submit(new${pascalCaseBaseName});
    
    navigate('/${camelCaseBaseName}s');
  };

  return (
    <section className="bg-indigo-50">
      <div className="container m-auto max-w-2xl py-24">
        <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
          <form onSubmit={handleSubmit}>
            <h2 className="text-3xl text-center font-semibold mb-6">Add ${pascalCaseBaseName}</h2>

            <div className="mb-4">
              <label htmlFor="type" className="block text-gray-700 font-bold mb-2">
                ${pascalCaseBaseName} Type
              </label>
              <select
                {...type}
                className="border rounded w-full py-2 px-3"
                required
                value={type.value}
              > 
                <option value="" disabled>
                  Select your type
                </option>
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Remote">Remote</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor={title.id} className="block text-gray-700 font-bold mb-2">
                ${pascalCaseBaseName} Listing Name
              </label>
              <input
                {...title}
                className="border rounded w-full py-2 px-3 mb-2"
                placeholder="Make it sound cooler than it is!"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor={description.id} className="block text-gray-700 font-bold mb-2">
                Description
              </label>
              <textarea
                {...description}
                className="border rounded w-full py-2 px-3"
                rows="4"
                placeholder="What's the role? (No, 'professional snacker' doesn't count)"
              ></textarea>
            </div>

            <div className="mb-4">
              <label htmlFor={salary.id} className="block text-gray-700 font-bold mb-2">
                Salary
              </label>
              <select
                {...salary}
                className="border rounded w-full py-2 px-3"
                value={salary.value}
                required
              >
                <option value="" disabled>Select salary level</option>
                <option value={parseInt('50000')}>Under $50K</option>
                <option value={parseInt('60000')}>$50K - $60K</option>
                <option value={parseInt('70000')}>$60K - $70K</option>
                <option value={parseInt('80000')}>$70K - $80K</option>
                <option value={parseInt('90000')}>$80K - $90K</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor={location.id} className="block text-gray-700 font-bold mb-2">
                Location
              </label>
              <input
                {...location}
                className="border rounded w-full py-2 px-3 mb-2"
                placeholder="Where are we pretending to be located?"
                required
              />
            </div>

            <h3 className="text-2xl mb-5">Company Info</h3>

            <div className="mb-4">
              <label htmlFor={companyName.id} className="block text-gray-700 font-bold mb-2">
                Company Name
              </label>
              <input
                {...companyName}
                className="border rounded w-full py-2 px-3"
                placeholder="Company Name"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor={contactEmail.id} className="block text-gray-700 font-bold mb-2">
                Contact Email
              </label>
              <input
                {...contactEmail}
                className="border rounded w-full py-2 px-3"
                placeholder="donotsend@wasteoftime.com"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor={contactPhone.id} className="block text-gray-700 font-bold mb-2">
                Contact Phone
              </label>
              <input
                {...contactPhone}
                className="border rounded w-full py-2 px-3"
                required
                placeholder="Call us! (Unless you’re a telemarketer)"
              />
            </div>

            <div className="mb-4">
              <label htmlFor={postedDate.id} className="block text-gray-700 font-bold mb-2">
                Posted Date
              </label>
              <input
                {...postedDate}
                className="border rounded w-full py-2 px-3"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="status" className="block text-gray-700 font-bold mb-2">
                ${pascalCaseBaseName} Status:
              </label>
              <select
                {...status}
                className="border rounded w-full py-2 px-3"
                value={status.value}
                required
              >
                <option value="" disabled>
                  Is this position still relevant?
                </option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div>
              <button
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Add ${pascalCaseBaseName}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Add${pascalCaseBaseName}Page;`,

  [`Edit${pascalCaseBaseName}Page.jsx`]: `import { useParams, useLoaderData, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import useField from '../hooks/useField';

const Edit${pascalCaseBaseName}Page = ({ update${pascalCaseBaseName}Submit }) => {
  const ${camelCaseBaseName} = useLoaderData();
  const { id } = useParams();
  const navigate = useNavigate();

  const title = useField('text', 'title', ${camelCaseBaseName}.title);
  const description = useField('textarea', 'description', ${camelCaseBaseName}.description);
  const salary = useField('number', 'salary', ${camelCaseBaseName}.salary);
  const location = useField('text', 'location', ${camelCaseBaseName}.location);
  const companyName = useField('text', 'company', ${camelCaseBaseName}.company.name);
  const contactEmail = useField('email', 'contact_email', ${camelCaseBaseName}.company.contactEmail);
  const contactPhone = useField('tel', 'contact_phone', ${camelCaseBaseName}.company.contactPhone);
  const postedDate = useField('date', 'postedDate', new Date(${camelCaseBaseName}.postedDate).toISOString().substring(0, 10));

  const type = useField("select", "type", ${camelCaseBaseName}.type);
  const status  = useField('select', 'status', ${camelCaseBaseName}.status);

  const submitForm = async (e) => {
    e.preventDefault();

    const salaryNumber = parseFloat(salary.value);

    if (isNaN(salaryNumber)) {
      toast.error('Invalid salary value');
      return;
    }

    const updated${pascalCaseBaseName} = {
      id,
      title: title.value,
      type: type.value, 
      location: location.value,
      description: description.value,
      salary: salaryNumber,
      company: {
        name: companyName.value,
        contactEmail: contactEmail.value,
        contactPhone: contactPhone.value,
      },
      postedDate: new Date(postedDate.value),
      status: status.value,
    };

    try {
      await update${pascalCaseBaseName}Submit(updated${pascalCaseBaseName});
      toast.success('${pascalCaseBaseName} Updated Successfully');
      navigate(\`/${camelCaseBaseName}s/\${id}\`);
    } catch (error) {
      console.error(error);
      toast.error('Failed to update the ${camelCaseBaseName}. Please try again.');
    }
  };

  return (
    <section className="bg-indigo-50">
      <div className="container m-auto max-w-2xl py-24">
        <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
          <form onSubmit={submitForm}>
            <h2 className="text-3xl text-center font-semibold mb-6">Update ${pascalCaseBaseName}</h2>

            <div className="mb-4">
              <label htmlFor="type" className="block text-gray-700 font-bold mb-2">
                ${pascalCaseBaseName} Type
              </label>
              <select
                {...type}
                className="border rounded w-full py-2 px-3"
                required
                value={type}
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Remote">Remote</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor={title.id} className="block text-gray-700 font-bold mb-2">
                ${pascalCaseBaseName} Listing Name
              </label>
              <input
                {...title}
                className="border rounded w-full py-2 px-3 mb-2"
                placeholder="e.g. Software Engineer"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor={description.id} className="block text-gray-700 font-bold mb-2">
                Description
              </label>
              <textarea
                {...description}
                className="border rounded w-full py-2 px-3"
                rows="4"
                placeholder="Add any ${camelCaseBaseName} duties, expectations, requirements, etc."
              ></textarea>
            </div>

            <div className="mb-4">
              <label htmlFor={salary.id} className="block text-gray-700 font-bold mb-2">
                Salary
              </label>
              <input
                {...salary}
                className="border rounded w-full py-2 px-3"
                placeholder="Enter salary in USD"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor={location.id} className="block text-gray-700 font-bold mb-2">
                Location
              </label>
              <input
                {...location}
                className="border rounded w-full py-2 px-3 mb-2"
                placeholder="Company Location"
                required
              />
            </div>

            <h3 className="text-2xl mb-5">Company Info</h3>

            <div className="mb-4">
              <label htmlFor={companyName.id} className="block text-gray-700 font-bold mb-2">
                Company Name
              </label>
              <input
                {...companyName}
                className="border rounded w-full py-2 px-3"
                placeholder="Company Name"
              />
            </div>

            <div className="mb-4">
              <label htmlFor={contactEmail.id} className="block text-gray-700 font-bold mb-2">
                Contact Email
              </label>
              <input
                {...contactEmail}
                className="border rounded w-full py-2 px-3"
                placeholder="Email address for applicants"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor={contactPhone.id} className="block text-gray-700 font-bold mb-2">
                Contact Phone
              </label>
              <input
                {...contactPhone}
                className="border rounded w-full py-2 px-3"
                placeholder="Optional phone for applicants"
              />
            </div>

            <div className="mb-4">
              <label htmlFor={postedDate.id} className="block text-gray-700 font-bold mb-2">
                Posted Date
              </label>
              <input
                {...postedDate}
                className="border rounded w-full py-2 px-3"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="status" className="block text-gray-700 font-bold mb-2">
                Status
              </label>
              <select
                {...status}
                className="border rounded w-full py-2 px-3"
                value={status}
              >
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            <div>
              <button
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Update ${pascalCaseBaseName}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Edit${pascalCaseBaseName}Page;`,
  "HomePage.jsx": `import Hero from '../components/Hero';
import HomeCards from '../components/HomeCards';
import ${pascalCaseBaseName}Listings from '../components/${pascalCaseBaseName}Listings';
import ViewAll${pascalCaseBaseName}s from '../components/ViewAll${pascalCaseBaseName}s';

const HomePage = () => {
  return (
    <>
      <Hero />
      <HomeCards />
      <${pascalCaseBaseName}Listings isHome={true} />
      <ViewAll${pascalCaseBaseName}s />
    </>
  );
};
export default HomePage;`,
  [`${pascalCaseBaseName}Page.jsx`]: `import { useParams, useLoaderData, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaMapMarker } from "react-icons/fa";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const ${pascalCaseBaseName}Page = ({ delete${pascalCaseBaseName} }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const ${camelCaseBaseName} = useLoaderData();
  const { isAuthenticated  } = useAuth();

  const onDeleteClick = (${camelCaseBaseName}Id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this listing?"
    );

    if (!confirm) return;

    delete${pascalCaseBaseName}(${camelCaseBaseName}Id);

    toast.success("${pascalCaseBaseName} deleted successfully");

    navigate("/${camelCaseBaseName}s");
  };

  return (
    <>
      <section>
        <div className="container m-auto py-6 px-6">
          <Link
            to="/${camelCaseBaseName}s"
            className="text-indigo-500 hover:text-indigo-600 flex items-center"
          >
            <FaArrowLeft className="mr-2" /> Back to ${pascalCaseBaseName} Listings
          </Link>
        </div>
      </section>

      <section className="bg-indigo-50">
        <div className="container m-auto py-10 px-6">
          <div className="grid grid-cols-1 md:grid-cols-70/30 w-full gap-6">
            <main>
              <div className="bg-white p-6 rounded-lg shadow-md text-center md:text-left">
                <div className="text-gray-500 mb-4">{${camelCaseBaseName}.type}</div>
                <h1 className="text-3xl font-bold mb-4">{${camelCaseBaseName}.title}</h1>
                <div className="text-gray-500 mb-4 flex align-middle justify-center md:justify-start">
                  <FaMapMarker className="text-orange-700 mr-1" />
                  <p className="text-orange-700">{${camelCaseBaseName}.location}</p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                <h3 className="text-indigo-800 text-lg font-bold mb-6">
                  ${pascalCaseBaseName} Description
                </h3>

                <p className="mb-4">{${camelCaseBaseName}.description}</p>

                <h3 className="text-indigo-800 text-lg font-bold mb-2">
                  Salary
                </h3>

                <p className="mb-4">{${camelCaseBaseName}.salary} / Year</p>
              </div>
            </main>

            {/* <!-- Sidebar --> */}
            <aside>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-6">Company Info</h3>

                <h2 className="text-2xl">{${camelCaseBaseName}.company.name}</h2>

                <p className="my-2">{${camelCaseBaseName}.company.description}</p>

                <hr className="my-4" />

                <h3 className="text-xl">Contact Email:</h3>

                <p className="my-2 bg-indigo-100 p-2 font-bold">
                  {${camelCaseBaseName}.company.contactEmail}
                </p>

                <h3 className="text-xl">Contact Phone:</h3>

                <p className="my-2 bg-indigo-100 p-2 font-bold">
                  {" "}
                  {${camelCaseBaseName}.company.contactPhone}
                </p>
              </div>
              {isAuthenticated && (
                <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                  <h3 className="text-xl font-bold mb-6">Manage ${pascalCaseBaseName}</h3>
                  <Link
                    to={\`/edit-${camelCaseBaseName}/\${${camelCaseBaseName}.id}\`}
                    className="bg-indigo-500 hover:bg-indigo-600 text-white text-center font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block"
                  >
                    Edit ${pascalCaseBaseName}
                  </Link>
                  <button
                    onClick={() => onDeleteClick(${camelCaseBaseName}.id)}
                    className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline mt-4 block"
                  >
                    Delete ${pascalCaseBaseName}
                  </button>
                </div>
              )}
            </aside>
          </div>
        </div>
      </section>
    </>
  );
};

const ${camelCaseBaseName}Loader = async ({ params }) => {
  const res = await fetch(\`/api/${camelCaseBaseName}s/\${params.id}\`);
  const data = await res.json();
  return data;
};

export { ${pascalCaseBaseName}Page as default, ${camelCaseBaseName}Loader };`,

  [`${pascalCaseBaseName}sPage.jsx`]: `import ${pascalCaseBaseName}Listings from '../components/${pascalCaseBaseName}Listings';

const ${pascalCaseBaseName}sPage = () => {
  return (
    <section className='bg-blue-50 px-4 py-6'>
      <${pascalCaseBaseName}Listings />
    </section>
  );
};
export default ${pascalCaseBaseName}sPage;`,
  "LoginPage.jsx": `import useField from "../hooks/useField"; // Make sure to import the hook
import useLogin from "../hooks/useLogin";

const LoginPage = () => {
  const { handleLogin } = useLogin();
  const usernameField = useField("username", "username"); // Pass id as second argument
  const passwordField = useField("password", "password");

  const handleSubmit = (event) => {
    event.preventDefault();
    // Call handleLogin with the username and password values
    handleLogin(usernameField.value, passwordField.value);
  };

  return (
    <section className="bg-indigo-50">
      <div className="container m-auto max-w-2xl py-24">
        <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
          <form onSubmit={handleSubmit}>
            <h2 className="text-3xl text-center font-semibold mb-6">Login</h2>

            <div className="mb-4">
              <label
                htmlFor={usernameField.id} // Using the id from the hook
                className="block text-gray-700 font-bold mb-2"
              >
                Username
              </label>
              <input
                className="border rounded w-full py-2 px-3"
                id={usernameField.id}
                type={usernameField.type}
                value={usernameField.value}
                onChange={usernameField.onChange}
                // {...usernameField} // Spreading the props
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor={passwordField.id} // Using the id from the hook
                className="block text-gray-700 font-bold mb-2"
              >
                Password
              </label>
              <input
                className="border rounded w-full py-2 px-3"
                {...passwordField} // Spreading the props
              />
            </div>

            <div>
              <button
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;`,
  "NotFoundPage.jsx": `import { Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const NotFoundPage = () => {
  return (
    <section className='text-center flex flex-col justify-center items-center h-96'>
      <FaExclamationTriangle className='text-yellow-400 text-6xl mb-4' />
      <h1 className='text-6xl font-bold mb-4'>404 Not Found</h1>
      <p className='text-xl mb-5'>This page does not exist</p>
      <Link
        to='/'
        className='text-white bg-indigo-700 hover:bg-indigo-900 rounded-md px-3 py-2 mt-4'
      >
        Go Back
      </Link>
    </section>
  );
};
export default NotFoundPage;`,
  "SignupComponent.jsx": `import React, { useState } from 'react';
import useSignup from "../hooks/useSignup";
import useField from "../hooks/useField";
import CheckBox from '../components/CheckBox';

const SignupComponent = () => {
  // setIsAuthenticated
  const name = useField("text", "name");
  const username = useField('text', 'username');
  const password = useField("password", "password");
  const phone_number = useField("phone_number", "phone_number");
  const gender = useField("select", "gender");
  const date_of_birth = useField("date", "date_of_birth");
  // membership made with useState
  const address = useField('text', 'address')
  const profile_piture = useField('text', 'picture')
  


  const [membershipStatus, setMembershipStatus] = useState('Not a Member')
  const { handleSignup } = useSignup();

  const handleSubmit = async (event) => {
    event.preventDefault();
    handleSignup(
      name.value,
      username.value,
      password.value,
      phone_number.value,
      gender.value,
      date_of_birth.value,
      membershipStatus,
      address.value,
      profile_piture.value
    );
  };

  return (
    <section className="bg-indigo-50">
      <div className="container m-auto max-w-2xl py-24">
        <div className="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
          <form onSubmit={handleSubmit}>
            <h2 className="text-3xl text-center font-semibold mb-6">Sign up</h2>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Name:
              </label>
              <input
                className="border rounded w-full py-2 px-3 mb-2"
                {...name}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Username:
              </label>
              <input
                className="border rounded w-full py-2 px-3 mb-2"
                {...username}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Password:
              </label>
              <input
                className="border rounded w-full py-2 px-3"
                {...password}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Phone:
              </label>
              <input
                type="number"
                className="border rounded w-full py-2 px-3"
                {...phone_number}
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">Gender:</label>
              <select {...gender} value={gender.value} className="border rounded w-full py-2 px-3 mb-2">
                <option value="" disabled>
                  Select your gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Mechanic">Mechanic</option>
                <option value="Software Engineer">Software Engineer</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
                Date of Birth:
              </label>
              <input
                className="border rounded w-full py-2 px-3 mb-2"
                {...date_of_birth}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="type"
                className="block text-gray-700 font-bold mb-2"
              >
                Address:
              </label>
              <input
                className="border rounded w-full py-2 px-3 mb-2"
                {...address}
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="type"
                className="block text-gray-700 font-bold mb-2"
              >
                Not a picture but a string:
              </label>
              <input
                className="border rounded w-full py-2 px-3 mb-2"
                {...profile_piture}
              />
            </div>

            <CheckBox 
                    status={membershipStatus} 
                    onStatusChange={setMembershipStatus} 
                  />

            {/* {(formError || signupError) && (
              <p className="text-red-500" role="alert">
                {formError || signupError}
              </p>
            )} */}
            <br />
            <button
              className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default SignupComponent;`,

  "App.jsx": `import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import ${pascalCaseBaseName}sPage from "./pages/${pascalCaseBaseName}sPage";
import NotFoundPage from "./pages/NotFoundPage";
import ${pascalCaseBaseName}Page, { ${camelCaseBaseName}Loader } from "./pages/${pascalCaseBaseName}Page";
import Add${pascalCaseBaseName}Page from "./pages/Add${pascalCaseBaseName}Page";
import Edit${pascalCaseBaseName}Page from "./pages/Edit${pascalCaseBaseName}Page";
import SignupComponent from "./pages/SignupComponent";
import LoginPage from "./pages/LoginPage";
import { useState } from "react";
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';

const AppContent = () => {
  // Add New ${pascalCaseBaseName}
  const add${pascalCaseBaseName} = async (new${pascalCaseBaseName}) => {
    const user = JSON.parse(sessionStorage.getItem("user")); // Get the user from sessionStorage
    const token = user ? user.token : null; // Extract the token

    console.log('${camelCaseBaseName}:', new${pascalCaseBaseName})
    console.log("user", user)
    console.log(token)
    
    if (!token) {
      console.error("No token found, user not authenticated");
      return false;
    }

    try {
      const res = await fetch("/api/${camelCaseBaseName}s", {
        method: "POST",
        headers: {
          Authorization: \`Bearer \${token}\`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(new${pascalCaseBaseName}),
      });

      if (res.ok) {
        const created${pascalCaseBaseName} = await res.json();
        return created${pascalCaseBaseName};
        toast.success('${pascalCaseBaseName} added successfully!');
      } else {
        const errorData = await res.json();
        console.error("Failed to add ${camelCaseBaseName}:", errorData);
        return false;
      }
    } catch (error) {
      console.error("An error occurred:", error);
      return false;
    }
  };

  // Delete ${pascalCaseBaseName}
  const delete${pascalCaseBaseName} = async (id) => {
    const user = JSON.parse(sessionStorage.getItem("user")); // Get the user from sessionStorage
    const token = user ? user.token : null; // Extract the token

    if (!token) {
      console.error("No token found, user not authenticated");
      return false;
    }

    const res = await fetch(\`/api/${camelCaseBaseName}s/\${id}\`, {
      method: "DELETE",
      headers: {
        Authorization: \`Bearer \${token}\`, // Add the Authorization header with the token
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      console.log("${pascalCaseBaseName} deleted successfully");
      return true;
    } else {
      const errorData = await res.json();
      console.error("Failed to delete ${camelCaseBaseName}:", errorData);
      return false;
    }
  };

  // Update ${pascalCaseBaseName}
  const update${pascalCaseBaseName} = async (${camelCaseBaseName}) => {
    const user = JSON.parse(sessionStorage.getItem("user")); // Get the user from sessionStorage
    const token = user ? user.token : null; // Extract the token

    if (!token) {
      console.error("No token found, user not authenticated");
      return false;
    }

    console.log('${camelCaseBaseName}:', ${camelCaseBaseName})

    const res = await fetch(\`/api/${camelCaseBaseName}s/\${${camelCaseBaseName}.id}\`, {
      method: "PUT",
      headers: {
        Authorization: \`Bearer \${token}\`, // Add the Authorization header
        "Content-Type": "application/json",
      },
      body: JSON.stringify(${camelCaseBaseName}),
    });

    if (res.ok) {
      const updated${pascalCaseBaseName} = await res.json();
      console.log("${pascalCaseBaseName} updated successfully:", updated${pascalCaseBaseName});
      return updated${pascalCaseBaseName};
    } else {
      const errorData = await res.json();
      console.error("Failed to update ${camelCaseBaseName}:", errorData);
      return false;
    }
  };

  // Router
  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<MainLayout/>}>
        <Route index element={<HomePage />} />
        <Route path="/${camelCaseBaseName}s" element={<${pascalCaseBaseName}sPage />} />
        <Route
          path="/${camelCaseBaseName}s/:id"
          element={<${pascalCaseBaseName}Page delete${pascalCaseBaseName}={delete${pascalCaseBaseName}}/>}
          loader={${camelCaseBaseName}Loader}
        />
        
        <Route path="/add-${camelCaseBaseName}" element={
          <ProtectedRoute>
            <Add${pascalCaseBaseName}Page add${pascalCaseBaseName}Submit={add${pascalCaseBaseName}} />
          </ProtectedRoute>
        } />

        <Route path="/edit-${camelCaseBaseName}/:id" element={
          <ProtectedRoute>
            <Edit${pascalCaseBaseName}Page update${pascalCaseBaseName}Submit={update${pascalCaseBaseName}} />
          </ProtectedRoute>
        }
          loader={${camelCaseBaseName}Loader}
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

  "index.css": `@tailwind base;
@tailwind components;
@tailwind utilities;`,

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

  "package.json": `{
  "name": "full-stack-app",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint . --ext js,jsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "full-stack-app": "file:..",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-icons": "^5.0.1",
    "react-router-dom": "^6.22.3",
    "react-spinners": "^0.13.8",
    "react-toastify": "^10.0.4"
  },
  "devDependencies": {
    "@types/react": "^18.2.64",
    "@types/react-dom": "^18.2.21",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.18",
    "eslint": "^8.57.0",
    "eslint-plugin-react": "^7.34.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.35",
    "tailwindcss": "^3.4.1",
    "vite": "^5.1.6"
  }
}`,
};

const createStructure = (baseDir, structure) => {
  Object.keys(structure).forEach((dir) => {
    const dirPath = path.join(baseDir, dir);

    if (dir === "rootFiles") {
      structure[dir].forEach((file) => {
        const filePath = path.join(baseDir, file);
        const content = fileTemplates[file] || "";
        fs.writeFileSync(filePath, content);
        console.log(`Created file: ${filePath}`);
      });
    } else {
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
        console.log(`Created directory: ${dirPath}`);
      }

      // Handle both arrays and objects
      if (Array.isArray(structure[dir])) {
        structure[dir].forEach((file) => {
          const filePath = path.join(dirPath, file);
          const content = fileTemplates[file] || "";
          fs.writeFileSync(filePath, content);
          console.log(`Created file: ${filePath}`);
        });
      } else if (typeof structure[dir] === "object") {
        createStructure(dirPath, structure[dir]); // Recursively process the object
      }
    }
  });
};

// Define base directory
const baseDir = path.join(__dirname, "my-react-app");
fs.mkdirSync(baseDir, { recursive: true });
createStructure(baseDir, structure);

console.log("React app structure created successfully.");
