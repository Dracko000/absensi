'use client';

import { useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';

interface BarcodeGeneratorProps {
  value: string;
  format?: string;
  width?: number;
  height?: number;
  displayValue?: boolean;
}

export default function BarcodeGenerator({ 
  value, 
  format = 'CODE128', 
  width = 2, 
  height = 100,
  displayValue = true 
}: BarcodeGeneratorProps) {
  const barcodeRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (barcodeRef.current) {
      JsBarcode(barcodeRef.current, value, {
        format: format,
        width: width,
        height: height,
        displayValue: displayValue,
      });
    }
  }, [value, format, width, height, displayValue]);

  return (
    <div className="flex flex-col items-center">
      <svg ref={barcodeRef} className="w-full max-w-xs" />
      <div className="mt-2 text-center">
        <p className="text-sm text-gray-600 break-all">{value}</p>
      </div>
    </div>
  );
}