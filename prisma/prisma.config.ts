import path from 'node:path'
import { defineConfig } from 'prisma/config'

// Cargar variables de entorno
import 'dotenv/config'

export default defineConfig({
  earlyAccess: true,
  schema: path.join(__dirname, 'schema.prisma'),

  // Configuración de Migrate para desarrollo
  migrate: {
    async development() {
      return {
        url: process.env.DATABASE_URL!
      }
    }
  }
})
