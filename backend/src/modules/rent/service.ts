import { MedusaService } from "@medusajs/framework/utils";
import { RentOrder, RentItem } from "./models";

class RentModuleService extends MedusaService({ RentOrder, RentItem }) {}

export default RentModuleService;
