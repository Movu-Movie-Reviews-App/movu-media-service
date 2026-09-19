import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MediaService } from './media.service';
import { CreateMediaRequestDto } from './dto/request/create-media.dto';
import { GetDownloadUrlRequestDto } from './dto/request/get-download-url-request.dto';

@Controller()
export class MediaController {
  constructor(private readonly mediaService: MediaService) { }

  @MessagePattern('media.uploadMedia')
  uploadMedia(@Payload() createMediaDto: CreateMediaRequestDto) {
    return this.mediaService.uploadMedia(createMediaDto);
  }

  @MessagePattern('media.completeMediaUpload')
  completeMediaUpload(@Payload() mediaId: string) {
    return this.mediaService.completeMediaUpload(mediaId);
  }

  @MessagePattern('media.getDownloadUrl')
  getDownloadUrl(@Payload() getDownloadUrlRequestDto: GetDownloadUrlRequestDto) {
    return this.mediaService.getDownloadUrl(getDownloadUrlRequestDto.mediaId, getDownloadUrlRequestDto.mediaPurpose, getDownloadUrlRequestDto.ownerId);
  }

}
