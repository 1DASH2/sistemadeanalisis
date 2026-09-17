import React, { useState } from 'react';
import { CameraCapture } from '../components/CameraCapture';
import { FaceResultCard } from '../components/FaceResultCard';
import { apiService } from '../services/api';
import type { RecognitionResult } from '../types/facial';
import { ScanFace, Sliders, ShieldCheck } from 'lucide-react';

export const Reconocimiento: React.FC = () => {
  const [umbral, setUmbral] = useState<number>(0.75);
  const [result, setResult] = useState<RecognitionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleCapture = async (imageBase64: string) => {
    setIsAnalyzing(true);
    setStatusMessage('Extrayendo embedding facial y calculando similitud coseno...');

    try {
      const recognition = await apiService.recognizeFace(imageBase64, umbral);
      setResult(recognition);
      setStatusMessage(null);
    } catch (err) {
      console.error(err);
      setStatusMessage('Ocurrió un error al procesar la imagen facial.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <ScanFace className="w-5 h-5 text-cyan-400" />
          Módulo de Reconocimiento y Comparación Facial
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Captura el rostro para compararlo matemáticamente contra los embeddings almacenados y predecir la probabilidad de acierto.
        </p>
      </div>

      {/* Control de Umbral de Aceptación (Página 4 del PDF) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Umbral de Decisión (\tau):{' '}
              <strong className="text-cyan-400 font-mono text-sm">{umbral.toFixed(2)}</strong>
            </span>
            <p className="text-[11px] text-slate-400 max-w-xl">
              Un umbral más alto reduce falsos positivos (mayor seguridad), mientras que un umbral más bajo tolera ligeras variaciones de ángulo o iluminación.
            </p>
          </div>

          <div className="w-full sm:w-64 space-y-1">
            <input
              type="range"
              min="0.50"
              max="0.95"
              step="0.01"
              value={umbral}
              onChange={(e) => setUmbral(parseFloat(e.target.value))}
              className="w-full accent-cyan-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>0.50 (Flexible)</span>
              <span>0.75 (Recomendado)</span>
              <span>0.95 (Estricto)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Panel Central: Cámara y Resultado */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-sm font-semibold text-slate-300">Entrada de Video / Cámara</h3>
          <CameraCapture
            onCapture={handleCapture}
            isLoading={isAnalyzing}
            buttonLabel="Escanear y Reconocer"
          />

          {statusMessage && (
            <p className="text-xs font-mono text-cyan-400 animate-pulse text-center">
              {statusMessage}
            </p>
          )}
        </div>

        <div className="lg:col-span-6 space-y-4">
          <h3 className="text-sm font-semibold text-slate-300">Veredicto e Identidad Candidata</h3>
          <FaceResultCard result={result} isLoading={isAnalyzing} />

          {/* Tarjeta explicativa de Similitud vs Probabilidad */}
          <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-xl text-xs space-y-2 text-slate-400">
            <div className="flex items-center gap-2 text-slate-300 font-semibold">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              ¿Cómo interpreta el sistema los resultados?
            </div>
            <p className="text-[11px] leading-relaxed">
              1. <strong>Similitud Coseno:</strong> Calculada entre el vector extraído y cada vector registrado en la base de datos.<br />
              2. <strong>Regla de Umbral:</strong> Si la similitud supera <code className="text-cyan-300">{umbral.toFixed(2)}</code>, se declara coincidencia candidata.<br />
              3. <strong>Probabilidad Calibrada (ML):</strong> Ajusta el grado de certeza considerando perturbaciones de ruido, iluminación y distancia euclidiana.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
