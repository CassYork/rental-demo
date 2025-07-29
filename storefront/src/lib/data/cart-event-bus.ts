import type { StoreProduct, StoreProductVariant } from "@medusajs/types"

export type AddToCartEventPayload = {
  lineItems: {
    productVariant: StoreProductVariant & {
      product: StoreProduct
    }
    quantity: number
  }[]
  regionId: string
  for_rent?: boolean
}

export type AddToCartEventRentPayload = {
  lineItems: {
    productVariant: StoreProductVariant & {
      product: StoreProduct
    }
    quantity: number,
    duration: string,
    rentDate: Date,
    rentPrice: number
  }[]
  regionId: string
}

type CartAddEventHandler = (payload: AddToCartEventPayload) => void
type CartAddRentEventHandler = (payload: AddToCartEventRentPayload) => void

type CartAddEventBus = {
  emitCartAdd: (payload: AddToCartEventPayload) => void
  emitRentCartAdd: (payload: AddToCartEventRentPayload) => void
  handler: CartAddEventHandler
  rentHandler: CartAddRentEventHandler
  registerCartAddHandler: (handler: CartAddEventHandler) => void
  registerRentCartAddHandler: (handler: CartAddRentEventHandler) => void
}

export const addToCartEventBus: CartAddEventBus = {
  emitCartAdd(payload: AddToCartEventPayload) {
    this.handler(payload)
  },
  emitRentCartAdd(payload: AddToCartEventRentPayload) {
    this.rentHandler(payload)
  },
  handler: () => {},
  rentHandler: () => {},

  registerCartAddHandler(handler: CartAddEventHandler) {
    this.handler = handler
  },
  registerRentCartAddHandler(handler: CartAddRentEventHandler) {
    this.rentHandler = handler
  },
}
