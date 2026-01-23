// Configuración centralizada de Prisma para Prisma 7
// Este archivo exporta una instancia única del cliente de Prisma

const { PrismaClient } = require('@prisma/client');
const { PrismaLibSql } = require('@prisma/adapter-libsql');
const { createClient } = require('@libsql/client');

// Crear cliente libSQL para SQLite
const libsql = createClient({
  url: process.env.DATABASE_URL || 'file:./prisma/dev.db'
});

// Crear adapter para Prisma
const adapter = new PrismaLibSql(libsql);

// Crear instancia única de PrismaClient con el adapter
const prisma = new PrismaClient({ adapter });

module.exports = prisma;
