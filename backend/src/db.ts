import { PrismaClient } from './generated/prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import path from 'path';

const dbPath = path.resolve(__dirname, '../prisma/dev.db');
const adapter = new PrismaBetterSqlite3({
  url: `file:${dbPath}`
});

const globalRef = global as unknown as { prisma?: PrismaClient };

export const prisma = globalRef.prisma || new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalRef.prisma = prisma;
}
