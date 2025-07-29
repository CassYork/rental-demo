import { createWorkflow } from "@medusajs/workflows-sdk";
import { deleteRentItemStep } from "../steps/delete-rent-item";

export type DeleteRentItemInput = {
    id: string
};

export const deleteRentItemWorkflow = createWorkflow(
  "delete-rent-item",
  function (input: DeleteRentItemInput) {
    deleteRentItemStep([input.id]);
  }
);
