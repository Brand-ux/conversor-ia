"use client";
import { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';

export default function Home() {
  const [modelo, setModelo] = useState(null);
  const [celsius, setCelsius] = useState('');
  const [resultado, setResultado] = useState(null);
  const [estadoCarga, setEstadoCarga] = useState('Cargando IA...');

  // 1. Cargar el modelo al iniciar la página
  useEffect(() => {
    async function cargarModelo() {
      try {
        // La ruta es relativa a la carpeta 'public'
        // Asegúrate de que 'model.json' esté en public/model/
        const m = await tf.loadLayersModel('/model/model.json');
        setModelo(m);
        setEstadoCarga('IA Lista para usar 🚀');
        console.log("Modelo cargado correctamente");
      } catch (error) {
        console.error(error);
        setEstadoCarga('Error al cargar la IA');
      }
    }
    cargarModelo();
  }, []);

  // 2. Función para convertir
  const convertir = async () => {
    if (modelo && celsius !== '') {
      // a. Convertir entrada a Tensor 2D [1, 1]
      const inputTensor = tf.tensor2d([parseFloat(celsius)], [1, 1]);
      
      // b. Realizar la predicción
      const prediccionTensor = modelo.predict(inputTensor);
      
      // c. Obtener el valor del tensor (data() devuelve una promesa)
      const valores = await prediccionTensor.data();
      
      // d. Actualizar estado y limpiar memoria de tensores
      setResultado(valores[0].toFixed(2));
      inputTensor.dispose();
      prediccionTensor.dispose();
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-4">
      <h1 className="text-4xl font-bold mb-2 text-blue-400">Conversor Neuronal</h1>
      <p className="text-sm text-gray-400 mb-8">Modelo de Deep Learning corriendo en tu navegador</p>

      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
        
        {/* Indicador de Estado */}
        <div className={`text-center mb-6 text-sm font-semibold ${modelo ? 'text-green-400' : 'text-yellow-400'}`}>
          {estadoCarga}
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2">Grados Celsius</label>
            <input 
              type="number" 
              value={celsius}
              onChange={(e) => setCelsius(e.target.value)}
              placeholder="Ingresa valor..."
              className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button 
            onClick={convertir}
            disabled={!modelo}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 rounded transition-all"
          >
            Convertir a Fahrenheit
          </button>

          {resultado && (
            <div className="mt-6 text-center p-4 bg-gray-700 rounded-lg animate-pulse">
              <p className="text-gray-400 text-xs uppercase tracking-wider">Predicción de la IA</p>
              <p className="text-5xl font-bold text-white mt-2">{resultado} °F</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}