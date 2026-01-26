// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { TypeOrmModuleAsyncOptions, TypeOrmModuleOptions } from '@nestjs/typeorm';
// import { config } from 'process';
// import { Cart } from 'src/entities/cart.entity';
// import { Order } from 'src/entities/order.entity';
// import { Product } from 'src/entities/product.entity';
// import { User } from 'src/entities/user.entity';


// export const typeOrmConfig = {
//   inject: [ConfigService],
//   useFactory: async (config: ConfigService) => {
//     return {
//       // TypeORM configuration options
//       type: config.get('TYPE'),
//       host: config.get('HOST'),
//       port: config.get('DB_PORT'),
//       username: config.get('USERNAME'),
//       password: config.get('PASSWORD'),
//       database: config.get('DATABASE'),
//       entities: [User, Cart, Product, Order],
//       synchronize: true,
//     };
//   },
// };

// export const TypeOrmConfigModule = ConfigModule.forRoot({
//   load: [() => ({ ...process.env, DB_CONFIG: JSON.stringify(require('./db.config')) })],
//   envFilePath: '.env',
//   expandVariables: true,
//   ignoreEnvFile: process.env.NODE_ENV === 'production',
//   cache: true,
// /* The line `// TypeOrmModule.forRoot(typeOrmConfigAsync),` is a commented-out line of code in the
// AppModule file. It appears to be a placeholder or a reference to a potential usage of the
// TypeOrmModule.forRoot method with a configuration provided by typeOrmConfigAsync. */
// /* The line `// TypeOrmModule.forRoot(typeOrmConfigAsync),` is a commented-out line of code in the
// AppModule file. It appears to be a placeholder or a reference to a potential configuration for
// TypeORM module in the NestJS application. */
// });