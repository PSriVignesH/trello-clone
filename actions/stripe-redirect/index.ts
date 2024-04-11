"use server"

import { auth, currentUser } from "@clerk/nextjs"

import { CreateSafeAction } from "@/lib/createSafeAction"
import prismadb from "@/lib/prismadb"
import { absoluteUrl } from "@/lib/utils"
import { stripe } from "@/lib/stripe"


import {InputType,ReturnType} from './types'
import { StripeRedirect } from "./schema"
import { revalidatePath } from "next/cache"

const handler = async (data:InputType):Promise<ReturnType>=>{
  const {orgId,userId} = auth()
  const user = await currentUser()

  if(!userId || !orgId){
    return {
      error:"Unauthorized"
    }
  }

   const settingsUrl = absoluteUrl(`/organization/${orgId}`) 

   let url = ""

   try {

     const orgSubscription = await prismadb.orgSubscription.findUnique({
      where:{
        orgId
      }
     })
   
     if(orgSubscription && orgSubscription.stripeCustomerId){
       const stripeSession = await stripe.billingPortal.sessions.create({
        customer:orgSubscription.stripeCustomerId,
        return_url:settingsUrl
       })

       url =stripeSession.url
     } else{
      const stripeSession = await stripe.checkout.sessions.create({
        success_url:settingsUrl,
        cancel_url:settingsUrl,
        payment_method_types:["card"],
        mode:"subscription",
        billing_address_collection:"auto",
        customer_email:user?.emailAddresses[0].emailAddress,
        line_items:[
          {
            price_data:{
              currency:"USD",
              product_data:{
                name:"Taskify Pro",
                description:"Unlimited boards for your organization"
              },
              unit_amount:2000,
              recurring:{
                interval:"month"
              }
            },
            quantity:1
          }
        ],
        metadata:{
          orgId
        }
      })
      url = stripeSession.url || ""
     }

   } catch (error) {
    return {
      error:"Something went wrong"
    }
   }

   revalidatePath(`/organization/%{orgId}`)
   return {data:url}
}
export const stripeRedirect = CreateSafeAction(StripeRedirect,handler)