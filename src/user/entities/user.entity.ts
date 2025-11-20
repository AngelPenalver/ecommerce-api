import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar', length: 100, nullable: false})
    name: string;

    @Column({type: 'varchar', length: 100, nullable: false, unique: true})
    email: string;

    @Column({type: 'varchar', length: 100, nullable: false})
    password: string;

    @Column({type: 'varchar', length: 100, nullable: false, default: 'USER'})
    role: string;

    @CreateDateColumn({type: 'timestamp', nullable: false})
    createdAt: Date;

    @UpdateDateColumn({type: 'timestamp', nullable: false})
    updatedAt: Date;

    @DeleteDateColumn({type: 'timestamp', nullable: true})
    deletedAt: Date;
}
