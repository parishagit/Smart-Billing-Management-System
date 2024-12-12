// SidebarNav.js
import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import { faHome, faWallet, faIndianRupeeSign, faCreditCard, faFileInvoice  } from '@fortawesome/free-solid-svg-icons';
import './SidebarNav.css';
import { useLocation } from 'react-router-dom';

function SidebarNav() {
  const location = useLocation();
  const user = location.State?.user;
  return (
    <Nav className="flex-column fixed">
      <Link to="/dashboard">
      <img src={`${process.env.PUBLIC_URL}/images/Logo/logo.png`} alt="Logo" className="logo-img" height={70} width={90} />
      </Link>
      <Nav.Link as={Link} to="/dashboard"><FontAwesomeIcon icon={faHome} className="nav-icon"/> Dashboard</Nav.Link>
      <Nav.Link as={Link} to="/incomes"><FontAwesomeIcon icon={faIndianRupeeSign} className="nav-icon" /> Incomes</Nav.Link>
      <Nav.Link as={Link} to="/expenses"><FontAwesomeIcon icon={faWallet} className="nav-icon" /> Expenses</Nav.Link>
      <Nav.Link as={Link} to="/invoice"> <FontAwesomeIcon icon={faFileInvoice} className="nav-icon" /> Invoice</Nav.Link>
      <Nav.Link as={Link} to="/Payment"> <FontAwesomeIcon icon={faFileInvoice} className="nav-icon" /> Payment</Nav.Link>
      {/* Exit Link */}
      <Nav.Link as={Link} to="/signout" className="exit-link">
       Sign Out
      </Nav.Link>
      <a href="https://github.com/parishasgithub" className="github-link" target="_blank" rel="noopener noreferrer">
      <FontAwesomeIcon icon={faGithub} /> made by Parisha
    </a>
    </Nav>
  );
}

export default SidebarNav;
