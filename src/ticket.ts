import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import getUnixTime from 'date-fns/getUnixTime';

@Entity('tickets')
export class Ticket extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  date: string;

  @Column({ nullable: false })
  time: string;

  @Column({ name: 'supplier_code', nullable: false })
  supplierCode: string;

  @Column({ name: 'ticket_number', unique: true, nullable: false })
  ticketNumber: string;

  @Column({ nullable: false })
  project: string;

  @Column()
  truck: string;

  @Column({ nullable: false })
  product: string;

  @Column({ type: 'int', name: 'gross_pounds', nullable: false })
  grossPounds: number;

  @Column({ type: 'int', name: 'tare_pounds', nullable: false })
  tarePounds: number;

  @Column({ type: 'int', name: 'net_pounds', nullable: false })
  netPounds: number;

  @Column({ type: 'int', name: 'load_number', nullable: false })
  loadNumber: number;

  @Column({ type: 'int', name: 'total_pounds', nullable: false })
  totalPounds: number;

  @Column()
  weighmaster: string;

  @Column({ name: 'plant_id' })
  plantId: string;

  @Column({ name: 'product_name' })
  productName: string;

  @Column({ name: 'ship_or_receive' })
  shipOrReceive: string;

  @Column({ name: 'src_file' })
  srcFile: string;

  @Column({ name: 'src_page' })
  srcPage: number;

  @Column({ name: 'created_at' })
  createdAt: number;

  @Column({ name: 'updated_at' })
  updatedAt: number;

  @BeforeInsert()
  addCreatedTimestamp() {
    this.createdAt = getUnixTime(new Date());
  }

  @BeforeUpdate()
  @BeforeInsert()
  updatedUpdatedTimestamp() {
    this.updatedAt = getUnixTime(new Date());
  }
}
