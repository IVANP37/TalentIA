import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react'; // Asegúrate de importar @vitejs/plugin-react si lo usas

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      // Esta es la línea clave que debes añadir o asegurar que esté presente
      base: '/', // <--- ¡AÑADE O MODIFICA ESTA LÍNEA!

      plugins: [
        react(), // Asegúrate de que este plugin esté aquí si tu app es React
        // Añade aquí cualquier otro plugin que ya tengas
      ],
      define: {
        // Es una buena práctica usar VITE_ prefijo para variables de entorno del lado del cliente en Vite
        // Si ya te funciona con process.env, puedes mantenerlo, pero considera cambiar a import.meta.env.VITE_...
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        // Asegúrate de que la salida sea 'dist' (valor por defecto de Vite)
        outDir: 'dist',
        // Puedes añadir otras configuraciones de build aquí si las tenías
      },
      // Puedes añadir otras configuraciones de Vite aquí si las tenías
    };
});
