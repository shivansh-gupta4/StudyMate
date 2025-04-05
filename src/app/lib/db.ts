import { PrismaClient } from '@prisma/client';

// Extending the global object to include 'prisma'
declare global {
  // eslint-disable-next-line no-var
  var prismaClient: PrismaClient | undefined;
}

let prismaClient: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prismaClient = new PrismaClient();
} else {
  // In development, use a global variable to prevent multiple instances of Prisma Client
  if (!global.prismaClient) {
    global.prismaClient = new PrismaClient();
  }
  prismaClient = global.prismaClient;
}

export default prismaClient;
