import { defineConfig, env } from 'prisma/config';

if (!process.env.DATABASE_URL) {
  process.loadEnvFile?.();
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
});
