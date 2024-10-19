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

// 入力値を格納する状態を初期化する
const EstimateCalculator = () => {
  const [length, setLength] = useState('');
  const [width, setWidth] = useState('');
  const [area, setArea] = useState(0);
  const [price, setPrice] = useState(0);
  const [errors, setErrors] = useState({
    length: '',
    width: '',
    general: ''
  });
  const [fontOption, setFontOption] = useState(false);
  const [materialOption, setMaterialOption] = useState(false);

    // 制限値の定数
    const MAX_LENGTH = 42;
    const MAX_WIDTH = 29.7;
    const MAX_AREA = 1247.4;
    const BASE_AREA = 310.8;
    const BASE_PRICE = 5000;
    const PRICE_INCREMENT = 1000;
    const AREA_INCREMENT = 100;



 // 入力値の検証と価格計算
 const calculateEstimate = () => {
    setErrors({ length: '', width: '', general: '' });
    
    if (length && width) {
      const numLength = parseFloat(length);
      const numWidth = parseFloat(width);
      
      if (isNaN(numLength) || isNaN(numWidth)) {
        setErrors(prev => ({ ...prev, general: '数値を入力してください' }));
        return;
      }

      if (numLength > MAX_LENGTH) {
        setErrors(prev => ({ ...prev, length: `長辺は最大${MAX_LENGTH}cmまでです` }));
        return;
      }

      if (numWidth > MAX_WIDTH) {
        setErrors(prev => ({ ...prev, width: `短辺は最大${MAX_WIDTH}cmまでです` }));
        return;
      }

      const calculatedArea = (numLength * numWidth);
      
      if (calculatedArea > MAX_AREA) {
        setErrors(prev => ({ ...prev, general: '面積が制限値を超えています' }));
        return;
      }

      //入力値を更新する
      setArea(calculatedArea);

      // 価格計算
      let calculatedPrice = BASE_PRICE;
      if (calculatedArea > BASE_AREA) {
        const extraArea = calculatedArea - BASE_AREA;
        const extraCharge = Math.ceil(extraArea / AREA_INCREMENT) * PRICE_INCREMENT;
        calculatedPrice += extraCharge;
      }
      
      setPrice(calculatedPrice);
    } else {
      setArea(0);
      setPrice(0);
    }
  };

  // ボタンが押されたときに計算を実行する
    const handleEstimate = () => {
      calculateEstimate();
    };


  // 入力値の検証 入力値が変更されたときに呼ばれるハンドラー関数
  const handleInputChange = (e, setter) => {
    let value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setter(parseFloat(value).toFixed(1)); // 小数点第1位までに丸める
    }
   
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
  doc.text(`面積: ${area.toFixed(1)}cm²`, 30, 85);
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
        見積もり計算
      </CardHeader>
      <div>※数値は半角でご入力ください</div>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="length">長辺 (cm)【MAX 42cm】</Label>
          <Input
            id="length"
            type="number"
            value={length}
            step="0.1"
            onChange={(e) => handleInputChange(e, setLength)}
            placeholder="長辺を入力 (最大42cm)"
            className="mt-1"
          />
          {errors.length && (
            <Alert variant="destructive" className="mt-2">
              <AlertDescription>{errors.length}</AlertDescription>
            </Alert>
          )}
        </div>

        <div>
          <Label htmlFor="width">短辺 (cm)【MAX 29.7cm】</Label>
          <Input
            id="width"
            type="number"
            value={width}
            step="0.1"
            onChange={(e) => handleInputChange(e, setWidth)}
            placeholder="短辺を入力 (最大29.7cm)"
            className="mt-1"
          />
          {errors.width && (
            <Alert variant="destructive" className="mt-2">
              <AlertDescription>{errors.width}</AlertDescription>
            </Alert>
          )}
        </div>

        {errors.general && (
          <Alert variant="destructive">
            <AlertDescription>{errors.general}</AlertDescription>
          </Alert>
        )}

     
        <button onClick={handleEstimate}>見積もりする</button>


        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-lg">
            <span className="font-semibold">面積: </span>
            {area.toFixed(1)} cm²
          </div>
          <div className="text-xl mt-2">
            <span className="font-semibold">見積金額: </span>
            ¥{price.toLocaleString()}
          </div>
        </div>

        {area > 0 && !errors.general && !errors.length && !errors.width && (
          <Button 
            onClick={generatePDF}
            className="w-full mt-4"
          >
            見積書をPDF出力
          </Button>
        )}
      </CardContent>

      <CardFooter className="text-sm text-gray-500 flex-col items-start">
        <div className="mb-2">料金体系:</div>
        <ul className="list-disc ml-4">
          <li>310.8cm²まで: ¥5,000（一律）</li>
          <li>以降100cm²ごとに: ¥1,000追加</li>
          <li>最大サイズ: 1,247.4cm²</li>
        </ul>
      </CardFooter>
    </Card>
  );
};


export default EstimateCalculator;