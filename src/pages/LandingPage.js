// src/pages/LandingPage.js
import React from 'react';
import './LandingPage.css';  // スタイルを読み込む
import Header from '../components/Header';
import MainContent from '../components/MainContent';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div>
      <Header />
      <MainContent />
      <Footer />
    </div>
  );
};

export default LandingPage;


