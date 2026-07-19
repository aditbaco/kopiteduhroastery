// Third-party Imports
import { PrismaMariaDb } from '@prisma/adapter-mariadb'

// Prisma 7 generates the client into the project rather than node_modules —
// see the `output` path in prisma/schema.prisma.
import { PrismaClient } from '@/generated/prisma/client'

// Next's dev server hot-reloads modules on every edit, which would otherwise
// spawn a new PrismaClient (and a new connection pool) each time until MariaDB
// refuses connections. Stash the instance on globalThis so reloads reuse it.
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined }

const createPrismaClient = () => {
  // Prisma 7 requires a driver adapter; the MariaDB one covers both MariaDB and
  // MySQL over TCP. It accepts the connection string directly.
  const adapter = new PrismaMariaDb(process.env.DATABASE_URL as string)

  return new PrismaClient({ adapter })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
