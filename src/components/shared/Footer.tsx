import React from 'react';
import './Footer.css';

export const Footer: React.FC = () => {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <p className="footer-text">
          &copy; {new Date().getFullYear()} SnapDL. Built for seamless media downloading.
        </p>
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
};
