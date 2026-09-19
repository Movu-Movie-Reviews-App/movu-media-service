import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';
import { MediaEntity } from './entities/media.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StorageModule } from '../infrastructure/storage/storage.module';

@Module({
  controllers: [MediaController],
  providers: [MediaService],
  imports: [TypeOrmModule.forFeature([MediaEntity]), StorageModule],
})
export class MediaModule { }
