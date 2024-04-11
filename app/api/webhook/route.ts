import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";

import { stripe } from "@/lib/stripe";
import prismadb from "@/lib/prismadb";

export async function POST(req:Request){
  const body = await req.text()

  const signature = headers().get("Stripe-Signature") as string

  let event :Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    )
  } catch (error) {
    return new NextResponse("Webhook error",{status:400})
  }

  const session = event.data.object as Stripe.Checkout.Session 

  if(event.type === "checkout.session.completed"){

    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    )

    
  if(!session?.metadata?.orgId){
    return new NextResponse("Org ID is required",{status:400})
  }

  await prismadb.orgSubscription.create({
    data:{
      orgId:session?.metadata?.orgId,
      stripeSubsriptionId:subscription.id,
      stripeCustomerId:subscription.customer as string,
      stripePriceId:subscription.items.data[0].price.id,
      stripeCurrentPeriodEnd: new Date (
        subscription.current_period_end * 1000
       )
       }
     })
  }

  if(event.type === "invoice.payment_succeeded"){
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    )

    await prismadb.orgSubscription.update({
      where:{
        stripeSubsriptionId:subscription.id
      },
      data:{
        stripePriceId:subscription.items.data[0].id,
        stripeCurrentPeriodEnd:new Date(
          subscription.current_period_end * 1000
        )
      }
    })
  }

  return new NextResponse(null,{status:200})
}