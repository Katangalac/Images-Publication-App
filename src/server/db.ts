import { PrismaClient } from "@prisma/client"

import { env } from "@/env.js"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

/**
 * Initialisation du PrismaClient
 */
export const db = new PrismaClient({
  datasources: {
    db: { url: env.DATABASE_URL }
  },
})

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db
