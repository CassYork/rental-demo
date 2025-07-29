import { Migration } from '@mikro-orm/migrations';

export class Migration20241211103608 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "duration" ("id" text not null, "duration" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "duration_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_duration_deleted_at" ON "duration" (deleted_at) WHERE deleted_at IS NULL;');

    this.addSql('create table if not exists "rent_item" ("id" text not null, "title" text not null, "subtitle" text not null, "quantity" integer not null, "requires_shipping" boolean not null default false, "is_discountable" boolean not null default false, "is_tax_inclusive" boolean not null default false, "unit_price" numeric not null, "thumbnail" text not null, "variant_id" text not null, "variant_sku" text not null, "variant_title" text not null, "product_id" text not null, "product_title" text not null, "product_description" text not null, "metadata" jsonb null, "raw_unit_price" jsonb not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "rent_item_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_rent_item_deleted_at" ON "rent_item" (deleted_at) WHERE deleted_at IS NULL;');

    this.addSql('create table if not exists "rent_order" ("id" text not null, "rent_status" text check ("rent_status" in (\'pending\', \'send\', \'return\', \'complete\')) not null default \'pending\', "start_date" timestamptz not null, "end_date" timestamptz not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "rent_order_pkey" primary key ("id"));');
    this.addSql('CREATE INDEX IF NOT EXISTS "IDX_rent_order_deleted_at" ON "rent_order" (deleted_at) WHERE deleted_at IS NULL;');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "duration" cascade;');

    this.addSql('drop table if exists "rent_item" cascade;');

    this.addSql('drop table if exists "rent_order" cascade;');
  }

}
