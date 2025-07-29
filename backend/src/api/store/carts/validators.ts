import { createSelectParams } from "@medusajs/medusa/api/utils/validators";
import { z } from "zod";

export type GetCartLineItemsBulkParamsType = z.infer<
  typeof GetCartLineItemsBulkParams
>;
export const GetCartLineItemsBulkParams = createSelectParams();

export type StoreAddLineItemsBulkType = z.infer<typeof StoreAddLineItemsBulk>;
export const StoreAddLineItemsBulk = z
  .object({
    line_items: z.array(
      z.object({
        variant_id: z.string(),
        quantity: z.number()
      })
    ),
  })
  .strict();

export type StoreAddRentItemsBulkType = z.infer<typeof StoreAddRentItemsBulk>;
export const StoreAddRentItemsBulk = z
  .object({
    rent_items: z.array(
      z.object({
        variant_id: z.string(),
        quantity: z.number(),
        title: z.string(),
        subtitle: z.string().optional(),
        requires_shipping: z.boolean().optional(),
        is_discountable: z.boolean().optional(),
        is_tax_inclusive: z.boolean().optional(),
        unit_price: z.number(),
        thumbnail: z.string().optional(),
        variant_sku: z.string(),
        variant_title: z.string(),
        product_id: z.string().optional(),
        product_title: z.string().optional(),
        product_description: z.string().optional(),
        rent_duration: z.string(),
        rent_date: z.string(),
      })
    ),
  })
  .strict();