// src/components/Start.js

import React, { useState, useEffect } from 'react';
import anime from 'animejs';



const Start = () => {

  const [isVisible, setIsVisible] = useState(false);
  const [isStartVisible, setIsStartVisible] = useState(true);

  useEffect(() => {
    // ロゴのフェードイン
    const fadeInTimeout = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    // 背景含めたフェードアウト
    const fadeOutTimeout = setTimeout(() => {
      setIsStartVisible(false);
    }, 2500);

    // クリーンアップ関数
    return () => {
      clearTimeout(fadeInTimeout);
      clearTimeout(fadeOutTimeout);
    };
  }, []);

  // コンポーネントが非表示の場合は何も表示しない
  if (!isStartVisible) return null;

  return (
    <header>
      <div className={`start ${isStartVisible ? 'visible' : 'hidden'}`}>
        <p className={isVisible ? 'visible' : 'hidden'}>Feel Happy</p>
      </div>
    </header>
  );
};

export default Start;