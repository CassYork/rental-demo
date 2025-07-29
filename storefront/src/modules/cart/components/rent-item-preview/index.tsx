"use client"
import { Badge, clx, Container } from "@medusajs/ui"
import LineItemPrice from "@modules/common/components/line-item-price"
import RentItemPrice from "@modules/common/components/rent-item-price"
import Thumbnail from "@modules/products/components/thumbnail"

type ItemProps = {
  item: any
  showBorders?: boolean
  currencyCode: string
}

const RentItemPreview = ({ item, showBorders = true, currencyCode }: ItemProps) => {

  return (
    <Container
      className={clx(
        "flex gap-4 w-full h-full items-center justify-between p-0",
        {
          "shadow-none": !showBorders,
        }
      )}
    >
      <div className="flex gap-x-4 items-start">
        <Thumbnail
            thumbnail={item.thumbnail}
            size="square"
            className="bg-neutral-100 rounded-lg w-10 h-10"
        />

        <div className="flex flex-col gap-y-2 justify-between min-h-full self-stretch">
          <div className="flex flex-col">
            <span className="txt-medium-plus text-neutral-950">
              {item?.product_title}  <Badge color="green" size="2xsmall">Rent</Badge>
            </span>
            <span className="text-neutral-600 text-xs">
              {item?.variant_title}
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col-reverse items-end justify-between">
        <RentItemPrice
          className="hidden small:flex"
          item={item}
          style="tight"
          currencyCode={currencyCode}
        />
        <span className="self-end text-xs text-neutral-600 italic">
          {item.quantity}x
        </span>
      </div>
    </Container>
  )
}

export default RentItemPreview
