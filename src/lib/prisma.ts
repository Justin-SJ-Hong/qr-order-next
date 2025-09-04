import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Accelerate URL이 있으면 Accelerate 사용, 없으면 일반 Prisma 사용
const createPrismaClient = () => {
  const client = new PrismaClient()
  
  if (process.env.PRISMA_ACCELERATE_URL) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return client.$extends(withAccelerate()) as any
  }
  
  return client
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
