"use client"

import { useCart } from "@lib/context/cart-context"
import { checkSpendingLimit } from "@lib/util/check-spending-limit"
import { Badge, Container, Heading, Text } from "@medusajs/ui"
import { B2BCustomer } from "types/global"
import EmptyCartMessage from "../components/empty-cart-message"
import SignInPrompt from "../components/sign-in-prompt"
import ItemsTemplate from "./items"
import Summary from "./summary"
import { useMemo } from "react"
import AppliedPromotions from "../components/applied-promotions"
import RentItemsTemplate from "./rent-items"

const CartTemplate = ({ customer }: { customer: B2BCustomer | null }) => {
  const { cart } = useCart()

  const spendLimitExceeded = useMemo(
    () => checkSpendingLimit(cart, customer),
    [cart, customer]
  )

  const totalItems = useMemo(
    () => cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0,
    [cart?.items]
  )

  const totalRentItems = useMemo(
    () => cart?.rent_items?.reduce((acc, item) => acc + item.quantity, 0) || 0,
    [cart?.rent_items]
  )

  return (
    <div className="small:py-12 py-6 bg-neutral-100">
      <div className="content-container" data-testid="cart-container">
        {cart?.items?.length || cart?.rent_items?.length ? (
          <div>
            <div className="flex flex-col py-6 gap-y-6">
              <div className="pb-3 flex items-center">
                <Heading className="text-neutral-950">
                  You have {totalItems} buy items and {totalRentItems} for rent items in your cart
                </Heading>
              </div>

              <div className="grid grid-cols-1 small:grid-cols-[1fr_360px] gap-2">
                <div className="flex flex-col gap-y-2">
                  {!customer && <SignInPrompt />}
                  <ItemsTemplate cart={cart} showTotal={false} />

                  {cart?.rent_items && cart.rent_items.length > 0 && (
                    <RentItemsTemplate
                      cart={cart}
                      showBorders={false}
                      showTotal={false}
                    />
                  )}
                </div>
                <div className="relative">
                  <div className="flex flex-col gap-y-8 sticky top-20">
                    {cart && cart.region && (
                      <Summary
                        customer={customer}
                        spendLimitExceeded={spendLimitExceeded}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <EmptyCartMessage />
          </div>
        )}
      </div>
    </div>
  )
}

export default CartTemplate
