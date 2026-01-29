import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { join } from 'path';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        return {
          transport: {
            host: config.get('E_HOST'),
            port: 465, 
            secure: true,
            auth: {
              user: config.get('E_USER'),
              pass: config.get('E_PASS'),
            },
            tls: {
              rejectUnauthorized: false,
            },
          },
          template: {
           dir: join(__dirname, '..', 'mail', 'templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
          defaults: {
            from: config.get('MAIL_FROM'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
})
export class MailerConfigModule {}