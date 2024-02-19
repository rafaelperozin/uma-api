import * as dotenv from 'dotenv';
import { ChildEntity, Column, OneToMany } from 'typeorm';

import { Photo } from './photo.entity';
import { User } from './user.entity';

dotenv.config();

@ChildEntity()
export class Client extends User {
  @Column({
    default: `${process.env.AWS_S3_ENDPOINT}rafaelperozin/assets/default_avatar.jpg`
  })
  avatar?: string;

  @OneToMany(() => Photo, photo => photo.user)
  photos?: Photo[];
}
