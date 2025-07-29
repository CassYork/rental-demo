import { model } from "@medusajs/framework/utils";

export const Duration = model.define("duration", {
    id: model.id({ prefix: "dur" }).primaryKey(),
    duration: model.text()
});
