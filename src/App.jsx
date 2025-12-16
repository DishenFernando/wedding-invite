import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Set your wedding date here (YYYY, MM-1, DD, HH, MM)
const weddingDate = new Date(2026, 2, 10, 10, 0, 0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = weddingDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Replace this with your actual Google Form URL
  const googleFormUrl = "https://docs.google.com/forms/d/e/YOUR_FORM_ID/viewform";

  const handleRSVPClick = () => {
    window.open(googleFormUrl, '_blank');
  };

  return (
    <div className="app">
      {/* Hero Section with Background */}
      <section className="hero">
        <div className="overlay"></div>
        <div className="hero-content">
          <h1 className="couple-names">Sarah & John</h1>
          <p className="wedding-date">June 15, 2025</p>
          <div className="divider"></div>
          <p className="tagline">Together with their families, invite you to celebrate their wedding</p>
        </div>
      </section>

      {/* Countdown Section */}
      <section className="countdown-section">
        <h2>Counting Down to Our Big Day</h2>
        <div className="countdown">
          <div className="countdown-item">
            <span className="countdown-number">{timeLeft.days}</span>
            <span className="countdown-label">Days</span>
          </div>
          <div className="countdown-item">
            <span className="countdown-number">{timeLeft.hours}</span>
            <span className="countdown-label">Hours</span>
          </div>
          <div className="countdown-item">
            <span className="countdown-number">{timeLeft.minutes}</span>
            <span className="countdown-label">Minutes</span>
          </div>
          <div className="countdown-item">
            <span className="countdown-number">{timeLeft.seconds}</span>
            <span className="countdown-label">Seconds</span>
          </div>
        </div>
      </section>

      {/* Wedding Details Section */}
      <section className="details-section">
        <h2>Wedding Details</h2>
        <div className="details-grid">
          <div className="detail-card">
            <div className="icon">📅</div>
            <h3>Date</h3>
            <p>Sunday, June 15, 2025</p>
          </div>
          <div className="detail-card">
            <div className="icon">⏰</div>
            <h3>Time</h3>
            <p>2:00 PM</p>
          </div>
          <div className="detail-card">
            <div className="icon">⛪</div>
            <h3>Church</h3>
            <p>St. Mary's Cathedral</p>
            <p className="address">123 Church Street, City</p>
          </div>
          <div className="detail-card">
            <div className="icon">🎉</div>
            <h3>Reception</h3>
            <p>Grand Ballroom</p>
            <p className="address">456 Celebration Ave, City</p>
          </div>
        </div>
      </section>

      {/* RSVP Section */}
      <section className="rsvp-section">
        <h2>RSVP</h2>
        <p className="rsvp-subtitle">Please confirm your attendance by clicking the button below</p>
        <button className="rsvp-button" onClick={handleRSVPClick}>
          <span className="button-icon">💌</span>
          <span className="button-text">Fill Out RSVP Form</span>
        </button>
        <p className="rsvp-note">
          We kindly request your response by May 15, 2025
        </p>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>We can't wait to celebrate with you!</p>
        <p className="hearts">♥</p>
      </footer>
    </div>
  );
}

export default App;
