import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

const DAY_IN_MS = 86_400_000

export const checkSubscription = async()=>{
  const {orgId} = auth()

  if(!orgId){
    return false
  }

  const orgSubscription = await prismadb.orgSubscription.findUnique({
    where:{
      orgId
    },
    select:{
      stripeSubsriptionId:true,
      stripeCurrentPeriodEnd:true,
      stripeCustomerId:true,
      stripePriceId:true
    }
  })

  if(!orgSubscription){
    return false
  }

  const isValid = orgSubscription.stripePriceId && orgSubscription.stripeCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now()

  return !!isValid
}