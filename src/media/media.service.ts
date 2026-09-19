import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateMediaDto } from './dto/create-media.dto';
import { FILE_RULES } from './config/file-rules';
import { InjectRepository } from '@nestjs/typeorm';
import { MediaEntity } from './entities/media.entity';
import { Repository } from 'typeorm';
import { MediaState } from './enums/media.state';
import { MediaPurposeEnum } from './enums/media-purpose.enum';
import { StorageService } from 'src/infrastructure/storage/storage.service';

@Injectable()
export class MediaService {

  constructor(
    @InjectRepository(MediaEntity) private readonly mediaRepository: Repository<MediaEntity>,
    private readonly storageService: StorageService

  ) { }

  async uploadMedia(createMediaDto: CreateMediaDto) {
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
    return this.storageService.generateUploadUrl(objectKey, createMediaDto.contentType);
  }

  async completeMediaUpload(mediaId: string) {
    const media = await this.mediaRepository.findOne({ where: { id: mediaId } });

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
  }

  private async generateObjectKey(ownerId: string, purpose: MediaPurposeEnum): Promise<string> {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    return `${ownerId}/${purpose}/${timestamp}-${randomString}`;
  }

  private async findMedia(createMediaDto: CreateMediaDto) {
    const media = await this.mediaRepository.findOne({ where: { contentType: createMediaDto.contentType, ownerId: createMediaDto.ownerId, purpose: createMediaDto.purpose } });
    return media;
  }

  private validateFile(createMediaDto: CreateMediaDto) {
    const rules = FILE_RULES[createMediaDto.purpose];

    if (!rules) throw new BadRequestException(`No file rules defined for purpose: ${createMediaDto.purpose}`);

    if (!rules.allowedMimeTypes.includes(createMediaDto.contentType)) throw new BadRequestException(`Invalid content type: ${createMediaDto.contentType}. Allowed types: ${rules.allowedMimeTypes.join(', ')}`);

    if (createMediaDto.size > rules.maxSize) throw new BadRequestException(`File size exceeds the maximum allowed size of ${rules.maxSize} bytes.`);

  }

}
