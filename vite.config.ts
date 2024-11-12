import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom', // Устанавливаем jsdom для поддержки localStorage и других браузерных API
    setupFiles: './src/setupTests.ts', // Опционально: файл для дополнительной настройки тестов, если он вам нужен
  },
});
