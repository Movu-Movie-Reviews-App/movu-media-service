import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { MediaPurposeEnum } from "../enums/media-purpose.enum";
import { MediaState } from "../enums/media.state";

@Entity()
export class MediaEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'text',
    })
    ownerId: string;

    @Column({
        type: 'enum',
        enum: MediaPurposeEnum,
    })
    purpose: MediaPurposeEnum;

    @Column({
        type: 'text',
        unique: true
    })
    objectKey: string;

    @Column({
        type: 'text',
    })
    contentType: string;

    @Column({
        type: 'bigint',
    })
    size: string;

    @Column({
        type: 'enum',
        enum: MediaState,
    })
    state: MediaState;

    @UpdateDateColumn({
        type: 'timestamp',
    })
    updatedAt: Date;

    @CreateDateColumn({
        type: 'timestamp',
    })
    createdAt: Date;

}
