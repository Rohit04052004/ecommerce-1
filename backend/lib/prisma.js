import { PrismaClient } from "@prisma/client";

// Reuse a single client across hot serverless invocations to avoid
// exhausting the database's connection limit.
const prisma = globalThis.prismaGlobal ?? new PrismaClient();
globalThis.prismaGlobal = prisma;

export default prisma;
