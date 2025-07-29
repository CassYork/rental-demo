"use client"

import { HttpTypes, StoreCollection, StoreProduct, StoreProductCategory, StoreProductImage, StoreProductOption, StoreProductOptionValue, StoreProductTag, StoreProductType, StoreProductVariant } from "@medusajs/types"
import ProductPrice from "../product-price"
import ProductVariantsTable from "../product-variants-table"
import ProductRentVariantsTable from "../product-rent-variants-table"
import {
  Container,
  DatePicker,
  Label,
  RadioGroup,
  Select,
  Text,
} from "@medusajs/ui"
import { useState } from "react"
import { BaseProduct, BaseProductVariant } from "@medusajs/types/dist/http/product/common"

type RentalPrice = {
  id: string,
  duration: string,
  price: number
}

export interface IStoreProductVariant extends Omit<BaseProductVariant, "product" | "options"> {
  /**
   * The variant's values for the product's options.
   */
  options: StoreProductOptionValue[] | null;
  /**
   * The variant's product.
   */
  product?: StoreProduct | null;

  rental_prices?: RentalPrice[] | null

}

export interface IStoreProduct extends Omit<BaseProduct, "categories" | "sales_channels" | "variants" | "options" | "collection"> {
  /**
   * The product's collection.
   */
  collection?: StoreCollection | null;
  /**
   * The product's categories.
   */
  categories?: StoreProductCategory[] | null;
  /**
   * The product's variants.
   */
  variants: IStoreProductVariant[] | null;
  /**
   * The product's types.
   */
  type?: StoreProductType | null;
  /**
   * The product's tags.
   */
  tags?: StoreProductTag[] | null;
  /**
   * The product's options.
   */
  options: StoreProductOption[] | null;
  /**
   * The product's images.
   */
  images: StoreProductImage[] | null;
}

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
}

function makeid(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export default function ProductActions({
  product,
  region,
}: ProductActionsProps) {

  const [option, setOption] = useState<string>("buy")

  const updatedVariants = product.variants?.map(variant => {
    return {
      ...variant,
      for_rent: false,
      rental_duration: null,
      rantal_date: null,
      rental_prices: [
        {
          id: `rnpr_${makeid(5)}`,
          duration: "1 day",
          price: variant.options && variant.options[0].value === "White" ? 120 : 100
        },
        {
          id: `rnpr_${makeid(5)}`,
          duration: "1 week",
          price: variant.options && variant.options[0].value === "White" ? 420 : 400
        },
        {
          id: `rnpr_${makeid(5)}`,
          duration: "2 weeks",
          price: variant.options && variant.options[0].value === "White" ? 899 : 799
        },
        {
          id: `rnpr_${makeid(5)}`,
          duration: "1 month",
          price: variant.options && variant.options[0].value === "White" ? 1200 : 999
        },
      ]
    }
  })

  const updatedProduct = {
    ...product,
    variants: updatedVariants
  } as HttpTypes.StoreProduct

  return (
    <>
      <div className="flex flex-col gap-y-2 w-full">
        <ProductPrice product={product} />

        <RadioGroup value={option} onValueChange={(value) => setOption(value)}>
          <Container className="bg-ui-bg-subtle flex flex-col gap-2">
            <div className="flex items-start gap-x-3">
              <RadioGroup.Item value="buy" id="radio_2_descriptions" />
              <div className="flex flex-col gap-y-0.5">
                <Label htmlFor="radio_2_descriptions" weight="plus">
                  Buy
                </Label>
              </div>
            </div>
          </Container>

          <Container className="bg-ui-bg-subtle flex flex-col gap-2">
            <div className="flex items-start gap-x-3">
              <RadioGroup.Item value="rent" id="radio_1_descriptions" />
              <div className="flex flex-col gap-y-0.5">
                <Label htmlFor="radio_1_descriptions" weight="plus">
                  Rent
                </Label>
              </div>
            </div>
          </Container>
        </RadioGroup>

        {option === "rent" && (
          <ProductRentVariantsTable product={updatedProduct} region={region} />
        )}
        {option === "buy" && (
          <ProductVariantsTable product={updatedProduct} region={region} />
        )}
      </div>
    </>
  )
}
