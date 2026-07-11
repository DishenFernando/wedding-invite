import React, { useState, useEffect, useRef, useCallback } from 'react';
import './App.css';

/* =========================================================================
   ONE photo, used as the backdrop for the entire page. It sits fixed behind
   everything and stays put while every section scrolls over it — drop your
   hosted photo URL in here (Cloudinary, Imgur direct link, /public/images,
   etc). Leave it null to keep the emerald + palm-frond fallback.
   ========================================================================= */
const BACKGROUND_IMAGE_URL = '/bg.jpg'; // e.g. "https://res.cloudinary.com/.../couple.jpg"
const MUSIC_SRC = '/audio/wedding-song.mp3';
const GOOGLE_FORM_URL = 'https://forms.gle/QPxYVjFJg2sTm4nx5';

const WEDDING_DATE = new Date(2026, 7, 7, 14, 0, 0); // Aug 7 2026, 2:00 PM

/* ---------------------------- Palm frond line art (signature motif) ---------------------------- */
const Frond = ({ className = '', flip = false }) => (
  <svg
    viewBox="0 0 220 90"
    className={`frond ${className}`}
    style={flip ? { transform: 'scaleX(-1)' } : undefined}
    aria-hidden="true"
  >
    <path d="M4 86C40 70 70 40 90 6" />
    <path d="M14 74C34 66 50 50 58 30" />
    <path d="M26 80C44 68 58 54 68 38" />
    <path d="M4 86C46 80 84 62 108 30" />
    <path d="M4 86C50 88 96 76 130 46" />
    <path d="M4 86C58 92 112 84 150 58" />
    <circle cx="94" cy="4" r="2.4" />
  </svg>
);

/* ---------------------------- Icons ---------------------------- */
const IconCalendar = () => (
  <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1">
    <rect x="3" y="5.5" width="18" height="15" rx="2.5" />
    <path d="M16 3.2v4.6M8 3.2v4.6M3 10.2h18" />
    <path d="M12 14.2c-1-1.3-3.4-1-3.4 0.9 0 1.5 2 2.7 3.4 3.9 1.4-1.2 3.4-2.4 3.4-3.9 0-1.9-2.4-2.2-3.4-0.9Z" />
  </svg>
);

const IconClock = () => (
  <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1">
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="6.2" strokeWidth="0.6" opacity="0.5" />
    <path d="M12 8.2v4l2.8 1.7" />
    <circle cx="12" cy="3" r="0.6" fill="currentColor" stroke="none" />
    <circle cx="12" cy="21" r="0.6" fill="currentColor" stroke="none" />
    <circle cx="3" cy="12" r="0.6" fill="currentColor" stroke="none" />
    <circle cx="21" cy="12" r="0.6" fill="currentColor" stroke="none" />
  </svg>
);

const IconChurch = () => (
  <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1">
    <path d="M12 2.2v3.2M10.4 3.6h3.2" />
    <path d="M12 5.4L21 12v9H3v-9L12 5.4Z" />
    <path d="M12 12.2a2 2 0 0 1 2 2v6.8h-4V14.2a2 2 0 0 1 2-2Z" />
    <path d="M6.5 15.5h1.6M15.9 15.5h1.6" />
    <circle cx="7.3" cy="18.5" r="0.5" fill="currentColor" stroke="none" />
    <circle cx="16.7" cy="18.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);

const IconCelebration = () => (
  <svg className="detail-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.1">
    <path d="M6 9c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3Z" />
    <path d="M18 9c1.7 0 3-1.3 3-3s-1.3-3-3-3-3 1.3-3 3 1.3 3 3 3Z" />
    <path d="M7.2 8.2 9.6 11M16.8 8.2 14.4 11" />
    <path d="M9.6 11h4.8l2.4 10.5H7.2L9.6 11Z" />
    <path d="M9.6 15.5h4.8" strokeWidth="0.7" opacity="0.6" />
  </svg>
);
const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </svg>
);
const IconMusicOn = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" />
  </svg>
);
const IconMusicOff = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /><path d="M3 3l18 18" />
  </svg>
);
const IconChevron = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

