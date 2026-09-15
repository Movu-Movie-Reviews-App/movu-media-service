import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { MediaService } from './media.service';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';

@Controller()
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @MessagePattern('createMedia')
  create(@Payload() createMediaDto: CreateMediaDto) {
    return this.mediaService.create(createMediaDto);
  }

  @MessagePattern('findAllMedia')
  findAll() {
    return this.mediaService.findAll();
  }

  @MessagePattern('findOneMedia')
  findOne(@Payload() id: number) {
    return this.mediaService.findOne(id);
  }

  @MessagePattern('updateMedia')
  update(@Payload() updateMediaDto: UpdateMediaDto) {
    return this.mediaService.update(updateMediaDto.id, updateMediaDto);
  }

  @MessagePattern('removeMedia')
  remove(@Payload() id: number) {
    return this.mediaService.remove(id);
  }
}
