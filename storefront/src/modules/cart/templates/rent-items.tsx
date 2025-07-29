import { convertToLocale } from "@lib/util/money"
import { StoreCartLineItem } from "@medusajs/types"
import { Container, Text } from "@medusajs/ui"
import ItemFull from "@modules/cart/components/item-full"
import { useMemo } from "react"
import { B2BCart } from "types/global"
import RentItemFull from "../components/rent-item-full"

type ItemsTemplateProps = {
  cart: B2BCart
  showBorders?: boolean
  showTotal?: boolean
}

const RentItemsTemplate = ({
  cart,
  showBorders = true,
  showTotal = true,
}: ItemsTemplateProps) => {
  const items = cart?.rent_items
  const totalQuantity = useMemo(
    () => cart?.rent_items?.reduce((acc, item) => acc + item.quantity, 0),
    [cart?.rent_items]
  )

  return (
    <div className="w-full flex flex-col gap-y-2 border-t-2 mt-4 pt-4">
      <Text className="font-medium text-lg text-center">Rent Items</Text>

      <div className="flex flex-col gap-y-2 w-full">
        {items &&
          items.map((item: StoreCartLineItem) => {
            return (
              <RentItemFull
                currencyCode={cart?.currency_code}
                showBorders={showBorders}
                key={item.id}
                item={
                  item as StoreCartLineItem & {
                    metadata?: { note?: string }
                  }
                }
              />
            )
          })}
      </div>
      {showTotal && (
        <Container>
          <div className="flex items-start justify-between h-full self-stretch">
            <Text>Total For Rent: {totalQuantity} items</Text>
            <Text>
              {convertToLocale({
                amount: cart?.item_total,
                currency_code: cart?.currency_code,
              })}
            </Text>
          </div>
        </Container>
      )}
    </div>
  )
}

export default RentItemsTemplate
