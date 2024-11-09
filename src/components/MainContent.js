// src/components/MainContent.js
import React, { useEffect } from 'react';
// import React from 'react';
import EstimateCalculator from '../components/EstimateCalculator';
import "swiper/css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination} from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/effect-fade'; // フェード効果用のCSSを追加
import 'swiper/css/autoplay';
import AOS from 'aos';
import 'aos/dist/aos.css';



const MainContent = () => {
  
  const swiperParams = {
    modules: [Autoplay, EffectFade,  Pagination],
    effect: "fade",
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
  },
    loop: true,
    speed: 1500,
    autoplay: {
      delay: 1500,
      disableOnInteraction: false
    }
  };


 
  useEffect(() => {
    AOS.init({
      duration: 2000,          // アニメーションの時間
      offset: 200,             // 要素が表示される位置のオフセット
      once: true,             // falseにすることで、スクロールするたびにアニメーションする
      anchorPlacement: 'top-bottom', // 要素の上端が画面の下端に来たときにアニメーション開始
      easing: 'ease-out',      // イージング
      mirror: false, 
    });

      // スクロールイベントでAOSを更新
      window.addEventListener('scroll', () => {
        AOS.refresh();
      });
    }, []);


  return (

  <section className="">
  
      <Swiper {...swiperParams} className="swiper">
        <SwiperSlide>
          <div className="">
            <img
              src="/header1.jpeg"
              alt="スライド1"
              className=""
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="">
            <img
              src="/header2.jpeg"
              alt="スライド2"
              className=""
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="">
            <img
              src="/header3.jpeg"
              alt="スライド3"
              className=""
            />
          </div>
        </SwiperSlide>

        {/* Pagination */}
        <div className="swiper-pagination"></div>
      </Swiper>
    
   
    <div className="title_first" data-aos="fade-left" data-aos-delay="500">
      <p>-シンプルモダン好きな方へ贈る</p>
    </div>
    <div className="title_second" data-aos="fade-left" data-aos-delay="1000">
      <p>　　ワンランク上の名入れアイテム-</p>
    </div>

    <div className="customizeoption" data-aos="fade-up" data-aos-delay="500" >
      <img
        src="/customizeoption.svg"
        alt="customize option"
        className="customize_image"
      />
    </div>
    <div  className="simulate_title" data-aos="fade-up" data-aos-delay="1000">
      <p>お見積もりシュミレーター</p>
    </div>

    <div className="information" data-aos="fade-up" data-aos-delay="1500">
      <p>当shopではお客様に寄り添った作品作りに努めています</p>
      <p>名入れアイテムは全て文言変更可能でございます</p>
      <br></br>
      <p>例えば、ウェルカムボードを結婚証明書に、</p>
      <p>命名書をお店のミニ看板に、</p>
      <p>などオーダーいただいています</p>
      <br></br>
      <p>大きさの変更、イラストの追加など下記より</p>
      <p>ご自由にカスタマイズしお見積もり</p>
      <p>いただけますので是非ご活用くださいませ</p>
    </div>

    <div className="estimate_section">
      <EstimateCalculator />
    </div>

    <a href="https://www.instagram.com/feel_happy2/"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-instagram" viewBox="0 0 16 16">
      <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
    </svg></a>

    </section>
  );
};

export default MainContent;


