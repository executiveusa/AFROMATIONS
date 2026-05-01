// Print-on-Demand Service Integration
// Supports both Printify and Printful APIs

export interface PrintPODProduct {
  id: string
  name: string
  printifyId?: string
  printfulId?: string
  variants: PrintPODVariant[]
}

export interface PrintPODVariant {
  id: string
  size?: string
  color?: string
  printifyVariantId?: string
  printfulVariantId?: string
}

export interface PrintOrder {
  id: string
  orderId: string
  service: 'printify' | 'printful'
  externalOrderId: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  trackingUrl?: string
  createdAt: Date
}

// Printify API Client
class PrintifyClient {
  private apiKey: string
  private apiUrl = 'https://api.printify.com/v1'
  private shopId: string

  constructor(apiKey: string, shopId: string) {
    this.apiKey = apiKey
    this.shopId = shopId
  }

  async createOrder(orderData: {
    lineItems: Array<{
      productId: string
      variantId: string
      quantity: number
    }>
    shippingAddress: {
      name: string
      email: string
      address1: string
      city: string
      state: string
      zip: string
      country: string
    }
  }) {
    try {
      const response = await fetch(
        `${this.apiUrl}/shops/${this.shopId}/orders.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            line_items: orderData.lineItems.map((item) => ({
              product_id: item.productId,
              variant_id: item.variantId,
              quantity: item.quantity,
            })),
            shipping_address: {
              first_name: orderData.shippingAddress.name.split(' ')[0],
              last_name: orderData.shippingAddress.name.split(' ').slice(1).join(' '),
              email: orderData.shippingAddress.email,
              line1: orderData.shippingAddress.address1,
              city: orderData.shippingAddress.city,
              state: orderData.shippingAddress.state,
              zip: orderData.shippingAddress.zip,
              country: orderData.shippingAddress.country,
            },
          }),
        }
      )

      if (!response.ok) {
        throw new Error(`Printify API error: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('[v0] Printify order creation failed:', error)
      throw error
    }
  }

  async getOrderStatus(orderId: string) {
    try {
      const response = await fetch(
        `${this.apiUrl}/shops/${this.shopId}/orders/${orderId}.json`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error(`Printify API error: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('[v0] Printify status check failed:', error)
      throw error
    }
  }

  async getProducts() {
    try {
      const response = await fetch(
        `${this.apiUrl}/shops/${this.shopId}/products.json`,
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error(`Printify API error: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('[v0] Printify products fetch failed:', error)
      throw error
    }
  }
}

// Printful API Client
class PrintfulClient {
  private apiKey: string
  private apiUrl = 'https://api.printful.com'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  async createOrder(orderData: {
    externalId: string
    shipping: string
    items: Array<{
      sync_product_id: number
      sync_variant_id: number
      quantity: number
    }>
    recipient: {
      name: string
      email: string
      address1: string
      city: string
      state_code: string
      zip: string
      country_code: string
    }
  }) {
    try {
      const response = await fetch(`${this.apiUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          external_id: orderData.externalId,
          shipping: orderData.shipping,
          items: orderData.items,
          recipient: orderData.recipient,
        }),
      })

      if (!response.ok) {
        throw new Error(`Printful API error: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('[v0] Printful order creation failed:', error)
      throw error
    }
  }

  async getOrderStatus(orderId: number) {
    try {
      const response = await fetch(`${this.apiUrl}/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Printful API error: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('[v0] Printful status check failed:', error)
      throw error
    }
  }

  async getProducts() {
    try {
      const response = await fetch(`${this.apiUrl}/products`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Printful API error: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error('[v0] Printful products fetch failed:', error)
      throw error
    }
  }
}

// Export singleton instances (will be initialized with env vars)
export const printifyClient = new PrintifyClient(
  process.env.PRINTIFY_API_KEY || '',
  process.env.PRINTIFY_SHOP_ID || ''
)

export const printfulClient = new PrintfulClient(
  process.env.PRINTFUL_API_KEY || ''
)

// Helper function to route orders to appropriate service
export async function createPrintOrder(
  service: 'printify' | 'printful',
  orderData: any
) {
  if (service === 'printify') {
    return await printifyClient.createOrder(orderData)
  } else {
    return await printfulClient.createOrder(orderData)
  }
}

export async function getPrintOrderStatus(
  service: 'printify' | 'printful',
  orderId: string | number
) {
  if (service === 'printify') {
    return await printifyClient.getOrderStatus(orderId as string)
  } else {
    return await printfulClient.getOrderStatus(orderId as number)
  }
}
