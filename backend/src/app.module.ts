import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SensorsModule } from './sensors/sensors.module';
import { MetricTypesModule } from './metric-types/metric-types.module';
import { ReadingsModule } from './readings/readings.module';
import { ReadingValuesModule } from './reading-values/reading-values.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true, // Note: set to false in production --> !ONLY FOR DEV
      }),
      inject: [ConfigService],
    }),
    SensorsModule,
    MetricTypesModule,
    ReadingsModule,
    ReadingValuesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
