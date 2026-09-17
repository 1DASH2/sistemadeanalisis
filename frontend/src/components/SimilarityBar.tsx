import React from 'react';

interface SimilarityBarProps {
  similitud: number;
  umbral?: number;
  label?: string;
  showDetails?: boolean;
}

export const SimilarityBar: React.FC<SimilarityBarProps> = ({
  similitud,
  umbral = 0.75,
  label = "Similitud Coseno",
  showDetails = true,
}) => {
  // Asegurar rango [0, 1]
  const clamped = Math.max(0, Math.min(1, similitud));
  const percent = Math.round(clamped * 100);
  const umbralPercent = Math.round(umbral * 100);
  const isMatch = clamped >= umbral;
  const isNear = !isMatch && clamped >= (umbral - 0.1);

  const getBarColor = () => {
    if (isMatch) return 'from-emerald-500 to-teal-400';
    if (isNear) return 'from-amber-500 to-yellow-400';
    return 'from-rose-500 to-red-400';
  };

  const getTextColor = () => {
    if (isMatch) return 'text-emerald-400';
    if (isNear) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <div className="w-full space-y-1.5 font-sans">
      <div className="flex justify-between items-center text-xs">
        <span className="text-slate-400 font-medium">{label}</span>
        <div className="flex items-center gap-2 font-mono">
          <span className={`font-bold text-sm ${getTextColor()}`}>
            {clamped.toFixed(2)}
          </span>
          <span className="text-slate-500 text-[11px]">({percent}%)</span>
        </div>
      </div>

      {/* Barra de progreso con marcador de umbral */}
      <div className="relative w-full h-3 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60 shadow-inner">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${getBarColor()} transition-all duration-700 ease-out shadow-sm`}
          style={{ width: `${percent}%` }}
        />
        {/* Línea vertical indicadora del Umbral */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none z-10"
          style={{ left: `${umbralPercent}%` }}
          title={`Umbral: ${umbral}`}
        />
      </div>

      {showDetails && (
        <div className="flex justify-between text-[11px] text-slate-500">
          <span>0.00 (Separados)</span>
          <span className="text-slate-400 font-mono">
            Umbral: <strong className="text-slate-200">{umbral.toFixed(2)}</strong>
          </span>
          <span>1.00 (Idénticos)</span>
        </div>
      )}
    </div>
  );
};
