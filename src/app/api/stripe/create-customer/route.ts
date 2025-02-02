/* import { stripe } from '@/lib/stripe'
import { StripeCustomerType } from '@/lib/types/stripe-customer.types'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    
  // Parse request body
  const { address, email, name, shipping }: StripeCustomerType = await req.json()

  // Check for missing required fields
  if (!email || !address || !name || !shipping) {
    return new NextResponse('Missing data', {
      status: 400,
    })
  }

  try {
    // Create Stripe customer
    const customer = await stripe.customers.create({
      email,
      name,
      address,
      shipping,
    })
    // Return customer ID in the response
    return NextResponse.json({ customerId: customer.id })
  } catch (error) {
    // Log detailed error information for debugging
    console.error('🔴 Error creating Stripe customer:', error)

    // Return an internal server error with a more detailed message
    return new NextResponse('Failed to create Stripe customer. Please try again later.', {
      status: 500,
    })
  }
}
 */