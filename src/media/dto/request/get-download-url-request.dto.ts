import { IsEnum, IsUUID } from "class-validator"
import { MediaPurposeEnum } from "src/media/enums/media-purpose.enum"

export class GetDownloadUrlRequestDto {

    @IsUUID()
    mediaId: string

    @IsUUID()
    ownerId: string

    @IsEnum(MediaPurposeEnum)
    mediaPurpose: MediaPurposeEnum
}