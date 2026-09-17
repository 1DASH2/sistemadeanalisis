import React, { useState, useEffect } from 'react';
import { apiService } from '../services/api';
import type { RecognitionLog } from '../types/facial';
import { History, Search, Filter, CheckCircle, XCircle } from 'lucide-react';

export const Historial: React.FC = () => {
  const [logs, setLogs] = useState<RecognitionLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<RecognitionLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterVerdict, setFilterVerdict] = useState<'all' | 'match' | 'reject'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await apiService.getHistorial();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...logs];
    if (searchTerm.trim()) {
      result = result.filter((l) =>
        (l.persona_nombre || 'Desconocido').toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterVerdict === 'match') {
      result = result.filter((l) => l.coincide);
    } else if (filterVerdict === 'reject') {
      result = result.filter((l) => !l.coincide);
    }
    setFilteredLogs(result);
  }, [logs, searchTerm, filterVerdict]);

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <History className="w-5 h-5 text-cyan-400" />
          Historial y Auditoría de Reconocimientos
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Registro inmutable de todas las verificaciones biométricas, distancias vectoriales y probabilidades de acierto.
        </p>
      </div>

      {/* Barra de Filtros y Búsqueda */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nombre de persona..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-750 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-xs text-slate-400 mr-1">Filtrar:</span>
          {(['all', 'match', 'reject'] as const).map((filter) => (
            <button
              key={filter}
              onClick={() => setFilterVerdict(filter)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                filterVerdict === filter
                  ? 'bg-slate-800 text-cyan-300 border border-slate-700'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {filter === 'all' && 'Todos'}
              {filter === 'match' && 'Coincidencias'}
              {filter === 'reject' && 'Rechazados'}
            </button>
          ))}
        </div>
      </div>

      {/* Tabla de Registros */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Identidad Detectada</th>
                <th className="py-3 px-4">Similitud Coseno</th>
                <th className="py-3 px-4">Distancia</th>
                <th className="py-3 px-4">Umbral</th>
                <th className="py-3 px-4">Probabilidad ML</th>
                <th className="py-3 px-4">Calidad / Luz</th>
                <th className="py-3 px-4">Veredicto</th>
                <th className="py-3 px-4 text-right">Fecha y Hora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500 text-xs">
                    Cargando historial biométrico...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-500 text-xs">
                    No se encontraron registros de reconocimiento con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono text-slate-500 text-[11px]">
                      #{log.id}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-200">
                      {log.persona_nombre || 'No identificado'}
                    </td>
                    <td className="py-3 px-4 font-mono text-cyan-400 font-bold">
                      {log.similitud.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {log.distancia.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {log.umbral.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 font-mono text-emerald-400 font-bold">
                      {(log.probabilidad_calibrada * 100).toFixed(0)}%
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-[11px]">
                      {log.calidad_imagen || 'Media'} / {log.iluminacion || 'Media'}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-semibold font-mono ${
                          log.coincide
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : 'bg-rose-950 text-rose-400 border border-rose-800'
                        }`}
                      >
                        {log.coincide ? (
                          <>
                            <CheckCircle className="w-3 h-3" /> COINCIDE
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" /> RECHAZADO
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-slate-500 font-mono text-[11px]">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
