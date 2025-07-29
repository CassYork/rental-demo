import { addToCartEventBus } from "@lib/data/cart-event-bus"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes, StoreProduct, StoreProductVariant } from "@medusajs/types"
import { clx, DatePicker, Select, Table, Text } from "@medusajs/ui"
import Button from "@modules/common/components/button"
import ShoppingBag from "@modules/common/icons/shopping-bag"
import { useState } from "react"
import BulkTableQuantity from "../bulk-table-quantity"

const durationOptions = [
  {
    id: "pt001",
    duration: "1 day"
  },
  {
    id: "pt002",
    duration: "1 week"
  },
  {
    id: "pt003",
    duration: "2 weeks"
  },
  {
    id: "pt004",
    duration: "1 month"
  },
]
const ProductRentVariantsTable = ({
  product,
  region,
}: {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
}) => {
  const [isAdding, setIsAdding] = useState(false)
  const [lineItemsMap, setLineItemsMap] = useState<
    Map<
      string,
      StoreProductVariant & {
        product: StoreProduct
        quantity: number
      }
    >
  >(new Map())

  const [duration, setDuration] = useState<string | undefined>(
    durationOptions[0].duration
  )
  const [rentDate, setRentDate] = useState<Date | null>(null)

  const totalQuantity = Array.from(lineItemsMap.values()).reduce(
    (acc, curr) => acc + curr.quantity,
    0
  )

  const handleQuantityChange = (variantId: string, quantity: number) => {
    setLineItemsMap((prev) => {
      const newLineItems = new Map(prev)

      if (!prev.get(variantId)) {
        newLineItems.set(variantId, {
          ...product.variants?.find((v) => v.id === variantId)!,
          product,
          quantity,
        })
      } else {
        newLineItems.set(variantId, {
          ...prev.get(variantId)!,
          quantity,
        })
      }

      return newLineItems
    })
  }

  const handleDurationChange = (value: string) => setDuration(value)

  const handleDateChange = (value: Date | null) => {
    if(value) {
        setRentDate(value)
    }
  }

  const handleAddToCart = async () => {
    setIsAdding(true)

    const lineItems = Array.from(lineItemsMap.entries()).map(
      ([variantId, { quantity, ...variant }]) => {

        const productVariant = {...variant} as StoreProductVariant & {
          product: StoreProduct,
          rental_prices: any[]
        }

        const rentPrice = productVariant?.rental_prices?.find(
            (v: any) => v?.duration === duration
        )

        return {
            productVariant,
            quantity,
            duration: duration as string,
            rentDate: rentDate as Date,
            rentPrice: rentPrice?.price as number
        }
      }
    )

    addToCartEventBus.emitRentCartAdd({
      lineItems,
      regionId: region.id
    })

    setIsAdding(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="overflow-x-auto p-px">
        <Table className="w-full rounded-xl overflow-hidden shadow-borders-base border-none ">
          <Table.Header className="border-t-0">
            <Table.Row className="bg-neutral-100 border-none hover:!bg-neutral-100">
              <Table.HeaderCell className="px-4">SKU</Table.HeaderCell>

              {product.options?.map((option) => {
                if (option.title === "Default option") {
                  return null
                }
                return (
                  <Table.HeaderCell key={option.id} className="px-4 border-x">
                    {option.title}
                  </Table.HeaderCell>
                )
              })}

              <Table.HeaderCell className="px-4 border-x">
                Price
              </Table.HeaderCell>

              <Table.HeaderCell className="px-4 border-x">
                Duration
              </Table.HeaderCell>

              <Table.HeaderCell className="px-4">Quantity</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body className="border-none">
            {product.variants?.map((variant: any, index) => {

              const rentPrice = variant?.rental_prices?.find(
                (v: any) => v.duration === duration
              )

              if(!rentPrice) {
                return null
              }

              const { rentPrice: rentalPrice } = getProductPrice({
                product,
                variantId: variant.id,
                duration,
              })

              return (
                <Table.Row
                  key={variant.id}
                  className={clx({
                    "border-b-0": index === product.variants?.length! - 1,
                  })}
                >
                  <Table.Cell className="px-4">{variant.sku}</Table.Cell>

                  {variant.options?.map((option: any, index: number) => {
                    if (option.value === "Default option value") {
                      return null
                    }
                    return (
                      <Table.Cell key={option.id} className="px-4 border-x">
                        {option.value}
                      </Table.Cell>
                    )
                  })}

                  <Table.Cell className="px-4 border-x">
                    {rentalPrice?.calculated_price}
                  </Table.Cell>

                  <Table.Cell className="px-4 border-x">
                    {rentPrice?.duration}
                  </Table.Cell>

                  <Table.Cell className="pl-1 !pr-1">
                    <BulkTableQuantity
                      variantId={variant.id}
                      onChange={handleQuantityChange}
                    />
                  </Table.Cell>
                </Table.Row>
              )
            })}
          </Table.Body>
        </Table>
      </div>

      <Text className="font-medium text-xl">Booking Details</Text>

      <Select onValueChange={handleDurationChange} value={duration}>
        <Select.Trigger>
          <Select.Value placeholder="Placeholder" />
        </Select.Trigger>
        <Select.Content>
          {durationOptions.map((item) => (
            <Select.Item key={item.id} value={item.duration}>
              {item.duration}
            </Select.Item>
          ))}
        </Select.Content>
      </Select>

      <DatePicker size="base" modal={false} onChange={handleDateChange} />

      <Button
        onClick={handleAddToCart}
        variant="primary"
        className="w-full h-10"
        isLoading={isAdding}
        disabled={totalQuantity === 0 || !rentDate}
        data-testid="add-product-button"
      >
        <ShoppingBag
          className="text-white"
          fill={totalQuantity === 0 ? "none" : "#fff"}
        />
        {totalQuantity === 0
          ? "Choose product variant(s) above"
          : "Add to cart"}
      </Button>
    </div>
  )
}

export default ProductRentVariantsTable
