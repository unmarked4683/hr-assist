import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().min(1000).default(3000),
  // DATABASE_URL: z.url(),
  ENV: z
    .union([
      z.literal('development'),
      z.literal('testing'),
      z.literal('production'),
    ])
    .default('development'),
});

export type Environment = z.infer<typeof envSchema>;

const env = envSchema.parse(process.env);
export default env;
