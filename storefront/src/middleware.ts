import { HttpTypes } from "@medusajs/types"
import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"

const regionMapCache = {
  regionMap: new Map<string, HttpTypes.StoreRegion>(),
  regionMapUpdated: Date.now(),
}

async function getRegionMap(cacheId: string) {
  const { regionMap, regionMapUpdated } = regionMapCache

  if (
    !regionMap.keys().next().value ||
    regionMapUpdated < Date.now() - 3600 * 1000
  ) {
    // Fetch regions from Medusa. We can't use the JS client here because middleware is running on Edge and the client needs a Node environment.
    const { regions } = await fetch(`${BACKEND_URL}/store/regions`, {
      headers: {
        "x-publishable-api-key": PUBLISHABLE_API_KEY!,
      },
      next: {
        revalidate: 3600,
        tags: [`regions-${cacheId}`],
      },
    }).then(async (response) => {
      const json = await response.json()

      if (!response.ok) {
        throw new Error(json.message)
      }

      return json
    })

    // const data: any = {
    //   regions: [
    //     {
    //       id: "reg_01JF9JP5GH9EVS7B5B3ER9DR0H",
    //       name: "Europe",
    //       currency_code: "eur",
    //       created_at: "2024-12-17T05:50:36.567Z",
    //       updated_at: "2024-12-17T05:50:36.567Z",
    //       deleted_at: null,
    //       metadata: null,
    //       countries: [
    //         {
    //           iso_2: "dk",
    //           iso_3: "dnk",
    //           num_code: "208",
    //           name: "DENMARK",
    //           display_name: "Denmark",
    //           region_id: "reg_01JF9JP5GH9EVS7B5B3ER9DR0H",
    //           metadata: null,
    //           created_at: "2024-12-17T05:50:34.438Z",
    //           updated_at: "2024-12-17T05:50:36.578Z",
    //           deleted_at: null,
    //         },
    //         {
    //           iso_2: "fr",
    //           iso_3: "fra",
    //           num_code: "250",
    //           name: "FRANCE",
    //           display_name: "France",
    //           region_id: "reg_01JF9JP5GH9EVS7B5B3ER9DR0H",
    //           metadata: null,
    //           created_at: "2024-12-17T05:50:34.439Z",
    //           updated_at: "2024-12-17T05:50:36.578Z",
    //           deleted_at: null,
    //         },
    //         {
    //           iso_2: "de",
    //           iso_3: "deu",
    //           num_code: "276",
    //           name: "GERMANY",
    //           display_name: "Germany",
    //           region_id: "reg_01JF9JP5GH9EVS7B5B3ER9DR0H",
    //           metadata: null,
    //           created_at: "2024-12-17T05:50:34.439Z",
    //           updated_at: "2024-12-17T05:50:36.577Z",
    //           deleted_at: null,
    //         },
    //         {
    //           iso_2: "it",
    //           iso_3: "ita",
    //           num_code: "380",
    //           name: "ITALY",
    //           display_name: "Italy",
    //           region_id: "reg_01JF9JP5GH9EVS7B5B3ER9DR0H",
    //           metadata: null,
    //           created_at: "2024-12-17T05:50:34.440Z",
    //           updated_at: "2024-12-17T05:50:36.578Z",
    //           deleted_at: null,
    //         },
    //         {
    //           iso_2: "es",
    //           iso_3: "esp",
    //           num_code: "724",
    //           name: "SPAIN",
    //           display_name: "Spain",
    //           region_id: "reg_01JF9JP5GH9EVS7B5B3ER9DR0H",
    //           metadata: null,
    //           created_at: "2024-12-17T05:50:34.442Z",
    //           updated_at: "2024-12-17T05:50:36.578Z",
    //           deleted_at: null,
    //         },
    //         {
    //           iso_2: "se",
    //           iso_3: "swe",
    //           num_code: "752",
    //           name: "SWEDEN",
    //           display_name: "Sweden",
    //           region_id: "reg_01JF9JP5GH9EVS7B5B3ER9DR0H",
    //           metadata: null,
    //           created_at: "2024-12-17T05:50:34.442Z",
    //           updated_at: "2024-12-17T05:50:36.578Z",
    //           deleted_at: null,
    //         },
    //         {
    //           iso_2: "gb",
    //           iso_3: "gbr",
    //           num_code: "826",
    //           name: "UNITED KINGDOM",
    //           display_name: "United Kingdom",
    //           region_id: "reg_01JF9JP5GH9EVS7B5B3ER9DR0H",
    //           metadata: null,
    //           created_at: "2024-12-17T05:50:34.442Z",
    //           updated_at: "2024-12-17T05:50:36.578Z",
    //           deleted_at: null,
    //         },
    //       ],
    //     },
    //   ],
    //   count: 1,
    //   offset: 0,
    //   limit: 50,
    // }

    if (!regions?.length) {
      throw new Error(
        "No regions found. Please set up regions in your Medusa Admin."
      )
    }

    // Create a map of country codes to regions.
    regions.forEach((region: HttpTypes.StoreRegion) => {
      region.countries?.forEach((c) => {
        regionMapCache.regionMap.set(c.iso_2 ?? "", region)
      })
    })

    regionMapCache.regionMapUpdated = Date.now()
  }

  return regionMapCache.regionMap
}

