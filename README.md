# MiVideoteca API

API REST para gestionar una videoteca personal. Proyecto de referencia para el curso de Integración Continua con GitHub.

## 🗄️ Base de Datos

### Desarrollo (Local)
Este proyecto usa **SQLite** para desarrollo local:
- ✅ Fácil de configurar (no requiere instalación de servidor)
- ✅ Perfecto para aprender y prototipar
- ✅ Base de datos en archivo: `prisma/dev.db`
- ✅ Funciona sin internet

### Producción (Despliegue - Unidad 5)
En la Unidad 5 del curso migraremos a **PostgreSQL** en Neon:
- Base de datos robusta y escalable
- Alojada en la nube
- Ideal para aplicaciones en producción

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone <url-del-repo>
cd mivideoteca-api
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
```bash
# Copiar el archivo de ejemplo
cp .env.example .env

# El .env ya está configurado para SQLite, no necesitas cambiar nada
# Solo asegúrate de cambiar JWT_SECRET si vas a usar en producción
```

### 4. Crear la base de datos
```bash
# Esto crea el archivo dev.db y aplica las migraciones
npm run prisma:migrate
```

### 5. (Opcional) Explorar la base de datos
```bash
# Abre Prisma Studio en http://localhost:5555
npm run prisma:studio
```

### 6. Iniciar el servidor
```bash
# Modo desarrollo (con auto-reload)
npm run dev

# Modo producción
npm start
```

El servidor estará disponible en `http://localhost:3000`

## 🧪 Testing

```bash
# Ejecutar todos los tests una vez
npm test

# Ejecutar tests en modo watch (re-ejecuta al guardar cambios)
npm run test:watch

# Ejecutar tests con reporte de cobertura
npm run test:coverage
```

### ¿Los tests usan la base de datos?

**NO.** Los tests usan **mocks** (impostores) de Prisma.

Esto significa:
- Los tests **no conectan** a `dev.db`
- Los tests **no modifican** datos reales
- Los tests son **ultrarrápidos** (sin I/O de disco)
- El `DATABASE_URL` **no se usa** durante `npm test`

## 📋 Scripts Disponibles

| Script | Comando | Descripción |
|--------|---------|-------------|
| `npm run dev` | nodemon server.js | Servidor con auto-reload |
| `npm start` | node server.js | Servidor modo producción |
| `npm test` | jest | Ejecutar tests |
| `npm run test:watch` | jest --watchAll | Tests en modo watch |
| `npm run test:coverage` | jest --coverage | Tests con cobertura |
| `npm run prisma:migrate` | prisma migrate dev | Crear/aplicar migraciones |
| `npm run prisma:generate` | prisma generate | Regenerar cliente Prisma |
| `npm run prisma:studio` | prisma studio | GUI de base de datos |
| `npm run prisma:reset` | prisma migrate reset | Resetear BD (⚠️ borra datos) |

## 🛠️ Stack Tecnológico

- **Node.js** - Entorno de ejecución JavaScript
- **Express 5** - Framework web minimalista
- **Prisma** - ORM moderno para bases de datos
- **SQLite** - Base de datos local (desarrollo)
- **JWT** - Autenticación stateless
- **bcryptjs** - Hash de contraseñas
- **Jest** - Framework de testing
- **Supertest** - Testing de APIs HTTP

## 📁 Estructura del Proyecto

```
mivideoteca-api/
├── controllers/          # Lógica de negocio
│   ├── authController.js
│   └── movieController.js
├── routes/              # Definición de endpoints
│   ├── authRoutes.js
│   └── movieRoutes.js
├── middleware/          # Funciones intermedias (auth, etc.)
│   └── authMiddleware.js
├── prisma/             # Configuración de base de datos
│   ├── schema.prisma   # Esquema de datos
│   ├── dev.db         # Base de datos SQLite (generado)
│   └── migrations/    # Historial de cambios en BD
├── __tests__/         # Tests automatizados
│   └── auth.test.js
├── server.js          # Punto de entrada de la aplicación
├── package.json       # Dependencias y scripts
└── .env              # Variables de entorno (no subir a Git)
```

## 🔐 Endpoints de la API

### Autenticación

#### Registro
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "tucontraseña"
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "usuario@example.com",
  "password": "tucontraseña"
}
```

### Películas (requieren autenticación)

Todas las rutas de películas requieren el header:
```
Authorization: Bearer <tu-token-jwt>
```

#### Listar películas del usuario
```http
GET /api/movies
```

#### Obtener una película
```http
GET /api/movies/:id
```

#### Crear película
```http
POST /api/movies
Content-Type: application/json

{
  "title": "Inception",
  "director": "Christopher Nolan",
  "year": 2010,
  "posterUrl": "https://..."
}
```

#### Actualizar película
```http
PUT /api/movies/:id
Content-Type: application/json

{
  "title": "Inception (Updated)",
  "director": "Christopher Nolan",
  "year": 2010
}
```

#### Eliminar película
```http
DELETE /api/movies/:id
```

## 🎓 Para Estudiantes (Unidad 3)

Este proyecto es el punto de partida para la **Unidad 3: El Backend y su Red de Seguridad (Testing)**.

### ¿Qué vas a hacer en esta unidad?

#### **Parte 1: Entender el Código Heredado**
Recibes esta API **ya funcionando**. Tu primer objetivo es:
- 📖 Entender cómo está estructurada (tour en videos)
- 🧪 Ejecutar y entender los tests
- 🎨 Explorar los datos con Prisma Studio
- 🔍 Probar los endpoints con Thunder Client

#### **Parte 2: Añadir Feature 'Favoritos' (Guiado)**
En los videos verás cómo:
- Modificar el schema de Prisma (añadir campo `isFavorite`)
- Actualizar el controller de películas
- Crear/actualizar tests
- Usar IA para ayudarte en el proceso

#### **Parte 3: Añadir Feature 'Rating' (Tu Turno)**
Aplicando lo aprendido, tú añadirás:
- Campo `rating` (número del 1 al 5)
- Endpoint para modificar el rating de una película
- Tests para validar la funcionalidad

### Setup Inicial

```bash
# 1. Clonar el repositorio
git clone <url-del-repo>
cd mivideoteca-api

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env

# 4. Crear base de datos y aplicar migraciones
npm run prisma:migrate

# 5. Verificar que funciona
npm test          # Tests deben pasar
npm run dev       # Servidor en puerto 3000
```

## 🐛 Debugging

### Ver los datos de la base de datos
```bash
npm run prisma:studio
```

### Resetear la base de datos (⚠️ BORRA TODOS LOS DATOS)
```bash
npm run prisma:reset
```

### Si los tests fallan
1. Verifica que el archivo `.env` existe
2. Ejecuta `npm run prisma:generate`
3. Limpia la cache: `npm test -- --clearCache`

## 📚 Recursos Útiles

- [Documentación de Prisma](https://www.prisma.io/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [JWT Introduction](https://jwt.io/introduction)
- [Jest Documentation](https://jestjs.io/docs/getting-started)

## 📝 Licencia

ISC