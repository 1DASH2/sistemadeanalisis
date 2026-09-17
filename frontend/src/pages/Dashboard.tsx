import React, { useEffect, useState } from 'react';
import {
  Users,
  Scan,
  CheckCircle2,
  TrendingUp,
  Brain,
  Layers,
  Sparkles,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { apiService } from '../services/api';
import type { Persona, RecognitionLog } from '../types/facial';
import type { NavTab } from '../components/Navbar';

interface DashboardProps {
  onNavigate: (tab: NavTab) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [logs, setLogs] = useState<RecognitionLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [pData, lData] = await Promise.all([
          apiService.getPersonas(),
          apiService.getHistorial(),
        ]);
        setPersonas(pData);
        setLogs(lData);
      } catch (err) {
        console.error('Error cargando datos del dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const totalReconocimientos = logs.length;
  const coincidenciasExitosas = logs.filter((l) => l.coincide).length;
  const tasaAcierto = totalReconocimientos > 0 ? (coincidenciasExitosas / totalReconocimientos) * 100 : 0;
  const promedioProbabilidad =
    totalReconocimientos > 0
      ? (logs.reduce((acc, curr) => acc + curr.probabilidad_calibrada, 0) / totalReconocimientos) * 100
      : 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Banner de Bienvenida y Propuesta Tecnológica */}
      <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800/80 text-cyan-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            Arquitectura de Visión por Computadora & Calibración Estadística
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Sistema Inteligente de Reconocimiento Facial y Análisis de Probabilidades
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Plataforma interactiva que integra detección facial y extracción de embeddings con{' '}
            <strong className="text-cyan-400">Deep Learning</strong> (ArcFace / InsightFace) y estimación
            de probabilidades calibradas de coincidencia con{' '}
            <strong className="text-indigo-400">Machine Learning</strong> (scikit-learn).
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('reconocimiento')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold text-xs transition shadow-lg shadow-cyan-500/20"
            >
              <Scan className="w-4 h-4" /> Probar Reconocimiento
            </button>
            <button
              onClick={() => onNavigate('registro')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
            >
              <Users className="w-4 h-4" /> Registrar Persona
            </button>
          </div>
        </div>
      </div>

      {/* Tarjetas de Métricas Principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Personas Registradas</span>
            <span className="text-2xl font-bold text-white font-mono mt-1 block">
              {loading ? '--' : personas.length}
            </span>
            <span className="text-[11px] text-emerald-400 font-medium">
              {personas.filter((p) => p.activo).length} activas
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Reconocimientos Totales</span>
            <span className="text-2xl font-bold text-white font-mono mt-1 block">
              {loading ? '--' : totalReconocimientos}
            </span>
            <span className="text-[11px] text-slate-400">Verificados por umbral</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Scan className="w-6 h-6" />
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Tasa de Coincidencia</span>
            <span className="text-2xl font-bold text-emerald-400 font-mono mt-1 block">
              {loading ? '--' : `${tasaAcierto.toFixed(1)}%`}
            </span>
            <span className="text-[11px] text-slate-400">{coincidenciasExitosas} identidades validadas</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>

        {/* Card 4 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-400 font-medium block">Probabilidad ML Promedio</span>
            <span className="text-2xl font-bold text-cyan-300 font-mono mt-1 block">
              {loading ? '--' : `${promedioProbabilidad.toFixed(1)}%`}
            </span>
            <span className="text-[11px] text-indigo-400">Calibrada scikit-learn</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Comparativa Conceptual Clave (Sección 2 del PDF) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <h3 className="text-base font-bold text-slate-100 mb-1 flex items-center gap-2">
          <Layers className="w-5 h-5 text-cyan-400" />
          Diferenciación Conceptual: IA vs Machine Learning vs Deep Learning
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Cómo se articulan las tres tecnologías en este proyecto según las especificaciones técnicas:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-cyan-400 font-semibold text-xs">
              <Brain className="w-4 h-4" /> Inteligencia Artificial (IA)
            </div>
            <p className="text-xs text-slate-300">
              Campo general. Gobierna la orquestación del flujo, la toma de decisiones asistidas y la validación de reglas de acceso y seguridad biométrica.
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs">
              <TrendingUp className="w-4 h-4" /> Machine Learning (ML)
            </div>
            <p className="text-xs text-slate-300">
              Aprende de datos históricos de comparación. Transforma la similitud vectorial matemática en una <strong>probabilidad calibrada</strong> considerando iluminación y nitidez.
            </p>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs">
              <ShieldCheck className="w-4 h-4" /> Deep Learning (DL)
            </div>
            <p className="text-xs text-slate-300">
              Redes neuronales convolucionales profundas (ArcFace). Transforma la imagen de un rostro en un vector continuo (embedding de 512 dimensiones).
            </p>
          </div>
        </div>
      </div>

      {/* Actividad Reciente de Reconocimientos */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-100">Últimos Intentos de Reconocimiento</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Auditoría en tiempo real con similitud y probabilidad calibrada.
            </p>
          </div>
          <button
            onClick={() => onNavigate('historial')}
            className="flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 font-medium"
          >
            Ver historial completo <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Persona / Candidato</th>
                <th className="py-2.5 px-3">Similitud Coseno</th>
                <th className="py-2.5 px-3">Distancia</th>
                <th className="py-2.5 px-3">Probabilidad ML</th>
                <th className="py-2.5 px-3">Veredicto</th>
                <th className="py-2.5 px-3 text-right">Fecha / Hora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {logs.slice(0, 5).map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-2.5 px-3 font-medium text-slate-200">
                    {log.persona_nombre || 'Desconocido'}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-cyan-400 font-semibold">
                    {log.similitud.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-slate-400">
                    {log.distancia.toFixed(2)}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-emerald-400 font-semibold">
                    {(log.probabilidad_calibrada * 100).toFixed(0)}%
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold font-mono ${
                        log.coincide
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/80'
                          : 'bg-rose-950 text-rose-400 border border-rose-800/80'
                      }`}
                    >
                      {log.coincide ? 'COINCIDE' : 'RECHAZADO'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right text-slate-500 font-mono">
                    {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
