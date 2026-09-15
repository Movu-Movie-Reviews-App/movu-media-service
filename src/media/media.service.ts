import { Injectable } from '@nestjs/common';

@Injectable()
export class MediaService {
  create() {
    return 'This action adds a new media';
  }

  findAll() {
    return `This action returns all media`;
  }

  findOne(id: number) {
    return `This action returns a #${id} media`;
  }

  update(id: number) {
    return `This action updates a #${id} media`;
  }

  remove(id: number) {
    return `This action removes a #${id} media`;
  }
}
