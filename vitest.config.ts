import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    setupFiles: ['src/tests/setup.ts'],
    fileParallelism: false,
    sequence: { sequential: true },
    env: {
      DATABASE_URL: 'file:./prisma/test.db',
    },
  },
});
