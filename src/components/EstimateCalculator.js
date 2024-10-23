// src/components/EstimateCalculator.js
import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { jsPDF } from 'jspdf';

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
  const [errors, setErrors] = useState({

  });


    // 制限値の定数
    const MAX_LENGTH = 42;
    const MAX_WIDTH = 29.7;
    const MAX_AREA = 1247.4;
    const BASE_AREA = 310.8;
    const BASE_PRICE = 5000;
    const PRICE_INCREMENT = 1000;
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
  doc.setFont('helvetica');
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
    <Card className="w-full max-w-md mx-auto p-6">
      <CardHeader className="text-2xl font-bold text-center">
        加工サイズ
      </CardHeader>
      <div>※数値は半角でご入力ください</div>
      <CardContent className="space-y-4">
        <div>
          <div>【MAX 42cm】</div>
          <Label htmlFor="length">長辺 </Label>
          <Input
            id="length"
            type="number"
            value={length}
            onChange={(e) => handleInputChange(setLength, e.target.value)}
            placeholder="長辺を入力 (最大42cm)"
            className="mt-1"
          />
          (cm)
          {errors.length &&  <p style={{ color: 'red' }}>{errors.length}</p>}
        </div>

        <div>
          <div>【MAX 29.7cm】</div>
          <Label htmlFor="width">短辺 </Label>
          <Input
            id="width"
            type="number"
            value={width}
            onChange={(e) => handleInputChange(setWidth, e.target.value)}
            placeholder="短辺を入力 (最大29.7cm)"
            className="mt-1"
          />
          (cm)
          {errors.width && <p style={{ color: 'red' }}>{errors.width}</p>}
          {errors.general && <p style={{ color: 'red' }}>{errors.general}</p>}
        </div>

      <div className="mb-2">料金体系:</div>
        <ul className="list-disc ml-4">
          <li>310.8cm²まで: ¥5,000（一律）</li>
          <li>以降100cm²ごとに: ¥1,000追加</li>
          <li>最大サイズ: 1,247.4cm²</li>
        </ul>
      <div>

        <h1>イラスト追加</h1>
        <div>
          <Label htmlFor="length">長辺 </Label>
          <input
            type="number"
            value={illustrationLength}
            onChange={(e) => handleInputChange(setIllustrationLength, e.target.value)}
            placeholder="長辺を入力"
            className="mt-1"
          />(cm)
        </div>
        {errors.illustrationLength &&  <p style={{ color: 'red' }}>{errors.illustrationLength}</p>}

        <div>
          <Label htmlFor="width">短辺 </Label>
          <input
            type="number"
            value={illustrationWidth}
            onChange={(e) => handleInputChange(setIllustrationWidth, e.target.value)}
            placeholder="短辺を入力"
            className="mt-1"
          />(cm)
        </div>
        {errors.illustrationWidth && <p style={{ color: 'red' }}>{errors.illustrationWidth}</p>}
        {errors.illustrationgeneral && <p style={{ color: 'red' }}>{errors.illustrationgeneral}</p>}
        {errors.illustration && <p style={{ color: 'red' }}>{errors.illustration}</p>}

      </div>


      <div>
        <label>
          <input 
            type="checkbox"
            checked={fontChange}
            onChange={(e) => setFontChange(e.target.checked)}
            />
          フォント変更 +1000円
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox" 
            checked={materialChange}
            onChange={(e) => setMaterialChange(e.target.checked)} 
          />
          素材変更 +2000円
        </label>
      </div>


      <button onClick={calculatePrice}>見積もりする</button>


        <div className="mt-6 p-4 bg-gray-50 rounded-lg">

          <div className="text-xl mt-2">
          {price > 0 && <h3>見積もり価格: {price}円</h3>}
          </div>
        </div>

        
          <Button 
            onClick={generatePDF}
            className="w-full mt-4"
          >
            見積書をPDF出力
          </Button>
        
      </CardContent>

      <CardFooter className="text-sm text-gray-500 flex-col items-start">
      </CardFooter>
    </Card>
  );
};


export default EstimateCalculator;