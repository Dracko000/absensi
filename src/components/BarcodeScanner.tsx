'use client';

import { useState, useEffect, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

interface BarcodeScannerProps {
  onScan: (result: string) => void;
  onError?: (error: Error) => void;
  onScanComplete?: () => void;
}

export default function BarcodeScanner({ onScan, onError, onScanComplete }: BarcodeScannerProps) {
  const [scanning, setScanning] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    codeReaderRef.current = new BrowserMultiFormatReader();

    if (videoRef.current && scanning) {
      const selectedDeviceId = undefined; // Use the first available device

      codeReaderRef.current
        .decodeFromConstraints(
          {
            video: { facingMode: 'environment' },
          },
          videoRef.current,
          (result, err) => {
            if (result) {
              setScanning(false);
              onScan(result.getText());
              if (onScanComplete) onScanComplete();
            }
            // Check if error is not a NotFoundException (which is expected when no barcode is found)
            if (err && err.name !== 'NotFoundException') {
              console.error(err);
              if (onError) onError(err as Error);
            }
          }
        )
        .catch((err) => {
          console.error('Failed to start barcode scanner:', err);
          if (onError) onError(err as Error);
        });
    }

    return () => {
      if (codeReaderRef.current) {
        codeReaderRef.current.reset();
      }
    };
  }, [scanning, onScan, onError, onScanComplete]);

  const handleRestart = () => {
    setScanning(true);
  };

  return (
    <div className="relative bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        className="w-full h-auto max-h-96"
        playsInline
        muted
      />
      {scanning && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="border-4 border-blue-500 border-t-transparent rounded-full w-12 h-12 animate-spin"></div>
        </div>
      )}
      {!scanning && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <button
            onClick={handleRestart}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Scan Ulang
          </button>
        </div>
      )}
    </div>
  );
}