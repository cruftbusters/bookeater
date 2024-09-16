/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { configDefaults } from 'vitest/config'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // https://vitest.dev/config/
  test: {
    exclude: [...configDefaults.exclude, 'e2e'],
  },
})
