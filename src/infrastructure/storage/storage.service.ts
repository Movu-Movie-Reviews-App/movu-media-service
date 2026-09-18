import { Injectable } from '@nestjs/common';
import { S3StorageAdapter } from './adapters/s3-storage-adapter';

@Injectable()
export class StorageService {

    constructor(
        private readonly storageAdapter: S3StorageAdapter
    ) { }

    generateUploadUrl(objectKey: string, contentType: string): Promise<string> {
        return this.storageAdapter.generateUploadUrl(objectKey, contentType);
    }

    generateDownloadUrl(objectKey: string): Promise<string> {
        return this.storageAdapter.generateDownloadUrl(objectKey);
    }

    deleteObject(objectKey: string): Promise<void> {
        return this.storageAdapter.deleteObject(objectKey);
    }

    objectExists(objectKey: string): Promise<boolean> {
        return this.storageAdapter.objectExists(objectKey);
    }



}
