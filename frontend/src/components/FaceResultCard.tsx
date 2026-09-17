import React from 'react';
import { XCircle, UserCheck, ShieldAlert, Clock } from 'lucide-react';
import type { RecognitionResult } from '../types/facial';
import { SimilarityBar } from './SimilarityBar';

interface FaceResultCardProps {
  result: RecognitionResult | null;
  isLoading?: boolean;
}

export const FaceResultCard: React.FC<FaceResultCardProps> = ({ result, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-slate-800"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-slate-800 rounded w-1/3"></div>
            <div className="h-3 bg-slate-800 rounded w-1/2"></div>
          </div>
        </div>
        <div className="mt-6 space-y-3">
          <div className="h-3 bg-slate-800 rounded w-full"></div>
          <div className="h-3 bg-slate-800 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="w-full bg-slate-900/60 border border-slate-800/80 border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center text-slate-500">
        <ShieldAlert className="w-12 h-12 text-slate-600 mb-2 stroke-[1.5]" />
        <p className="font-medium text-slate-300 text-sm">Sin escaneo activo</p>
        <p className="text-xs text-slate-500 mt-1 max-w-xs">
          Captura una fotografía con la cámara para ejecutar el reconocimiento biométrico y la calibración probabilística.
        </p>
      </div>
    );
  }

  const { coincide, nombre, similitud, distancia, umbral, probabilidad_calibrada, calidad_imagen, iluminacion, tiempo_ms } = result;

  return (
    <div
      className={`w-full bg-slate-900 border rounded-2xl p-6 shadow-xl transition-all ${
        coincide
          ? 'border-emerald-500/40 shadow-emerald-500/5'
          : 'border-rose-500/40 shadow-rose-500/5'
      }`}
    >
      {/* Encabezado con estado del veredicto */}
      <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              coincide ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
            }`}
          >
            {coincide ? <UserCheck className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-lg font-bold text-slate-100">
                {coincide ? nombre : 'Persona No Reconocida'}
              </h4>
              <span
                className={`px-2 py-0.5 rounded text-[11px] font-semibold uppercase font-mono tracking-wider ${
                  coincide
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-rose-950 text-rose-400 border border-rose-800'
                }`}
              >
                {coincide ? 'Coincidencia' : 'Rechazado'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
              <span>Umbral de decisión: {umbral.toFixed(2)}</span>
              {tiempo_ms && (
                <span className="flex items-center gap-1 text-slate-500">
                  <Clock className="w-3 h-3" /> {tiempo_ms}ms
                </span>
              )}
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">
            Probabilidad Calibrada
          </div>
          <div
            className={`text-xl font-mono font-bold ${
              probabilidad_calibrada >= 0.75 ? 'text-emerald-400' : 'text-amber-400'
            }`}
          >
            {(probabilidad_calibrada * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      {/* Barra de Similitud Coseno */}
      <div className="mt-5">
        <SimilarityBar similitud={similitud} umbral={umbral} />
      </div>

      {/* Desglose de Parámetros Biométricos y ML */}
      <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80">
          <span className="text-slate-500 text-[11px] block">Distancia Vectorial</span>
          <span className="text-slate-200 font-mono font-semibold text-sm">
            {distancia.toFixed(2)}
          </span>
        </div>

        <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80">
          <span className="text-slate-500 text-[11px] block">Calidad de Rostro</span>
          <span className="text-cyan-400 font-medium text-sm">{calidad_imagen || 'Buena'}</span>
        </div>

        <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80">
          <span className="text-slate-500 text-[11px] block">Nivel Iluminación</span>
          <span className="text-amber-400 font-medium text-sm">{iluminacion || 'Media'}</span>
        </div>

        <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800/80">
          <span className="text-slate-500 text-[11px] block">Modelo Inferencia</span>
          <span className="text-indigo-400 font-mono font-medium text-sm">ArcFace+ML</span>
        </div>
      </div>

      {/* Candidatos alternativos si existen */}
      {result.candidatos_alternativos && result.candidatos_alternativos.length > 0 && (
        <div className="mt-4 pt-4 border-t border-slate-800/80">
          <p className="text-[11px] uppercase font-mono tracking-wider text-slate-500 mb-2">
            Otros candidatos comparados en base de datos:
          </p>
          <div className="flex flex-wrap gap-2">
            {result.candidatos_alternativos.map((cand) => (
              <span
                key={cand.persona_id}
                className="bg-slate-800/60 border border-slate-700/60 text-slate-300 text-xs px-2.5 py-1 rounded-lg flex items-center gap-1.5"
              >
                <span>{cand.nombre}</span>
                <span className="text-slate-500 font-mono text-[11px]">
                  ({cand.similitud.toFixed(2)})
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
