import { PrismaClient } from '@prisma/client'

// For Prisma 7, we'll provide connection details directly to the client
const prismaClient = new PrismaClient()

declare global {
  // This prevents TypeScript from generating a new type for each module
  var prisma: PrismaClient | undefined
}

const prisma = global.prisma || prismaClient

if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma
}

export default prisma