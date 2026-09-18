import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { S3StorageAdapter } from './adapters/s3-storage-adapter';

@Module({
  providers: [StorageService, S3StorageAdapter],
  exports: [StorageService],
})
export class StorageModule { }
