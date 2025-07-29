import { model } from "@medusajs/framework/utils";

export const RentItem = model.define("rent_item", {
  id: model.id({ prefix: "reit" }).primaryKey(),
  title: model.text(),
  subtitle: model.text(),
  quantity: model.number(),
  requires_shipping: model.boolean().default(false),
  is_discountable: model.boolean().default(false),
  is_tax_inclusive: model.boolean().default(false),
  unit_price: model.bigNumber(),
  thumbnail: model.text(),
  variant_id: model.text(),
  variant_sku: model.text(),
  variant_title: model.text(),
  product_id: model.text(),
  product_title: model.text(),
  product_description: model.text(),
  rent_duration: model.text(),
  rent_date: model.dateTime(),
  metadata: model.json().nullable()
});
