import axios from 'axios';
import type { Persona, RecognitionResult, RecognitionLog, MLMetrics } from '../types/facial';
import { INITIAL_PERSONAS, INITIAL_LOGS, MOCK_ML_METRICS } from './mockData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Claves para persistencia local de demostración
const STORAGE_KEYS = {
  PERSONAS: 'facial_personas_db',
  LOGS: 'facial_recognition_logs',
  METRICS: 'facial_ml_metrics',
  USE_MOCK: 'facial_use_mock_api',
};

// Inicialización de LocalStorage si está vacío
function getStoredPersonas(): Persona[] {
  const data = localStorage.getItem(STORAGE_KEYS.PERSONAS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.PERSONAS, JSON.stringify(INITIAL_PERSONAS));
    return INITIAL_PERSONAS;
  }
  return JSON.parse(data);
}

function getStoredLogs(): RecognitionLog[] {
  const data = localStorage.getItem(STORAGE_KEYS.LOGS);
  if (!data) {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(INITIAL_LOGS));
    return INITIAL_LOGS;
  }
  return JSON.parse(data);
}

export const isMockMode = (): boolean => {
  const setting = localStorage.getItem(STORAGE_KEYS.USE_MOCK);
  return setting === null ? true : setting === 'true';
};

export const setMockMode = (enabled: boolean) => {
  localStorage.setItem(STORAGE_KEYS.USE_MOCK, String(enabled));
};

export const apiService = {
  // 1. Obtener lista de personas
  async getPersonas(): Promise<Persona[]> {
    if (isMockMode()) {
      return getStoredPersonas();
    }
    try {
      const res = await client.get<Persona[]>('/api/personas');
      return res.data;
    } catch {
      return getStoredPersonas();
    }
  },

  // 2. Registrar persona
  async createPersona(data: { nombre: string; email: string; foto_base64?: string }): Promise<Persona> {
    if (isMockMode()) {
      const current = getStoredPersonas();
      const newPersona: Persona = {
        id: current.length > 0 ? Math.max(...current.map(p => p.id)) + 1 : 1,
        nombre: data.nombre,
        email: data.email,
        activo: true,
        foto_url: data.foto_base64 || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        created_at: new Date().toISOString(),
        total_embeddings: 1,
      };
      const updated = [newPersona, ...current];
      localStorage.setItem(STORAGE_KEYS.PERSONAS, JSON.stringify(updated));
      return newPersona;
    }

    const res = await client.post<Persona>('/api/personas', data);
    return res.data;
  },

  // 3. Reconocimiento de rostro
  async recognizeFace(imageBase64: string, umbral: number = 0.75): Promise<RecognitionResult> {
    if (isMockMode()) {
      // Simulación de procesamiento de visión artificial y machine learning
      await new Promise(r => setTimeout(r, 600)); // Latencia realista
      const personas = getStoredPersonas().filter(p => p.activo);
      
      // Simular coincidencia con una persona aleatoria o un desconocido
      const shouldMatch = personas.length > 0 && Math.random() > 0.25;
      const matchedPersona = shouldMatch ? personas[Math.floor(Math.random() * personas.length)] : null;

      const similitud = matchedPersona ? +(0.76 + Math.random() * 0.22).toFixed(2) : +(0.42 + Math.random() * 0.25).toFixed(2);
      const distancia = +(1.0 - similitud).toFixed(2);
      const coincide = similitud >= umbral;
      
      // Cálculo de probabilidad calibrada mediante curva logística simulada
      // P = 1 / (1 + exp(-12 * (similitud - 0.70)))
      const rawProb = 1 / (1 + Math.exp(-12 * (similitud - 0.70)));
      const probabilidad_calibrada = +Math.min(0.99, Math.max(0.01, rawProb)).toFixed(2);

      const result: RecognitionResult = {
        persona_id: coincide && matchedPersona ? matchedPersona.id : null,
        nombre: coincide && matchedPersona ? matchedPersona.nombre : 'No identificado',
        similitud,
        distancia,
        umbral,
        coincide,
        probabilidad_calibrada,
        calidad_imagen: similitud > 0.85 ? 'Alta' : similitud > 0.65 ? 'Buena' : 'Media',
        iluminacion: Math.random() > 0.3 ? 'Alta' : 'Media',
        tiempo_ms: Math.floor(80 + Math.random() * 50),
        candidatos_alternativos: personas.slice(0, 3).map(p => ({
          persona_id: p.id,
          nombre: p.nombre,
          similitud: +(similitud * (0.6 + Math.random() * 0.3)).toFixed(2),
        }))
      };

      // Guardar en el log local
      const logs = getStoredLogs();
      const newLog: RecognitionLog = {
        id: Date.now(),
        persona_id: result.persona_id,
        persona_nombre: result.nombre,
        similitud: result.similitud,
        distancia: result.distancia,
        umbral: result.umbral,
        coincide: result.coincide,
        probabilidad_calibrada: result.probabilidad_calibrada,
        calidad_imagen: result.calidad_imagen,
        iluminacion: result.iluminacion,
        created_at: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify([newLog, ...logs]));

      return result;
    }

    const res = await client.post<{ success: boolean; resultado: RecognitionResult }>('/api/reconocimiento', {
      imagen_base64: imageBase64,
      umbral,
    });
    return res.data.resultado;
  },

  // 4. Historial de reconocimientos
  async getHistorial(): Promise<RecognitionLog[]> {
    if (isMockMode()) {
      return getStoredLogs();
    }
    try {
      const res = await client.get<RecognitionLog[]>('/api/reconocimiento/historial');
      return res.data;
    } catch {
      return getStoredLogs();
    }
  },

  // 5. Métricas del Modelo de ML
  async getMetrics(): Promise<MLMetrics> {
    if (isMockMode()) {
      return MOCK_ML_METRICS;
    }
    try {
      const res = await client.get<MLMetrics>('/api/modelos/metricas');
      return res.data;
    } catch {
      return MOCK_ML_METRICS;
    }
  },

  // 6. Reentrenar modelo de Machine Learning
  async trainModel(modeloTipo: string): Promise<{ success: boolean; metrics: MLMetrics }> {
    if (isMockMode()) {
      await new Promise(r => setTimeout(r, 1200));
      return {
        success: true,
        metrics: {
          ...MOCK_ML_METRICS,
          modelo_tipo: modeloTipo as MLMetrics['modelo_tipo'],
          accuracy: +(0.95 + Math.random() * 0.03).toFixed(3),
          f1_score: +(0.94 + Math.random() * 0.04).toFixed(3),
        }
      };
    }
    const res = await client.post<{ success: boolean; metrics: MLMetrics }>('/api/modelos/entrenar', {
      modelo_tipo: modeloTipo,
    });
    return res.data;
  },

  // 7. Simular cálculo de calibración de probabilidades
  calculateCalibratedProbability(similitud: number, calidad: string, iluminacion: string): number {
    let factor = 0;
    if (calidad === 'Alta') factor += 0.04;
    else if (calidad === 'Baja') factor -= 0.06;

    if (iluminacion === 'Alta') factor += 0.03;
    else if (iluminacion === 'Baja') factor -= 0.05;

    const z = 14 * (similitud - 0.72) + factor;
    const prob = 1 / (1 + Math.exp(-z));
    return +Math.min(0.99, Math.max(0.01, prob)).toFixed(2);
  }
};
