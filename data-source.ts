import 'dotenv/config';
import { DataSource } from 'typeorm';

const host = process.env.POSTGRES_HOST;
const port = +(process.env.POSTGRES_PORT || 5432);
const username = process.env.POSTGRES_USER || 'postgres';
const password = process.env.POSTGRES_PASSWORD || '';
const database = process.env.POSTGRES_DB || 'postgres';

export default new DataSource({
  type: 'postgres',
  host,
  port,
  username,
  password,
  database,
  synchronize: false,
  entities: ['src/**/*.entity.ts', 'dist/**/*.entity.js'],
  migrations: ['migrations/*.ts', 'dist/migrations/*.js'],
});
