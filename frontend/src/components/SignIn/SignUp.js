import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './SignUp.css'; 
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faLock, faArrowRight, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ email: '', password: '', username: '' });

  const validateForm = () => {
    let formIsValid = true;
    let errors = {};

    if (!username) {
      errors.username = 'Username is required';
      formIsValid = false;
    }

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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    
    if (validateForm()) {
      try {
        const result = await axios.post("http://localhost:3001/signup", { username, email, password });
        if (result.status === 201) {
          console.log('User created successfully');
          navigate('/'); 
        }
      } catch (err) {
        if (err.response && err.response.status === 400) {
          window.alert("Email already exists. Please use a different email.");
        } else {
          console.error(err);
          window.alert("An error occurred during signup. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    } else {
      console.log('Form has errors');
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="signup">
      <div className="signup-container">
        <div className="text-center">
          <p>Create an account for <span className="bold-text">Bill Desk</span></p>
        </div>
        <form onSubmit={handleSubmit}>
          {/* Username Field with Icon */}
          <div className="form-group input-icon-container">
            <FontAwesomeIcon icon={faUser} className="input-icon" />
            <input
              type="text"
              className={`form-control ${error.username ? 'is-invalid' : ''}`}
              placeholder="Your username"
              aria-label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            {error.username && <div className="invalid-feedback">{error.username}</div>}
          </div>

          {/* Email Field with Icon */}
          <div className="form-group input-icon-container">
            <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
            <input
              type="email"
              className={`form-control ${error.email ? 'is-invalid' : ''}`}
              placeholder="Your email"
              aria-label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            {error.email && <div className="invalid-feedback">{error.email}</div>}
          </div>

          {/* Password Field with Icon */}
          <div className="form-group input-icon-container">
            <FontAwesomeIcon icon={faLock} className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
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

          <div className="form-group">
            <button type="submit" className="btn-login" disabled={loading}>
              Sign up <FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
          {loading && <div className="loading-message">Loading...</div>}
        </form>
        <div className="text-center">
          <p>Already have an account? <Link to="/" className="dark-link">Log in</Link></p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
