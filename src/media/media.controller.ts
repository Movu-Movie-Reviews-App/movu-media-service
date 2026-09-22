import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MediaService } from './media.service';
import { CreateMediaRequestDto } from './dto/request/create-media.dto';
import { GetDownloadUrlRequestDto } from './dto/request/get-download-url-request.dto';
import { CompleteUploadRequestDto } from './dto/request/complete-upload-request.dto';

@Controller()
export class MediaController {
  constructor(private readonly mediaService: MediaService) { }

  @MessagePattern('media.uploadMedia')
  uploadMedia(@Payload() createMediaDto: CreateMediaRequestDto) {
    return this.mediaService.uploadMedia(createMediaDto);
  }

  @MessagePattern('media.completeMediaUpload')
  completeMediaUpload(@Payload() completeUploadDto: CompleteUploadRequestDto) {
    return this.mediaService.completeMediaUpload(completeUploadDto.mediaId, completeUploadDto.mediaPurpose, completeUploadDto.ownerId);
  }

  @MessagePattern('media.getDownloadUrl')
  getDownloadUrl(@Payload() getDownloadUrlRequestDto: GetDownloadUrlRequestDto) {
    return this.mediaService.getDownloadUrl(getDownloadUrlRequestDto.mediaId, getDownloadUrlRequestDto.mediaPurpose, getDownloadUrlRequestDto.ownerId);
  }

}