/* ---------------------------- Hook: reveal-on-scroll ---------------------------- */
function useReveal() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('in-view');
          io.unobserve(el);
        }
      },
      { threshold: 0.18 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

function App() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [musicOn, setMusicOn] = useState(true);
  const [opened, setOpened] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const distance = WEDDING_DATE.getTime() - Date.now();
      if (distance <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      setTimeLeft({
        days: Math.floor(distance / 86400000),
        hours: Math.floor((distance % 86400000) / 3600000),
        minutes: Math.floor((distance % 3600000) / 60000),
        seconds: Math.floor((distance % 60000) / 1000),
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // The wax seal is the single gesture that both reveals the site AND unlocks
  // audio — solving the "click anywhere" hack with one deliberate, in-theme moment.
  const openInvitation = useCallback(() => {
    setOpened(true);
    const audio = audioRef.current;
    if (audio) {
      audio.muted = false;
      audio.volume = 0.5;
      audio.play().catch(() => {});
    }
  }, []);

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (musicOn) {
      audio.pause();
    } else {
      audio.muted = false;
      audio.play().catch(() => {});
    }
    setMusicOn(!musicOn);
  };

  const handleRSVPClick = () => window.open(GOOGLE_FORM_URL, '_blank', 'noopener,noreferrer');

  const countdownRef = useReveal();
  const detailsRef = useReveal();
  const rsvpRef = useReveal();

  return (
    <div className={`app ${opened ? 'is-open' : 'is-closed'}`}>
      <audio ref={audioRef} src={MUSIC_SRC} loop autoPlay muted playsInline />

      {/* ---------- Single fixed background photo — stays put behind every section ---------- */}
      <div className="page-bg" aria-hidden="true">
        {BACKGROUND_IMAGE_URL ? (
          <img className="page-bg-img" src={BACKGROUND_IMAGE_URL} alt="" />
        ) : (
          <div className="page-bg-img page-bg-fallback" />
        )}
        <div className="page-bg-scrim" />
      </div>

      {/* ---------- Seal overlay: tap to open the invitation ---------- */}
      <div className="seal-overlay" aria-hidden={opened}>
        <div className="seal-paper">
          <Frond className="seal-frond seal-frond-tl" />
          <Frond className="seal-frond seal-frond-br" flip />
          <p className="seal-eyebrow">You are cordially invited to the wedding of</p>
          <h1 className="seal-names">Nushara<span className="amp">&amp;</span>Numesh</h1>
          <button className="seal-button" onClick={openInvitation} aria-label="Open the invitation">
            <span className="seal-button-ring" />
            <span className="seal-button-inner">N&nbsp;&amp;&nbsp;N</span>
          </button>
          <p className="seal-hint">Tap the seal to open</p>
        </div>
      </div>

      {opened && (
        <button
          className={`music-toggle ${musicOn ? 'is-playing' : ''}`}
          onClick={toggleMusic}
          aria-label={musicOn ? 'Pause music' : 'Play music'}
          title={musicOn ? 'Pause music' : 'Play music'}
        >
          <span className="music-toggle-ring" />
          {musicOn ? <IconMusicOn /> : <IconMusicOff />}
        </button>
      )}

      {/* ---------- Hero ---------- */}
      <section className="hero">
        <div className="hero-content">
          <div className="monogram">N&nbsp;&amp;&nbsp;N</div>
          <p className="eyebrow">We&rsquo;re getting married</p>
          <h1 className="couple-names">Nushara &amp; Numesh</h1>
          <p className="wedding-date">Friday · August 07, 2026 · Colombo</p>
          <div className="divider" />
          <p className="tagline">
            Together with their families, joyfully invite you to celebrate the beginning of their forever
          </p>
        </div>
        <div className="scroll-cue" aria-hidden="true">
          <IconChevron />
        </div>
      </section>

      {/* ---------- Countdown (glass panel over the background photo) ---------- */}
      <section className="countdown-section" ref={countdownRef}>
        <div className="glass-panel">
          <Frond className="section-frond" />
          <p className="section-eyebrow">Save the date</p>
          <h2>Counting down to our big day</h2>
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
        </div>
      </section>

      {/* ---------- Quote strip ---------- */}
      <section className="quote-strip">
        <p className="story-quote">
          &ldquo;Two hearts, one home, and a lifetime of small mornings ahead.&rdquo;
        </p>
      </section>

      {/* ---------- Details (glass cards over the background photo) ---------- */}
      <section className="details-section" ref={detailsRef}>
        <p className="section-eyebrow" style={{ textAlign: 'center' }}>The particulars</p>
        <h2 className="details-heading">Wedding details</h2>
        <div className="details-grid">
          <div className="detail-card reveal">
            <IconCalendar />
            <h3>Date</h3>
            <p>Friday, August 07, 2026</p>
          </div>
          <div className="detail-card reveal" style={{ transitionDelay: '0.08s' }}>
            <IconClock />
            <h3>Time</h3>
            <p>8:00 AM</p>
          </div>
          <div className="detail-card reveal" style={{ transitionDelay: '0.16s' }}>
            <IconChurch />
            <h3>Ceremony</h3>
            <p>Holy Emmanuel Church</p>
            <p className="address">Holy Emmanuel Church Rd, Moratuwa</p>
          </div>
          <div className="detail-card reveal" style={{ transitionDelay: '0.24s' }}>
            <IconCelebration />
            <h3>Reception</h3>
            <p>Seagates Hotel</p>
            <p className="address">St. Sebastian Road, Katukurunda, Kalutara</p>
          </div>
        </div>
      </section>

      {/* ---------- RSVP (glass panel, deeper tint) ---------- */}
      <section className="rsvp-section" ref={rsvpRef}>
        <div className="glass-panel glass-panel-dark">
          <Frond className="section-frond section-frond-light" />
          <h2>RSVP</h2>
          <p className="rsvp-subtitle">Please confirm your attendance below</p>
          <button className="rsvp-button" onClick={handleRSVPClick}>
            <IconMail />
            <span>Fill out RSVP form</span>
          </button>
          <p className="rsvp-note">We kindly request your response by July 20, 2026</p>
        </div>
      </section>

      <footer className="footer">
        <div className="monogram">N&nbsp;&amp;&nbsp;N</div>
        <p>We can&rsquo;t wait to celebrate with you</p>
      </footer>
    </div>
  );
}

export default App;
