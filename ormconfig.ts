import { config as dotenvConfig } from 'dotenv';
import { Client } from 'src/user/entities/client.entity';
import { Photo } from 'src/user/entities/photo.entity';
import { User } from 'src/user/entities/user.entity';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

dotenvConfig();

const ormConfig: PostgresConnectionOptions = {
  type: 'postgres',
  database: process.env.POSTGRES_DATABASE,
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  entities: [User, Client, Photo],
  synchronize: true
};

export default ormConfig;
