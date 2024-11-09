// src/pages/LandingPage.js
import React from 'react';
import './LandingPage.css';  // スタイルを読み込む
import Start from '../components/Start';
import Header from '../components/Header';
import MainContent from '../components/MainContent';
import Footer from '../components/Footer';

const LandingPage = () => {
  return (
    <div>
      <Start />
      <Header />
      <MainContent />
      <Footer />
    </div>
  );
};

export default LandingPage;


