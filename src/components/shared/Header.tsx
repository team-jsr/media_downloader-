import React from 'react';
import { Sparkles } from 'lucide-react';
import './Header.css';

export const Header: React.FC = () => {
  return (
    <header className="app-header">
      <div className="header-container">
        <a href="/" className="logo">
          <Sparkles className="logo-icon" size={28} />
          <span className="logo-text text-gradient">SnapDL</span>
        </a>
        <nav className="main-nav">
          <a href="#" className="nav-link">Home</a>
          <a href="#" className="nav-link">About</a>
          <a href="#" className="nav-link">Contact</a>
        </nav>
      </div>
    </header>
  );
};
