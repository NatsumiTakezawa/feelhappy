// src/components/EstimateCalculator.js
import React, { useState, useEffect, useRef} from 'react';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { jsPDF } from 'jspdf';
// import '../App.css';
import '../ipaexm-normal.js';




// 加工面積の入力値を格納する状態を初期化する
const EstimateCalculator = () => {
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  // イラスト追加オプション
  const [illustrationLength, setIllustrationLength] = useState('');
  const [illustrationWidth, setIllustrationWidth] = useState('');
  // フォント追加
  const [fontChange, setFontChange] = useState(false);
  // 素材変更
  const [materialChange, setMaterialChange] = useState(false);

  const [price, setPrice] = useState(0);
  const [errors, setErrors] = useState({});



   




    // 制限値の定数
    const MAX_LENGTH = 42;
    const MAX_WIDTH = 29.7;
    const MAX_AREA = 1247.4;
    const BASE_AREA = 310.8;
    const BASE_PRICE = 5000;
    const PRICE_INCREMENT = 500;
    const AREA_INCREMENT = 100;


    const calculatePrice = () => {
    let basePrice = BASE_PRICE;
    let calculatedErrors = {};
    



// 長辺・短辺のチェック
const numLength = parseFloat(length);
const numWidth = parseFloat(width);

// 小数点以下第二位やそれ以上のチェック
//splitで.を使って数値を分割して、例えば45.67だと[1]で2番目の配列67を取ってくる
const decimalLengthPoint = length.split('.')[1];
const decimalWidthPoint = width.split('.')[1];

// ここでいうlengthは文字列の長さ（桁数）が1以下か
if (decimalLengthPoint && decimalLengthPoint.length > 1) {
  calculatedErrors.length = '長辺は小数点以下第一位まで入力してください';
}
if (decimalWidthPoint && decimalWidthPoint.length > 1) {
  calculatedErrors.width = '短辺は小数点以下第一位まで入力してください';
}

// 長辺または短辺が0または0以下でないか
if (numLength <= 0 || numWidth <= 0 ) {
  calculatedErrors.general = '長辺と短辺のどちらも0または0以下であってはなりません';
}

// 長辺または短辺が未入力でないか
if ( !numLength  || !numWidth ) {
  calculatedErrors.general = '長辺と短辺両方ご入力ください';
}

if (numLength > MAX_LENGTH) {
  calculatedErrors.length = `長辺は最大${MAX_LENGTH}cmまでです`;
}
if (numWidth > MAX_WIDTH) {
  calculatedErrors.width = `短辺は最大${MAX_WIDTH}cmまでです`;
}

const area = numLength * numWidth;
if (area > MAX_AREA) {
  calculatedErrors.area = `面積が最大${MAX_AREA}cm²までです`;
}

// 加工サイズの料金計算
if (!calculatedErrors.length && !calculatedErrors.width && area <= MAX_AREA && area > 0) {
  if (area > 0 && area <= BASE_AREA) {
    // 基本料金だけを設定（追加料金なし）
    basePrice = BASE_PRICE;
  } else if (area > BASE_AREA && area <= MAX_AREA) {
    // 基本料金に追加料金を計算して加える
    const extraArea = area - BASE_AREA;
    const extraPrice = Math.ceil(extraArea / AREA_INCREMENT) * PRICE_INCREMENT;
    basePrice += extraPrice;  
  }
}



// イラスト追加のチェック
const numIllustrationLength = parseFloat(illustrationLength);
const numIllustrationWidth = parseFloat(illustrationWidth);


// 小数点以下第二位やそれ以上のチェック
//splitで.を使って数値を分割して、例えば45.67だと[1]で2番目の配列67を取ってくる
const decimalIllustrationLengthPoint = illustrationLength.split('.')[1];
const decimalIllustrationWidthPoint = illustrationWidth.split('.')[1];

if (numIllustrationLength > numLength || numIllustrationWidth > numWidth) {
  calculatedErrors.illustration = 'イラストのサイズは加工サイズ以内に設定してください';
}
if (decimalIllustrationLengthPoint && decimalIllustrationLengthPoint.length > 1) {
  calculatedErrors.illustrationLength = '長辺は小数点以下第一位まで入力してください';
}
if (decimalIllustrationWidthPoint && decimalIllustrationWidthPoint.length> 1) {
  calculatedErrors.illustrationWidth = '短辺は小数点以下第一位まで入力してください';
}

// 長辺または短辺が0または0以下でないか
if (numIllustrationLength && numIllustrationLength <= 0 || numIllustrationWidth && numIllustrationWidth <= 0 ) {
  calculatedErrors.illustrationgeneral = '長辺と短辺のどちらも0または0以下であってはなりません';
}

// 長辺または短辺が未入力でないか
if (numIllustrationLength && !numIllustrationWidth || numIllustrationWidth && !numIllustrationLength) {
  calculatedErrors.illustrationgeneral = '長辺と短辺両方ご入力ください';
}



let illustrationArea = numIllustrationLength * numIllustrationWidth;

if (!calculatedErrors.illustrationLength && !calculatedErrors.illustrationWidth && illustrationArea > 0) {
  if (illustrationArea <= 25) {
    basePrice += 1000;
  } else if (illustrationArea <= 100) {
    basePrice += 2000;
  } else if (illustrationArea <= 225) {
    basePrice += 3000;
  } else if(illustrationArea <= 1247.4){
    basePrice += 4000;
  }
}

// フォント変更・素材変更の料金計算
if (fontChange) basePrice += 1000;
if (materialChange) basePrice += 2000;


// エラーオブジェクトに何か入っていれば、エラーをsetし、空の場合は合計金額をsetする
if (Object.keys(calculatedErrors).length > 0) {
  setErrors(calculatedErrors);
  return;
} else {
  setErrors({});
  setPrice(basePrice);
}
};






// 入力フィールドの値を制御
const handleInputChange = (setter, value) => {
const formattedValue = value === '' || /^\d*\.?\d{0,1}$/.test(value) ? value : value ;
setter(formattedValue);
};




// PDF生成
const generatePDF = () => {
  const doc = new jsPDF();
  
    
    // PDFのスタイル設定
    doc.setFont("ipaexm");
    doc.setFontSize(20);
    doc.text('見積書', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    const today = new Date().toLocaleDateString('ja-JP');
    doc.text(`発行日: ${today}`, 20, 40);
    
    // 見積内容
    doc.setFontSize(14);
    doc.text('【見積内容】', 20, 60);
    doc.setFontSize(12);
    doc.text(`サイズ: ${length}cm × ${width}cm`, 30, 75);
    doc.text(`金額: ¥${price.toLocaleString()}`, 30, 95);
    
    // 注意事項
    doc.setFontSize(10);
    doc.text('※ 310.8cm²までは一律5,000円', 20, 120);
    doc.text('※ 100cm²ごとに1,000円追加', 20, 130);
    
    // PDF保存
    doc.save('見積書.pdf');
  };



  return (
    <div className="estimate_section">
      <div className="estimate_content">
        <div className="size_section">
        <div className="size_titlecontent">
          <h1 className="size_title">加工サイズ</h1>
          <img src="./required.svg"/>
          <p>※数値は半角でご入力ください</p>
        </div>
          <div className="longsize_section">
            <p>【MAX 42cm】</p>
            <Label htmlFor="length">長辺 </Label>
            <Input
              id="length"
              type="number"
              value={length}
              onChange={(e) => handleInputChange(setLength, e.target.value)}
              placeholder="長辺を入力 (最大42cm)"
              className="mt-1"
            />
            cm
            {errors.length &&  <p style={{ color: 'red' }}>{errors.length}</p>}
          </div>

          <div className="shortsize_section">
            <p>【MAX 29.7cm】</p>
            <Label htmlFor="width">短辺 </Label>
            <Input
              id="width"
              type="number"
              value={width}
              onChange={(e) => handleInputChange(setWidth, e.target.value)}
              placeholder="短辺を入力 (最大29.7cm)"
              className="mt-1"
            />
            cm
            {errors.width && <p style={{ color: 'red' }}>{errors.width}</p>}
            {errors.general && <p style={{ color: 'red' }}>{errors.general}</p>}
          </div>

          <div className="charge_section">
            <p>※310.8cm²までは ¥5,000（一律）</p>
            <p>※以降100cm²ごとに ¥500追加</p>
            <p>※最大加工面積1,247.4cm²</p>
          </div>
      </div>

          <div className="illustration_section">
            <h1 className="illustration_title">イラスト追加</h1>
              <p>※数値は半角でご入力ください</p>
              <div className="longillustration_section">
                <Label htmlFor="illustrationLength">長辺 </Label>
                <input
                  type="number"
                  value={illustrationLength}
                  onChange={(e) => handleInputChange(setIllustrationLength, e.target.value)}
                  placeholder="長辺を入力"
                  className="mt-1"
                />cm
              </div>
              {errors.illustrationLength &&  <p style={{ color: 'red' }}>{errors.illustrationLength}</p>}

              <div className="shortillustration_section">
                <Label htmlFor="illustrationWidth">短辺 </Label>
                <input
                  type="number"
                  value={illustrationWidth}
                  onChange={(e) => handleInputChange(setIllustrationWidth, e.target.value)}
                  placeholder="短辺を入力"
                  className="mt-1"
                />cm
              </div>
              {errors.illustrationWidth && <p style={{ color: 'red' }}>{errors.illustrationWidth}</p>}
              {errors.illustrationgeneral && <p style={{ color: 'red' }}>{errors.illustrationgeneral}</p>}
              {errors.illustration && <p style={{ color: 'red' }}>{errors.illustration}</p>}

            <div className="precautions">
              <p>※イラストが複数、もしくは広範囲に及ぶものは、
              模様の端から端までを測って数値をご入力ください</p>
            </div>

            <div className="precautions_example">
              <p>例１</p><p>模様が複数存在</p>
              <img src="./exm1.svg"/>
              <p>例２</p><p>模様が広範囲に及ぶ</p>
              <img src="./exm2.svg"/>
            </div>
            <h1>イラスト追加のご注意事項</h1>
            <p>※濃淡のあるデザイン不可<br></br>
              ※イラストの長辺・短辺の長さは加工サイズに収まるようにしてください<br></br>
              ※細かすぎたり小さすぎるデザインは加工機の都合上<br></br>
              お受けできない可能性もございます<br></br>
              ※デザイン内容によってはお見積もり金額が前後するため<br></br>
              あくまで参考程度にお考え下さい<br></br>
              ※イラストデータはお客様ご自身でご用意ください。<br></br>
              こちらでデザインは製作いたしかねます<br></br>
              ※イラストデータをIllustratorでご用意いただける場合、<br></br>
              お見積もり金額より安くなる場合もございます<br></br>
              ※手書き文字はイラストの対象にはなりません。<br></br>
              フォント選択の"サンプル写真以外のフォントを希望する"を<br></br>
              ご選択ください</p>
          </div>


        <div className="font_section">
          <h1>フォント選択</h1>
          <img src="./required.svg"/>
            <input 
              type="checkbox"
              checked={fontChange}
              onChange={(e) => setFontChange(e.target.checked)}
              />
            <label>以下のサンプル写真内のフォント…無料</label>
          <p>※1フォント毎の料金です</p>
        </div>

        <div className='material_section'>
          <label>
            <input
              type="checkbox" 
              checked={materialChange}
              onChange={(e) => setMaterialChange(e.target.checked)} 
            />
            素材変更 +2000円
          </label>
            <p>透明アクリル</p>
            <p>乳白色アクリル</p>
            <p>ホワイトアクリル</p>
            <p>ブラックアクリル</p>         
            <p>ゴールドアクリル</p>
            <p>シルバーアクリル</p>
        </div>

        <div className='calculate_button'>
          <button onClick={calculatePrice}>見積もりする</button>
        </div>

          <div className="total_price">
            <div className="tprice_section">
            {price > 0 && <h3>合計金額: {price}円</h3>}
            </div>
          </div>

          <div className='pdf_section'>
            <Button 
              onClick={generatePDF}
              className="pdf_button"
            >
              見積書をPDF出力
            </Button>
          </div>

      </div>
    </div>
  );
};


export default EstimateCalculator;