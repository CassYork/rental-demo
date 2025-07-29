"use client"

import { useCart } from "@lib/context/cart-context"
import { HttpTypes } from "@medusajs/types"
import { Badge, clx, Container, Input } from "@medusajs/ui"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"
import Thumbnail from "@modules/products/components/thumbnail"
import { startTransition, useEffect, useState } from "react"
import AddNoteButton from "../add-note-button"
import RentItemPrice from "@modules/common/components/rent-item-price"
import { format } from "date-fns"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem | any
  showBorders?: boolean
  currencyCode: string
}

const RentItemFull = ({ item, showBorders = true, currencyCode }: ItemProps) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [quantity, setQuantity] = useState(item.quantity.toString())

  const { handleDeleteRentItem, handleUpdateCartQuantity } = useCart()

  const changeQuantity = async (newQuantity: number) => {
    setError(null)
    // setUpdating(true)

    startTransition(() => {
      setQuantity(newQuantity.toString())
    })

    // await handleUpdateCartQuantity(item.id, Number(newQuantity))
  }

  useEffect(() => {
    setQuantity(item.quantity.toString())
  }, [item.quantity])

  const handleBlur = (value: number) => {
    if (value === item.quantity) {
      return
    }

    if (value > maxQuantity) {
      changeQuantity(maxQuantity)
    }

    if (value < 1) {
      setUpdating(true)
      handleDeleteRentItem(item.id)
      setUpdating(false)
    }

    changeQuantity(value)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      changeQuantity(Number(quantity))
    }

    if (e.key === "ArrowUp" && e.shiftKey) {
      e.preventDefault()
      setQuantity((Number(quantity) + 10).toString())
    }

    if (e.key === "ArrowDown" && e.shiftKey) {
      e.preventDefault()
      setQuantity((Number(quantity) - 10).toString())
    }
  }

  const maxQuantity = item?.variant?.inventory_quantity ?? 100

  return (
    <Container
      className={clx("flex gap-4 w-full h-full items-center justify-between", {
        "shadow-none": !showBorders,
      })}
    >
      <div className="flex gap-x-4 items-start">
        <Thumbnail
            thumbnail={item.thumbnail}
            size="square"
            type="full"
            className="bg-neutral-100 rounded-lg w-20 h-20"
        />
        <div className="flex flex-col gap-y-2 justify-between min-h-full self-stretch">
          <div className="flex flex-col">

            <span className="text-neutral-600 text-[0.6rem]">BRAND</span>

            <span className="txt-medium-plus text-neutral-950">
              {item?.product_title}
            </span>
            <span className="text-neutral-600 text-xs">
              {item?.variant_title}
            </span>

            <span className="text-neutral-600">
              {item?.quantity}x
            </span>

            <div className="flex gap-x-3 mt-2">
                <Badge color="green" size="2xsmall">{item?.rent_duration}</Badge>
                <Badge color="blue" size="2xsmall">{ format(new Date(item?.rent_date), 'PP')}</Badge>
            </div>
            
            
          </div>
          <div className="flex small:flex-row flex-col gap-2">
            <RentItemPrice
              className="flex small:hidden self-start"
              item={item}
              currencyCode={currencyCode}
            />

            <div className="flex gap-x-2">
              <DeleteButton id={item.id} for_rent={true} />
            </div>

            {/* <AddNoteButton item={item as HttpTypes.StoreCartLineItem} /> */}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-start justify-between min-h-full self-stretch">
        <RentItemPrice
            className="hidden small:flex"
            item={item as any}
            currencyCode={currencyCode}
            style="default"
        />
      </div>
    </Container>
  )
}

export default RentItemFull
