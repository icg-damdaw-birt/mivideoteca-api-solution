# 🎬 MiVideoteca API

API REST para gestionar una videoteca personal. Proyecto de referencia para el curso de Integración Continua con GitHub.

## 📋 Requisitos

- **Node.js** 20+
- **npm** 10+

## 🛠️ Stack Tecnológico

| Tecnología | Versión | Descripción |
|------------|---------|-------------|
| Node.js | 20+ | Entorno de ejecución |
| Express | 5.x | Framework web con async handlers nativos |
| Prisma | 7.x | ORM moderno (config en `prisma.config.ts`) |
| SQLite | - | Base de datos de desarrollo |
| PostgreSQL | - | Base de datos de producción (UD5) |
| Jest | 29.x | Framework de testing |
| Supertest | - | Testing de APIs HTTP |
| JWT | - | Autenticación stateless |
| bcryptjs | - | Hash de contraseñas |

## 🗄️ Base de Datos

### **UD3: Desarrollo Local (SQLite)**
Este proyecto usa **SQLite** para desarrollo local:
- ✅ Fácil de configurar (no requiere instalación de servidor)
- ✅ Perfecto para aprender y prototipar
- ✅ Base de datos en archivo: `prisma/dev.db`
- ✅ Funciona sin internet

### **UD5: Producción (PostgreSQL en Neon)**
En la Unidad 5 migraremos a **PostgreSQL** en Neon:
- Base de datos robusta y escalable
- Alojada en la nube
- Ideal para aplicaciones en producción

## 🚀 Instalación y Configuración

### 1. Clonar el repositorio
```bash
git clone https://github.com/icg-damdaw-birt/mivideoteca-api.git
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

# El .env ya está configurado para SQLite:
DATABASE_URL="file:./dev.db"
JWT_SECRET="tu-secreto-super-seguro-cambialo-en-produccion"
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

---

## 🧪 Testing

```bash
# Ejecutar todos los tests una vez
npm test

# Ejecutar tests en modo watch (re-ejecuta al guardar cambios)
npm run test:watch
```

### ¿Los tests usan la base de datos?

**NO.** Los tests usan **mocks** (impostores) de Prisma.

Esto significa:
- Los tests **no conectan** a `dev.db`
- Los tests **no modifican** datos reales
- Los tests son **ultrarrápidos** (sin I/O de disco)
- El `DATABASE_URL` **no se usa** durante `npm test`

### Estado de tests
```bash
npm test

# ✅ auth.test.js      - Registro y login
# ✅ movie.test.js     - CRUD de películas
# ✅ favorite.test.js  - Toggle de favoritos
# ✅ rating.test.js    - Sistema de puntuación
```

---

## 📋 Scripts Disponibles

| Script | Comando | Descripción |
|--------|---------|-------------|
| `npm run dev` | nodemon server.js | Servidor con auto-reload |
| `npm start` | node server.js | Servidor modo producción |
| `npm test` | jest --verbose | Ejecutar tests |
| `npm run test:watch` | jest --watchAll --verbose | Tests en modo watch |
| `npm run prisma:migrate` | prisma migrate dev | Crear/aplicar migraciones |
| `npm run prisma:generate` | prisma generate | Regenerar cliente Prisma |
| `npm run prisma:studio` | prisma studio | GUI de base de datos |
| `npm run prisma:reset` | prisma migrate reset | Resetear BD (⚠️ borra datos) |

---

## 📁 Estructura del Proyecto

```
mivideoteca-api/
├── controllers/          # Lógica de negocio
│   ├── authController.js     # Registro y login
│   └── movieController.js    # CRUD + favoritos + rating
├── routes/              # Definición de endpoints
│   ├── authRoutes.js
│   └── movieRoutes.js
├── middleware/          # Funciones intermedias
│   └── authMiddleware.js
├── lib/                 # Utilidades compartidas
│   └── prisma.js        # Cliente Prisma configurado
├── prisma/              # Configuración de base de datos
│   ├── schema.prisma    # Esquema de datos
│   ├── dev.db           # SQLite (generado tras migrate)
│   └── migrations/      # Historial de cambios en BD
├── __tests__/           # Tests automatizados
│   ├── auth.test.js     # Tests de autenticación
│   ├── movie.test.js    # Tests CRUD películas
│   ├── favorite.test.js # Tests de favoritos
│   └── rating.test.js   # Tests de rating
├── prisma.config.ts     # Configuración Prisma 7
├── AGENTS.md            # Guía para agentes de IA
├── server.js            # Punto de entrada
├── package.json         # Dependencias y scripts
└── .env                 # Variables de entorno (local)
```

---

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
POST /api/auth/login
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
  "posterUrl": "https://image.tmdb.org/t/p/w500/..."
}
```

#### Actualizar película
```http
PUT /api/movies/:id
Content-Type: application/json

{
  "title": "Inception (Director's Cut)",
  "director": "Christopher Nolan",
  "year": 2010,
  "posterUrl": "https://image.tmdb.org/t/p/w500/..."
}
```

#### Eliminar película
```http
DELETE /api/movies/:id
```

#### Toggle favorito
```http
PATCH /api/movies/:id/favorite
```
Respuesta: película actualizada con `isFavorite` invertido.

#### Actualizar rating
```http
PATCH /api/movies/:id/rating
Content-Type: application/json

{
  "rating": 4
}
```
Validación: rating debe ser entre 0 y 5 (0 = sin valorar).

---

## 🏷️ Versiones (Tags)

Este repositorio tiene tags para acceder a versiones específicas:

| Tag | Descripción | URL |
|-----|-------------|-----|
| `v1-favoritos` | CRUD + sistema de favoritos | [ver código](https://github.com/icg-damdaw-birt/mivideoteca-api-solution/tree/v1-favoritos) |
| `v2-rating` | + sistema de rating (0-5) | [ver código](https://github.com/icg-damdaw-birt/mivideoteca-api-solution/tree/v2-rating) |

Para clonar una versión específica:
```bash
git clone --branch v1-favoritos https://github.com/icg-damdaw-birt/mivideoteca-api-solution.git
```

---

## 🎓 Para Estudiantes

### **UD3: El Backend y su Red de Seguridad (Testing)**

#### Contenido del video:
- Implementación de **Favoritos** (`isFavorite` + `toggleFavorite`)
- Creación de tests con Jest y mocks de Prisma

#### Tu ejercicio:
Implementar **Rating** (calificación 0-5):
- Modificar schema (campo `rating Int @default(0)`)
- Endpoint: `PATCH /api/movies/:id/rating`
- Validación: rating entre 0 y 5
- Crear `rating.test.js` con tests

---

### **UD4: Frontend (Flutter o SvelteKit)**
- **DAM**: Flutter obligatorio, Svelte opcional
- **DAW**: Svelte obligatorio, Flutter opcional

Consumirás esta API desde tu frontend.

---

### **UD5: Deploy en Producción**
Migración a PostgreSQL en Neon y deploy en Render/Vercel.

---

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

---

## 📚 Recursos Útiles

- [Documentación de Prisma 7](https://www.prisma.io/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [JWT Introduction](https://jwt.io/introduction)
- [Jest Documentation](https://jestjs.io/docs/getting-started)

---

## 📝 Licencia

Este proyecto es material educativo.