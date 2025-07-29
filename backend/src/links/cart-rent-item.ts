import { defineLink } from "@medusajs/framework/utils";
import CartModule from "@medusajs/medusa/cart";
import RentModule from "../modules/rent";

export default defineLink(
    {
        linkable: RentModule.linkable.rentItem,
        isList: true,
    },
    CartModule.linkable.cart,
);
