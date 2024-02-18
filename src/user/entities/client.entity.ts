import { ChildEntity, Column, OneToMany } from 'typeorm';

import { Photo } from './photo.entity';
import { User } from './user.entity';

@ChildEntity()
export class Client extends User {
  @Column({
    default:
      'https://cw-recruitment-tests.s3.amazonaws.com/rafaelperozin/assets/default_avatar.jpg'
  })
  avatar: string;

  @OneToMany(() => Photo, photo => photo.user)
  photos: Photo[];
}
