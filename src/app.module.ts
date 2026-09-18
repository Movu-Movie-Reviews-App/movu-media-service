import { Module } from '@nestjs/common';
import { MediaModule } from './media/media.module';
import { envs } from './config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageModule } from './infrastructure/storage/storage.module';

@Module({
  imports: [MediaModule, TypeOrmModule.forRoot({
    type: 'postgres',
    host: envs.dbHost,
    port: envs.dbPort,
    username: envs.dbUsername,
    password: envs.dbPassword,
    database: envs.dbName,
    autoLoadEntities: true,
    synchronize: true,
  }), StorageModule],
  controllers: [],
  providers: [],
})
export class AppModule { }