/**
 * Fetches regions from Medusa and sets the region cookie.
 * @param request
 * @param response
 */
async function getCountryCode(
  request: NextRequest,
  regionMap: Map<string, HttpTypes.StoreRegion | number>
) {
  try {
    let countryCode

    const vercelCountryCode = request.headers
      .get("x-vercel-ip-country")
      ?.toLowerCase()

    const urlCountryCode = request.nextUrl.pathname.split("/")[1]?.toLowerCase()

    if (urlCountryCode && regionMap.has(urlCountryCode)) {
      countryCode = urlCountryCode
    } else if (vercelCountryCode && regionMap.has(vercelCountryCode)) {
      countryCode = vercelCountryCode
    } else if (regionMap.has(DEFAULT_REGION)) {
      countryCode = DEFAULT_REGION
    } else if (regionMap.keys().next().value) {
      countryCode = regionMap.keys().next().value
    }

    return countryCode
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error(
        "Middleware.ts: Error getting the country code. Did you set up regions in your Medusa Admin and define a NEXT_PUBLIC_MEDUSA_BACKEND_URL environment variable?"
      )
    }
  }
}

async function setCacheId(request: NextRequest, response: NextResponse) {
  const cacheId = request.nextUrl.searchParams.get("_medusa_cache_id")

  if (cacheId) {
    return cacheId
  }

  const newCacheId = crypto.randomUUID()
  response.cookies.set("_medusa_cache_id", newCacheId, { maxAge: 60 * 60 * 24 })
  return newCacheId
}

/**
 * Middleware to handle region selection and cache id.
 */
export async function middleware(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const cartId = searchParams.get("cart_id")
  const checkoutStep = searchParams.get("step")
  const cacheIdCookie = request.cookies.get("_medusa_cache_id")
  const cartIdCookie = request.cookies.get("_medusa_cart_id")

  let redirectUrl = request.nextUrl.href

  let response = NextResponse.redirect(redirectUrl, 307)

  // Set a cache id to invalidate the cache for this instance only
  const cacheId = await setCacheId(request, response)

  const regionMap = await getRegionMap(cacheId)

  const countryCode = regionMap && (await getCountryCode(request, regionMap))

  const urlHasCountryCode =
    countryCode && request.nextUrl.pathname.split("/")[1].includes(countryCode)

  // check if one of the country codes is in the url
  if (urlHasCountryCode && (!cartId || cartIdCookie) && cacheIdCookie) {
    return NextResponse.next()
  }

  // check if the url is a static asset
  if (request.nextUrl.pathname.includes(".")) {
    return NextResponse.next()
  }

  const redirectPath =
    request.nextUrl.pathname === "/" ? "" : request.nextUrl.pathname

  const queryString = request.nextUrl.search ? request.nextUrl.search : ""

  // If no country code is set, we redirect to the relevant region.
  if (!urlHasCountryCode && countryCode) {
    redirectUrl = `${request.nextUrl.origin}/${countryCode}${redirectPath}${queryString}`
    response = NextResponse.redirect(`${redirectUrl}`, 307)
  }

  // If a cart_id is in the params, we set it as a cookie and redirect to the address step.
  if (cartId && !checkoutStep) {
    redirectUrl = `${redirectUrl}&step=address`
    response = NextResponse.redirect(`${redirectUrl}`, 307)
    response.cookies.set("_medusa_cart_id", cartId, { maxAge: 60 * 60 * 24 })
  }

  return response
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp).*)",
  ],
}
