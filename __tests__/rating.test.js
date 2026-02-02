/**
 * TESTS DE RATING
 * 
 * Testea el endpoint PATCH /api/movies/:id/rating
 * que actualiza la valoración (0-5)
 */

const request = require('supertest');
const jwt = require('jsonwebtoken');

// Mock de Prisma
const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
  },
  movie: {
    findFirst: jest.fn(),
    update: jest.fn(),
  },
};

jest.mock('../lib/prisma', () => mockPrisma);

const app = require('../server');
const prisma = require('../lib/prisma');

describe('API de Rating', () => {
  const userId = 'user-123';
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('PATCH /api/movies/:id/rating', () => {
    
    it('debería actualizar el rating correctamente', async () => {
      // ARRANGE
      const movieId = 'movie-123';
      const movieMock = {
        id: movieId,
        title: 'Inception',
        director: 'Christopher Nolan',
        year: 2010,
        rating: 0,
        ownerId: userId,
      };

      prisma.movie.findFirst.mockResolvedValue(movieMock);
      prisma.movie.update.mockResolvedValue({ ...movieMock, rating: 4 });

      // ACT
      const response = await request(app)
        .patch(`/api/movies/${movieId}/rating`)
        .set('Authorization', `Bearer ${token}`)
        .send({ rating: 4 });

      // ASSERT
      expect(response.status).toBe(200);
      expect(response.body.rating).toBe(4);
      expect(prisma.movie.update).toHaveBeenCalledWith({
        where: { id: movieId },
        data: { rating: 4 },
      });
    });

    it('debería aceptar rating 0 (quitar valoración)', async () => {
      // ARRANGE
      const movieId = 'movie-123';
      const movieMock = { id: movieId, rating: 5, ownerId: userId };

      prisma.movie.findFirst.mockResolvedValue(movieMock);
      prisma.movie.update.mockResolvedValue({ ...movieMock, rating: 0 });

      // ACT
      const response = await request(app)
        .patch(`/api/movies/${movieId}/rating`)
        .set('Authorization', `Bearer ${token}`)
        .send({ rating: 0 });

      // ASSERT
      expect(response.status).toBe(200);
      expect(response.body.rating).toBe(0);
    });

    it('debería rechazar rating mayor que 5', async () => {
      // ACT
      const response = await request(app)
        .patch('/api/movies/movie-123/rating')
        .set('Authorization', `Bearer ${token}`)
        .send({ rating: 6 });

      // ASSERT
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('El rating debe ser un número entre 0 y 5');
    });

    it('debería rechazar rating negativo', async () => {
      // ACT
      const response = await request(app)
        .patch('/api/movies/movie-123/rating')
        .set('Authorization', `Bearer ${token}`)
        .send({ rating: -1 });

      // ASSERT
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('El rating debe ser un número entre 0 y 5');
    });

    it('debería rechazar petición sin rating en el body', async () => {
      // ACT
      const response = await request(app)
        .patch('/api/movies/movie-123/rating')
        .set('Authorization', `Bearer ${token}`)
        .send({});  // Body vacío

      // ASSERT
      expect(response.status).toBe(400);
      expect(response.body.error).toBe('El rating debe ser un número entre 0 y 5');
    });

    it('debería devolver 404 si la película no existe', async () => {
      // ARRANGE
      prisma.movie.findFirst.mockResolvedValue(null);

      // ACT
      const response = await request(app)
        .patch('/api/movies/no-existe/rating')
        .set('Authorization', `Bearer ${token}`)
        .send({ rating: 3 });

      // ASSERT
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Película no encontrada');
    });

    it('debería devolver 401 sin token de autenticación', async () => {
      // ACT
      const response = await request(app)
        .patch('/api/movies/movie-123/rating')
        .send({ rating: 4 });

      // ASSERT
      expect(response.status).toBe(401);
    });
  });
});
