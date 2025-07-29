import { Module } from "@medusajs/framework/utils";
import RentModuleService from "./service";

export const RENT_MODULE = "Rent";

export default Module(RENT_MODULE, { service: RentModuleService });
