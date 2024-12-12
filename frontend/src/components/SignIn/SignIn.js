import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SignIn.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faArrowRight, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ email: '', password: '' });

  // Form validation function
  const validateForm = () => {
    let formIsValid = true;
    let errors = {};

    if (!email) {
      errors.email = 'Email is required';
      formIsValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
      formIsValid = false;
    }

    if (!password) {
      errors.password = 'Password is required';
      formIsValid = false;
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
      formIsValid = false;
    }

    setError(errors);
    return formIsValid;
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (validateForm()) {
      try {
        const response = await axios.post("http://localhost:3001/login", { email, password });

        if (response.data.message === "Success") {
          // Navigate to dashboard on successful login
          navigate("/dashboard");
        } else {
          // Alert for unsuccessful login attempt
          alert(response.data.message || "Login failed");
        }
      } catch (err) {
        // Handle error based on the HTTP status code
        if (err.response && err.response.status === 404) {
          alert("User not found. Please check your email or sign up.");
        } else if (err.response && err.response.status === 401) {
          alert("Incorrect password. Please try again.");
        } else {
          alert("Login failed. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    } else {
      console.log('Form has errors');
      setLoading(false);
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="signin">
      <div className="signin-container">
        <div className="text-center">
          <p>Log in to <span className="bold-text">Bill Desk</span></p>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Email input */}
          <div className="form-group input-icon-container">
            <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
            <input
              type="email"
              name='email'
              className={`form-control ${error.email ? 'is-invalid' : ''}`}
              placeholder="Your email"
              aria-label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {error.email && <div className="invalid-feedback">{error.email}</div>}
          </div>

          {/* Password input */}
          <div className="form-group input-icon-container">
            <FontAwesomeIcon icon={faLock} className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              name='password'
              className={`form-control ${error.password ? 'is-invalid' : ''}`}
              placeholder="Your password"
              aria-label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="toggle-password" onClick={togglePasswordVisibility} />
            {error.password && <div className="invalid-feedback">{error.password}</div>}
          </div>

          {/* Submit button */}
          <div className="form-group">
            <button type="submit" className="btn-login" disabled={loading}>
              Log in <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>

          {/* Loading indicator */}
          {loading && <div>Loading...</div>}
        </form>

        {/* Links for forgot password and sign up */}
        <div className="text-center">
          <Link to="/forgot-password" className="forgot-password dark-link">Forgot password?</Link>
          <p>Don't have an account? <Link to="/signup" className="dark-link">Sign up</Link></p>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
