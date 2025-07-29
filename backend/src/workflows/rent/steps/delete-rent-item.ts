import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import RentModuleService from "src/modules/rent/service";
import { RENT_MODULE } from "src/modules/rent";

export const deleteRentItemStep = createStep(
    "delete-rent-item",
    async (ids: string[], { container }) => {
        const remoteLink = container.resolve("remoteLink");
        const rentModuleService: RentModuleService = container.resolve(RENT_MODULE);

        await rentModuleService.softDeleteRentItems(ids);

        for (const id of ids) {
            await remoteLink.delete({
                [RENT_MODULE]: {
                    rent_item_id: id,
                }
            });
        }
        return new StepResponse(ids);
    },
    async (rentItemsId: string[], { container }) => {
    }
);
