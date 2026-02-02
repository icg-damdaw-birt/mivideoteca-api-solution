/**
 * TESTS DE FAVORITOS
 * 
 * Testea el endpoint PATCH /api/movies/:id/favorite
 * que hace toggle del campo isFavorite
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

describe('API de Favoritos', () => {
  // Token válido para las pruebas
  const userId = 'user-123';
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('PATCH /api/movies/:id/favorite', () => {
    
    it('debería marcar como favorita una película que no lo era', async () => {
      // ARRANGE
      const movieId = 'movie-123';
      const movieMock = {
        id: movieId,
        title: 'Inception',
        director: 'Christopher Nolan',
        year: 2010,
        isFavorite: false,  // No es favorita
        ownerId: userId,
      };

      prisma.movie.findFirst.mockResolvedValue(movieMock);
      prisma.movie.update.mockResolvedValue({ ...movieMock, isFavorite: true });

      // ACT
      const response = await request(app)
        .patch(`/api/movies/${movieId}/favorite`)
        .set('Authorization', `Bearer ${token}`);

      // ASSERT
      expect(response.status).toBe(200);
      expect(response.body.isFavorite).toBe(true);
      expect(prisma.movie.update).toHaveBeenCalledWith({
        where: { id: movieId },
        data: { isFavorite: true },
      });
    });

    it('debería quitar de favoritos una película que lo era', async () => {
      // ARRANGE
      const movieId = 'movie-123';
      const movieMock = {
        id: movieId,
        title: 'Inception',
        director: 'Christopher Nolan',
        year: 2010,
        isFavorite: true,  // Ya es favorita
        ownerId: userId,
      };

      prisma.movie.findFirst.mockResolvedValue(movieMock);
      prisma.movie.update.mockResolvedValue({ ...movieMock, isFavorite: false });

      // ACT
      const response = await request(app)
        .patch(`/api/movies/${movieId}/favorite`)
        .set('Authorization', `Bearer ${token}`);

      // ASSERT
      expect(response.status).toBe(200);
      expect(response.body.isFavorite).toBe(false);
    });

    it('debería devolver 404 si la película no existe', async () => {
      // ARRANGE
      prisma.movie.findFirst.mockResolvedValue(null);

      // ACT
      const response = await request(app)
        .patch('/api/movies/no-existe/favorite')
        .set('Authorization', `Bearer ${token}`);

      // ASSERT
      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Película no encontrada');
    });

    it('debería devolver 401 sin token de autenticación', async () => {
      // ACT - Sin header Authorization
      const response = await request(app)
        .patch('/api/movies/movie-123/favorite');

      // ASSERT
      expect(response.status).toBe(401);
    });
  });
});
