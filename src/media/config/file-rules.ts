import { MediaPurposeEnum } from "../enums/media-purpose.enum";
import { FileRule } from "../interfaces/file-rule.interface";

export const FileRules: Record<MediaPurposeEnum, FileRule> = {

    [MediaPurposeEnum.AVATAR]: {
        allowedMimeTypes: ['image/jpeg', 'image/png'],
        maxSize: 5 * 1024 * 1024, // 5MB
    },

}