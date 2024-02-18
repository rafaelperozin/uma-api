import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { IsEmail, Length, Matches } from 'class-validator';
import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  TableInheritance,
  UpdateDateColumn
} from 'typeorm';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Length(2, 25)
  firstName: string;

  @Column()
  @Length(2, 25)
  lastName: string;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ nullable: true })
  role: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @Column()
  @Exclude({ toPlainOnly: true })
  @Length(6, 50)
  @Matches(/^(?=.*[0-9]).*$/, {
    message: 'Password must contain at least one number'
  })
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }
}
