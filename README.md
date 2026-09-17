# Sistema Inteligente de Reconocimiento Facial y Análisis de Probabilidades

Este proyecto implementa una solución completa que combina **Visión por Computadora (Deep Learning)** con **Calibración Estadística (Machine Learning)** para el registro y reconocimiento de personas.

## 🏛️ Arquitectura del Sistema

```
Sistema de analisis de probabilidaes/
├── frontend/                     # Aplicación Web (React + TypeScript + Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/
│   │   │   ├── CameraCapture.tsx    # Captura vía Webcam y subida de archivos con guía facial
│   │   │   ├── FaceResultCard.tsx   # Tarjeta de veredicto biométrico y detalles
│   │   │   ├── SimilarityBar.tsx    # Medidor de similitud coseno con umbral interactivo
│   │   │   ├── ProbabilityChart.tsx # Gráfica Recharts de calibración Similitud vs Probabilidad ML
│   │   │   └── Navbar.tsx           # Navegación y conmutador Demo Mock / FastAPI
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx        # Resumen de KPIs y pilares IA / ML / DL
│   │   │   ├── RegistroFacial.tsx   # Registro de identidades y captura de rostro
│   │   │   ├── Reconocimiento.tsx   # Escaneo en tiempo real y ajuste de umbral
│   │   │   ├── Probabilidades.tsx   # Laboratorio ML, simulador y matriz de confusión
│   │   │   └── Historial.tsx        # Auditoría de intentos de acceso con filtros
│   │   ├── services/
│   │   │   ├── api.ts               # Cliente REST y fallback Mock con LocalStorage
│   │   │   └── mockData.ts          # Dataset inicial de pruebas y calibración
│   │   ├── types/
│   │   │   └── facial.ts            # Interfaces TypeScript
│   │   ├── App.tsx                  # Enrutamiento de vistas y layout principal
│   │   └── main.tsx                 # Montaje de React
│   └── package.json
└── README.md
```

## 🚀 Inicio Rápido (Frontend)

1. Ingresar al directorio `frontend`:
   ```bash
   cd frontend
   ```

2. Instalar dependencias (si no se han instalado):
   ```bash
   npm install
   ```

3. Iniciar el servidor de desarrollo Vite:
   ```bash
   npm run dev
   ```

4. Compilar para producción:
   ```bash
   npm run build
   ```

## 🧠 Modo Demo Integrado

El frontend incluye un **Modo Demo (Mock API)** que permite probar y exponer la aplicación inmediatamente con persistencia en `localStorage`, incluso sin encender el servidor backend de Python. Puedes alternar entre el modo Demo y el modo API en la barra superior (Navbar).
