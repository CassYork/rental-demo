import { HttpTypes } from "@medusajs/types"
import { getPercentageDiff } from "./get-precentage-diff"
import { convertToLocale } from "./money"

// TODO: Remove this util and use the AdminPrice type directly
export type VariantPrice = {
  calculated_price_number: string
  calculated_price: string
  original_price_number: string
  original_price: string
  currency_code: string
  price_type: string
  percentage_diff: string
}

export const getPricesForVariant = (variant: any): VariantPrice | null => {
  if (!variant?.calculated_price?.calculated_amount) {
    return null
  }

  return {
    calculated_price_number: variant.calculated_price.calculated_amount,
    calculated_price: convertToLocale({
      amount: variant.calculated_price.calculated_amount,
      currency_code: variant.calculated_price.currency_code,
    }),
    original_price_number: variant.calculated_price.original_amount,
    original_price: convertToLocale({
      amount: variant.calculated_price.original_amount,
      currency_code: variant.calculated_price.currency_code,
    }),
    currency_code: variant.calculated_price.currency_code,
    price_type: variant.calculated_price.calculated_price.price_list_type,
    percentage_diff: getPercentageDiff(
      variant.calculated_price.original_amount,
      variant.calculated_price.calculated_amount
    ),
  }
}

export function getProductPrice({
  product,
  variantId,
  duration = null
}: {
  product: HttpTypes.StoreProduct
  variantId?: string
  duration?: string | null
}) {
  if (!product || !product.id) {
    throw new Error("No product provided")
  }

  const cheapestPrice = () => {
    if (!product || !product.variants?.length) {
      return null
    }

    const cheapestVariant: any = product.variants
      .filter((v: any) => !!v.calculated_price)
      .sort((a: any, b: any) => {
        return (
          a.calculated_price.calculated_amount -
          b.calculated_price.calculated_amount
        )
      })[0]

    return getPricesForVariant(cheapestVariant)
  }

  const variantPrice = () => {
    if (!product || !variantId) {
      return null
    }

    const variant: any = product.variants?.find(
      (v) => v.id === variantId || v.sku === variantId
    )

    if (!variant) {
      return null
    }

    return getPricesForVariant(variant)
  }

  const rentPrice = () => {
    if (!product || !variantId || !duration) {
      return null
    }

    const variant: any = product.variants?.find(
      (v) => v.id === variantId || v.sku === variantId
    )

    if (!variant) {
      return null
    }

    const rentalPrice: any = variant?.rental_prices?.find(
      (rent: any) => rent.duration === duration
    )

    if(!rentalPrice) {
      return null
    }

    return {
      calculated_price_number: rentalPrice?.price,
      calculated_price: convertToLocale({
        amount: rentalPrice?.price,
        currency_code: variant.calculated_price.currency_code,
      }),
      original_price_number: rentalPrice?.price,
      original_price: convertToLocale({
        amount: rentalPrice?.price,
        currency_code: variant.calculated_price.currency_code,
      }),
      currency_code: variant.calculated_price.currency_code,
      price_type: variant.calculated_price.calculated_price.price_list_type,
      percentage_diff: getPercentageDiff(
        rentalPrice?.price,
        rentalPrice?.price
      ),
    }
  }

  return {
    product,
    cheapestPrice: cheapestPrice(),
    variantPrice: variantPrice(),
    rentPrice: rentPrice()
  }
}
