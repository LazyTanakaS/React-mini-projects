import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/React-mini-projects/todo-list-app/', // ← добавь эту строку
})
