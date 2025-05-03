import { Injectable } from '@nestjs/common';
import {
    DeleteObjectCommand,
    type DeleteObjectCommandInput,
    PutObjectCommand,
    type PutObjectCommandInput,
    S3Client
} from "@aws-sdk/client-s3";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class StorageService {
    private readonly client: S3Client
    private readonly bucket: string;

    public constructor(
        private readonly configService: ConfigService,
    ) {
        this.client = new S3Client({
            endpoint: this.configService.getOrThrow<string>('S3_ENDPOINT'),
            region: this.configService.getOrThrow<string>('S3_REGION'),
            credentials: {
                accessKeyId: this.configService.getOrThrow<string>('S3_ACCESS_KEY_ID'),
                secretAccessKey: this.configService.getOrThrow<string>('S3_SECRET_ACCESS_KEY')
            },
        })

        this.bucket = this.configService.getOrThrow<string>('S3_BUCKET_NAME');
    }
    public async upload(buffer: Buffer, key: string, mimeType: string){
        const cleanKey = this.normalizeKey(key);
        const command: PutObjectCommandInput = {
            Bucket: this.bucket,
            Key: String(cleanKey),
            Body: buffer,
            ContentType: mimeType,
            CacheControl: 'must-revalidate',
        }

        try {
            await this.client.send(new PutObjectCommand(command));
        } catch (error){
            throw error;
        }
    }

    public async remove(key: string){
        const cleanKey = this.normalizeKey(key);
        const command: DeleteObjectCommandInput = {
            Bucket: this.bucket,
            Key: String(cleanKey)
        }

        try {
            await this.client.send(new DeleteObjectCommand(command));
        } catch (error){
            throw error;
        }
    }

    private normalizeKey(key: string) {
        return key.replace(/^\/+/, '');
    }
}
