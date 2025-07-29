import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { HttpTypes } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/utils";
import { StoreAddRentItemsBulkType } from "../../../validators";
import { addToCartRentWorkflow } from "src/workflows/rent/workflows/add-to-cart";
import { RENT_MODULE } from "src/modules/rent";

export async function POST(
  req: MedusaRequest<StoreAddRentItemsBulkType>,
  res: MedusaResponse<HttpTypes.StoreCartResponse>
) {
  const { id } = req.params;
  const { rent_items } = req.validatedBody;
  
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const {
    data: [cart],
  } = await query.graph(
    {
      entity: "cart",
      fields: req.remoteQueryConfig.fields,
      filters: { id },
    },
    { throwIfKeyNotFound: true }
  );

  const workflowInput = {
    rent_items,
    cart,
  };

  await addToCartRentWorkflow(req.scope).run({
    input: workflowInput,
  });

  const {
    data: [upatedCart],
  } = await query.graph(
    {
      entity: "cart",
      fields: req.remoteQueryConfig.fields,
      filters: { id },
    },
    { throwIfKeyNotFound: true }
  );

  res.json({ cart: upatedCart });
}
