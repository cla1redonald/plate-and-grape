'use client';

import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { X, Camera, RotateCcw } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
  label: string;
}

export function CameraCapture({ onCapture, onClose, label }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  const takePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.8);
        setCapturedImage(imageData);
        // Stop the stream
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
          setStream(null);
        }
      }
    }
  };

  const retake = () => {
    setCapturedImage(null);
  };

  const confirmPhoto = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  const switchCamera = () => {
    // Stop current stream
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Start camera on mount and when facing mode changes
  useEffect(() => {
    let mounted = true;
    
    const initCamera = async () => {
      if (!capturedImage && mounted) {
        try {
          setError(null);
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode, width: { ideal: 1920 }, height: { ideal: 1080 } },
          });
          if (mounted) {
            setStream(mediaStream);
            if (videoRef.current) {
              videoRef.current.srcObject = mediaStream;
            }
          } else {
            // Component unmounted, stop the stream
            mediaStream.getTracks().forEach((track) => track.stop());
          }
        } catch (err) {
          console.error('Camera access error:', err);
          if (mounted) {
            setError('Unable to access camera. Please check permissions.');
          }
        }
      }
    };

    initCamera();

    return () => {
      mounted = false;
    };
  }, [facingMode, capturedImage]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [stream]);

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col" style={{ height: '100dvh' }}>
      {/* Header */}
      <header className="flex items-center justify-between p-4 bg-black/50 safe-area-top">
        <button onClick={onClose} className="p-2 text-white">
          <X size={24} />
        </button>
        <span className="text-white font-medium">{label}</span>
        <button onClick={switchCamera} className="p-2 text-white">
          <RotateCcw size={24} />
        </button>
      </header>

      {/* Camera View / Preview */}
      <div className="flex-1 relative overflow-hidden">
        {error ? (
          <div className="flex items-center justify-center h-full p-4">
            <div className="text-center">
              <p className="text-white mb-4">{error}</p>
              <Button onClick={() => setCapturedImage(null)} variant="secondary">
                Try Again
              </Button>
            </div>
          </div>
        ) : capturedImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={capturedImage}
            alt="Captured"
            className="w-full h-full object-contain"
          />
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            onLoadedMetadata={() => videoRef.current?.play()}
            className="w-full h-full object-cover"
          />
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Controls - fixed to bottom with safe area */}
      <div className="p-6 bg-black/50 pb-safe">
        {capturedImage ? (
          <div className="flex gap-4">
            <Button onClick={retake} variant="secondary" className="flex-1">
              Retake
            </Button>
            <Button onClick={confirmPhoto} className="flex-1">
              Use Photo
            </Button>
          </div>
        ) : (
          <button
            onClick={takePhoto}
            className="mx-auto block w-16 h-16 rounded-full bg-white border-4 border-[#722F37] hover:bg-[#F5F5F5] transition-colors"
          >
            <Camera size={24} className="mx-auto text-[#722F37]" />
          </button>
        )}
      </div>
    </div>
  );
}
