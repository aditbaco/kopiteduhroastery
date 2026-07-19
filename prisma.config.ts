// Prisma 7 moved CLI configuration out of schema.prisma into this file — the
// datasource URL and the seed command both live here now.
import 'dotenv/config'

import { defineConfig, env } from 'prisma/config'

type Env = {
  DATABASE_URL: string
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed: 'tsx prisma/seed.ts'
  },
  datasource: {
    url: env<Env>('DATABASE_URL')
  }
})
