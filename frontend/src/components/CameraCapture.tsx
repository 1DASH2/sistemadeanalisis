import React, { useRef, useState, useCallback } from 'react';
import Webcam from 'react-webcam';
import { Camera, RefreshCw, Upload, CheckCircle, AlertCircle } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (imageSrc: string) => void;
  isLoading?: boolean;
  buttonLabel?: string;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({
  onCapture,
  isLoading = false,
  buttonLabel = "Capturar Imagen"
}) => {
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [hasCameraError, setHasCameraError] = useState(false);

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
        onCapture(imageSrc);
      }
    }
  }, [webcamRef, onCapture]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCapturedImage(result);
        onCapture(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const toggleFacingMode = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  return (
    <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col items-center">
      {/* Visualización de Cámara / Foto */}
      <div className="relative w-full aspect-video max-w-lg bg-black rounded-xl overflow-hidden border-2 border-slate-700/60 shadow-inner flex items-center justify-center">
        {capturedImage ? (
          <img
            src={capturedImage}
            alt="Captura facial"
            className="w-full h-full object-cover"
          />
        ) : hasCameraError ? (
          <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400">
            <AlertCircle className="w-12 h-12 text-amber-500 mb-2" />
            <p className="font-semibold text-slate-200 text-sm">Cámara no disponible</p>
            <p className="text-xs text-slate-400 mt-1 max-w-xs">
              Verifica los permisos del navegador o utiliza la opción de subir una fotografía.
            </p>
          </div>
        ) : (
          <>
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                facingMode: facingMode,
                width: 1280,
                height: 720,
              }}
              onUserMediaError={() => setHasCameraError(true)}
              className="w-full h-full object-cover"
            />
            {/* Guía biométrica de alineación facial (Documento pág. 4) */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
              <div className="w-48 h-64 border-2 border-dashed border-cyan-400/70 rounded-full animate-pulse flex flex-col items-center justify-center">
                <span className="text-[10px] uppercase font-mono tracking-wider text-cyan-300 bg-slate-950/70 px-2 py-0.5 rounded backdrop-blur">
                  Área de Detección
                </span>
              </div>
            </div>
            <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur border border-slate-700/80 px-2.5 py-1 rounded-md text-[11px] text-cyan-400 font-mono flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              Live Feed
            </div>
          </>
        )}
      </div>

      {/* Acciones y Controles */}
      <div className="w-full mt-4 flex flex-wrap items-center justify-between gap-3 max-w-lg">
        <div className="flex items-center gap-2">
          {!capturedImage && !hasCameraError && (
            <button
              type="button"
              onClick={toggleFacingMode}
              className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title="Cambiar cámara"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
          >
            <Upload className="w-3.5 h-3.5 text-slate-400" />
            Subir archivo
          </button>
        </div>

        {capturedImage ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRetake}
              className="px-4 py-2 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
            >
              Tomar otra foto
            </button>
            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle className="w-4 h-4" /> Foto lista
            </span>
          </div>
        ) : (
          <button
            type="button"
            onClick={capture}
            disabled={isLoading || hasCameraError}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-semibold shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition transform active:scale-95"
          >
            <Camera className="w-4 h-4" />
            {isLoading ? "Procesando rostro..." : buttonLabel}
          </button>
        )}
      </div>
    </div>
  );
};
