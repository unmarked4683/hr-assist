import {
  ClassSerializerInterceptor,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE, Reflector } from '@nestjs/core';
import { HashModule } from './common/hash/hash.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { EmployeesModule } from './modules/employees/employees.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { UserEntity } from './modules/users/user.entity';
import { CompanyEntity } from './modules/companies/entities/company.entity';
import { AddressEntity } from './modules/companies/entities/address.entity';
import { EmployeeEntity } from './modules/employees/entities/employee.entity';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { AbsenceEntity } from './modules/attendance/entities/absence.entity';
import { GlobalExceptionFilter } from './common/filters/global-exception/global-exception.filter';
import { ResponseWrapperInterceptor } from './common/interceptors/response-wrapper/response-wrapper.interceptor';

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
        entities: [
          UserEntity,
          CompanyEntity,
          AddressEntity,
          EmployeeEntity,
          AbsenceEntity,
        ],
        logging: configService.get('NODE_ENV') === 'development',
        synchronize: configService.get('NODE_ENV') === 'development',
      }),
    }),
    UsersModule,
    AuthModule,
    EmployeesModule,
    CompaniesModule,
    AttendanceModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseWrapperInterceptor,
    },
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
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
