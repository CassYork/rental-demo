import type { MedusaRequest, MedusaResponse } from "@medusajs/framework";
import { HttpTypes } from "@medusajs/framework/types";
import { ContainerRegistrationKeys, Modules } from "@medusajs/utils";
import { StoreAddRentItemsBulkType } from "../../../validators";
import { deleteRentItemWorkflow } from "src/workflows/rent/workflows/delete-rent-item";

interface IResponse extends HttpTypes.StoreCartResponse { deletedRentItem: any }

export async function DELETE(
  req: MedusaRequest<StoreAddRentItemsBulkType>,
  res: MedusaResponse<IResponse>
) {
  const { id, item } = req.params;

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  const workflowInput = {
    id: item
  };

  const { result } = await deleteRentItemWorkflow(req.scope).run({
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

  res.json({ cart: upatedCart, deletedRentItem: result  });
}
