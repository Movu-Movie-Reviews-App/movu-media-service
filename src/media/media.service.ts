import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMediaRequestDto } from './dto/request/create-media.dto';
import { FILE_RULES } from './config/file-rules';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaEntity } from './entities/media.entity';
import { Repository } from 'typeorm';
import { MediaState } from './enums/media.state';
import { MediaPurposeEnum } from './enums/media-purpose.enum';
import { StorageService } from 'src/infrastructure/storage/storage.service';
import { CreateMediaResponseDto } from './dto/response/create-media-response.dto';
import { MEDIA_CONFIG } from './config/media-config';
import { GetDownloadUrlResponseDto } from './dto/response/get-download-url.dto';

@Injectable()
export class MediaService {

  constructor(
    @InjectRepository(MediaEntity) private readonly mediaRepository: Repository<MediaEntity>,
    private readonly storageService: StorageService

  ) { }

  async uploadMedia(createMediaDto: CreateMediaRequestDto): Promise<CreateMediaResponseDto> {
    this.validateFile(createMediaDto);
    const objectKey = await this.generateObjectKey(
      createMediaDto.ownerId,
      createMediaDto.purpose,
    );


    const media = this.mediaRepository.create({
      ownerId: createMediaDto.ownerId,
      purpose: createMediaDto.purpose,
      objectKey: objectKey,
      state: MediaState.PENDING,
      contentType: createMediaDto.contentType,
      size: createMediaDto.size.toString(),
    });

    await this.mediaRepository.save(media);
    return {
      mediaId: media.id,
      preSignedUrl: await this.storageService.generateUploadUrl(objectKey, createMediaDto.contentType),
      expirationTime: MEDIA_CONFIG.uploadUrlExpirationTime,
    };
  }

  async completeMediaUpload(mediaId: string, purpose: MediaPurposeEnum, ownerId: string) {
    // El lookup va acotado al dueno: el mediaId viaja por el cliente, asi que
    // buscar solo por id dejaria completar (y borrar) el avatar de otro usuario.
    const media = await this.mediaRepository.findOne({ where: { id: mediaId, purpose, ownerId } });

    if (!media) throw new NotFoundException(`Media with ID ${mediaId} not found.`);

    const previousMedia = await this.mediaRepository.findOne({ where: { ownerId: media.ownerId, purpose: media.purpose, state: MediaState.COMPLETED } });

    if (!await this.storageService.objectExists(media.objectKey)) {
      media.state = MediaState.FAILED;
      await this.mediaRepository.save(media);
      throw new BadRequestException(`File for media with ID ${mediaId} does not exist.`);
    }

    if (previousMedia) {
      await this.mediaRepository.delete(previousMedia.id);
      await this.storageService.deleteObject(previousMedia.objectKey);
    }

    media.state = MediaState.COMPLETED;
    await this.mediaRepository.save(media);

    return { mediaId: media.id, state: media.state };
  }

  private async generateObjectKey(ownerId: string, purpose: MediaPurposeEnum): Promise<string> {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    return `${ownerId}/${purpose}/${timestamp}-${randomString}`;
  }

  async getDownloadUrl(mediaId: string, mediaPurpose: MediaPurposeEnum, userId: string): Promise<GetDownloadUrlResponseDto> {
    const media = await this.mediaRepository.findOne({ where: { id: mediaId, purpose: mediaPurpose, ownerId: userId } });

    if (!media) throw new NotFoundException(`Media with ID ${mediaId} and purpose ${mediaPurpose} not found.`);

    return {
      mediaId: media.id,
      url: await this.storageService.generateDownloadUrl(media.objectKey),
      expirationTime: MEDIA_CONFIG.downloadUrlExpirationTime,
    };
  }

  private validateFile(createMediaDto: CreateMediaRequestDto) {
    const rules = FILE_RULES[createMediaDto.purpose];

    if (!rules) throw new BadRequestException(`No file rules defined for purpose: ${createMediaDto.purpose}`);

    if (!rules.allowedMimeTypes.includes(createMediaDto.contentType)) throw new BadRequestException(`Invalid content type: ${createMediaDto.contentType}. Allowed types: ${rules.allowedMimeTypes.join(', ')}`);

    if (createMediaDto.size > rules.maxSize) throw new BadRequestException(`File size exceeds the maximum allowed size of ${rules.maxSize} bytes.`);

  }

}
