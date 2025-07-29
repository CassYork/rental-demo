import { model } from "@medusajs/framework/utils";

export const RentOrder = model.define("rent_order", {
  id: model.id({ prefix: "reor" }).primaryKey(),
  rent_status: model
    .enum([
      "pending",
      "send",
      "return",
      "complete"
    ])
    .default("pending"),
  start_date: model.dateTime(),
  end_date: model.dateTime()
});
