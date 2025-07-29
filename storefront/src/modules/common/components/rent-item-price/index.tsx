import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { clx, Text } from "@medusajs/ui"

type LineItemPriceProps = {
  item: any
  style?: "default" | "tight"
  className?: string
  currencyCode: string
}

const RentItemPrice = ({
  item,
  style = "default",
  className,
  currencyCode,
}: LineItemPriceProps) => {

  const currentPrice = item?.quantity * item?.unit_price

  return (
    <Text
      className={clx(
        "flex flex-col gap-x-2 text-ui-fg-subtle items-end",
        className
      )}
    >
      <span className="flex flex-col text-left">
        <span className="text-base-regular" data-testid="product-price">
          {convertToLocale({
            amount: currentPrice,
            currency_code: currencyCode ?? "eur",
          })}
        </span>
        
      </span>
    </Text>
  )
}

export default RentItemPrice
