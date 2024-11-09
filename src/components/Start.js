// src/components/Start.js

import React, { useState, useEffect , useRef } from 'react';
import anime from 'animejs';



const Start = () => {

  const elementRef = useRef(null);
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
    }, 4500);


    // テキストを文字ごとに分割してspanで囲む
    const element = elementRef.current;
    element.innerHTML = element.textContent.replace(
        /\S/g,
        "<span class='letter'>$&</span>"
    );

    // アニメーション設定
    anime.timeline({loop: false})
        .add({
        targets: '.ml12 .letter',
        translateX: [40, 0],
        translateZ: 0,
        opacity: [0, 1],
        easing: "easeOutExpo",
        duration: 1200,
        delay: (el, i) => 500 + 30 * i
        }).add({
            targets: '.ml12 .letter',
            translateX: [0,-30],
            opacity: [1,0],
            easing: "easeInExpo",
            duration: 1000,
            delay: (el, i) => 100 + 30 * i
          })


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
        <p className={`ml12 ${isVisible ? 'visible' : 'hidden'}`} ref={elementRef}>Feel Happy</p>
      </div>
    </header>
  );
};

export default Start;