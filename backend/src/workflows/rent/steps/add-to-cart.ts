import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { RENT_MODULE } from "../../../modules/rent";
import RentModuleService from "../../../modules/rent/service";
import { Modules } from "@medusajs/framework/utils";
import { LinkDefinition } from "@medusajs/framework/types";

export type AddToCartRentStepInput = {
  rent_items: any[];
  cart: any;
};

export const addToCartRentStep = createStep(
  "add-to-cart-rent-step",
  async (input: AddToCartRentStepInput, { container }) => {
    const remoteLink = container.resolve("remoteLink");
    const rentModuleService: RentModuleService = container.resolve(RENT_MODULE);

    const rentItems = await rentModuleService.createRentItems(input.rent_items);

    const links: LinkDefinition[] = []

    for (const item of rentItems) {
      links.push({
        [RENT_MODULE]: {
            rent_item_id: item.id,
        },
        [Modules.CART]: {
            cart_id: input.cart.id,
        },
      })
    }


    await remoteLink.create(links);

    return new StepResponse(rentItems, rentItems.map(i => i.id));
  }
);
