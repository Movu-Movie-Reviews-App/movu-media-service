import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { StorageAdapter } from "../interfaces/storage-adapter.interface";
import { envs } from "src/config";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Injectable } from "@nestjs/common";
import { MEDIA_CONFIG } from "src/media/config/media-config";

@Injectable()
export class S3StorageAdapter implements StorageAdapter {

    private readonly s3Client: S3Client
    private readonly bucketName: string

    constructor() {
        this.s3Client = new S3Client({
            region: envs.awsRegion,
            credentials: {
                accessKeyId: envs.awsAccessKeyId,
                secretAccessKey: envs.awsSecretAccessKey
            },
        });
        this.bucketName = envs.awsBucketName;
    }

    generateUploadUrl(objectKey: string, contentType: string): Promise<string> {

        const command = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: objectKey,
            ContentType: contentType
        });

        return getSignedUrl(this.s3Client, command, { expiresIn: MEDIA_CONFIG.uploadUrlExpirationTime });


    }

    generateDownloadUrl(objectKey: string): Promise<string> {
        const command = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: objectKey
        });

        return getSignedUrl(this.s3Client, command, { expiresIn: MEDIA_CONFIG.downloadUrlExpirationTime });

    }
    async deleteObject(objectKey: string): Promise<void> {
        await this.s3Client.send(new DeleteObjectCommand({
            Bucket: this.bucketName,
            Key: objectKey
        }))


    }
    async objectExists(objectKey: string): Promise<boolean> {
        try {
            await this.s3Client.send(new GetObjectCommand({
                Bucket: this.bucketName,
                Key: objectKey
            }));
            return true;
        } catch (error) {
            return false;
        }
    }
}  