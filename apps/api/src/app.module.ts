import {
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR, APP_PIPE, Reflector } from '@nestjs/core';
import { HashModule } from './common/hash/hash.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { UserEntity } from './modules/users/user.entity';
import { CompanyEntity } from './modules/companies/entities/company.entity';
import { AddressEntity } from './modules/companies/entities/address.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HashModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        autoLoadEntities: true,
        entities: [UserEntity, CompanyEntity, AddressEntity],
        logging: true,
        synchronize: true,
      }),
    }),
    UsersModule,
    AuthModule,
    EmployeesModule,
    CompaniesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          transform: true,
          transformOptions: {
            enableImplicitConversion: true,
          },
        }),
    },
    {
      inject: [Reflector],
      provide: APP_INTERCEPTOR,
      useFactory: (reflector: Reflector) =>
        new ClassSerializerInterceptor(reflector, {
          enableCircularCheck: true,
        }),
    },
  ],
})
export class AppModule {}
