

export interface StorageAdapter {

    generateUploadUrl(objectKey: string, contentType: string): Promise<string>;

    generateDownloadUrl(objectKey: string): Promise<string>;

    deleteObject(objectKey: string): Promise<void>;

    objectExists(objectKey: string): Promise<boolean>;

}