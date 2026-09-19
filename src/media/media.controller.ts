import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MediaService } from './media.service';
import { CreateMediaRequestDto } from './dto/request/create-media.dto';

@Controller()
export class MediaController {
  constructor(private readonly mediaService: MediaService) { }

  @MessagePattern('mediaService.createMedia')
  uploadMedia(@Payload() createMediaDto: CreateMediaRequestDto) {
    return this.mediaService.uploadMedia(createMediaDto);
  }

  @MessagePattern('mediaService.completeMediaUpload')
  completeMediaUpload(@Payload() mediaId: string) {
    return this.mediaService.completeMediaUpload(mediaId);
  }

  @MessagePattern('mediaService.getDownloadUrl')
  getDownloadUrl(@Payload() mediaId: string) {
    return this.mediaService.getDownloadUrl(mediaId);
  }

}
