import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { addToCartRentStep, AddToCartRentStepInput } from "../steps/add-to-cart"

export const addToCartRentWorkflow = createWorkflow(
  "add-to-cart-rent",
  (input: AddToCartRentStepInput) => {
    const rentItem = addToCartRentStep(input);
    return new WorkflowResponse(rentItem);
  }
);
