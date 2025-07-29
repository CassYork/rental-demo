import { Migration } from '@mikro-orm/migrations';

export class Migration20241211140120 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table if exists "rent_item" add column if not exists "rent_duration" text not null, add column if not exists "rent_date" timestamptz not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table if exists "rent_item" drop column if exists "rent_duration";');
    this.addSql('alter table if exists "rent_item" drop column if exists "rent_date";');
  }

}
