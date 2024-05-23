import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { lowercase } from './ValueTransformers';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column()
  public name: string;

  @Index({ unique: true })
  @Column({
    unique: true,
    nullable: false,
    transformer: [lowercase],
  })
  public email: string;

  @Column({
    nullable: false,
  })
  public password: string;

  @Column({
    select: false,
    nullable: false,
  })
  public salt: string;

  @Column()
  @CreateDateColumn()
  public createdAt: Date;

  @Column()
  @UpdateDateColumn()
  public updatedAt: Date;

  // @AfterLoad()
  // public deletePropertis(): void {
  //   // delete this.password;
  //   // delete this.salt;
  //   delete this.email;
  //   if (this.password) {
  //     console.log(this.password);
  //   }
  // }
}
