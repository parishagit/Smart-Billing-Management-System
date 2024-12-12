// Payment.js
import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { CardElement, Elements } from '@stripe/react-stripe-js';
import './Payment.css'; // Optional: Add your CSS file

const stripePromise = loadStripe('your_stripe_publishable_key');

const Payment = () => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const response = await fetch('http://localhost:5000/api/payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount * 100, // Amount in cents
        currency: 'usd',
        source: 'tok_visa', // Replace with the actual token from Stripe
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setSuccess('Payment successful!');
    } else {
      setError(data.error);
    }
  };

  return (
    <div className="payment-container">
      <h2>Payment</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Amount:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </label>
        <CardElement />
        <button type="submit">Pay</button>
      </form>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
    </div>
  );
};

const App = () => (
  <Elements stripe={stripePromise}>
    <Payment />
  </Elements>
);

export default App;