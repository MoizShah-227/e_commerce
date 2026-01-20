import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { user } from 'src/entities/user.enitity';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: '123',
  database: 'e_commerce',
  entities: [user],   // Add all entities here
  synchronize: true,  // ⚠️ only for dev
};
