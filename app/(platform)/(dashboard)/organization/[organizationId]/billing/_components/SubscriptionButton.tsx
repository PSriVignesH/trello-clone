"use client"

import { toast } from "sonner"

import { stripeRedirect } from "@/actions/stripe-redirect"
import { Button } from "@/components/ui/button"
import { useAction } from "@/hooks/useAction"
import { useProModal } from "@/hooks/useProModal"

interface SubscriptionButtonProps{
  isPro:boolean
}

const SubscriptionButton = ({isPro}:SubscriptionButtonProps) => {
const proModal =useProModal()
  const {execute,isLoading} = useAction(stripeRedirect,{
    onSuccess:(data)=>{
       window.location.href = data as string
    },
    onError:(error)=>{
      toast.error(error)
    },
  })


  const onClick =()=>{
    if(isPro){
      execute({})
    }
    else{
      proModal.onOpen()
    }
  }
  return (
    <Button
      variant="primary"
      disabled={isLoading}
      onClick={onClick}
    >
      {isPro ? "Manage Subscription" : "Upgrade to Pro"}
    </Button>
  )
}

export default SubscriptionButton