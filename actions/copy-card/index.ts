"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs"

import { CreateSafeAction } from "@/lib/createSafeAction"
import prismadb from "@/lib/prismadb"
import { createAuditLog } from "@/lib/createAuditLog"
import { ACTION, ENTITY_TYPE } from "@prisma/client"


import {InputType,ReturnType} from './types'
import { CopyCard } from "./schema"

const handler = async (data:InputType):Promise<ReturnType>=>{
  const {orgId,userId} = auth()

  if(!userId || !orgId){
    return {
      error:"Unauthorized"
    }
  }

  const {id,boardId} = data

  let card

  try {

   const cardToCopy = await prismadb.card.findUnique({
     where:{
      id,
      list:{
        board:{
          orgId
        }
      }
     }
   })
  
   if(!cardToCopy){
    return{error:"Card not found"}
   }
  
   const lastCard = await prismadb.card.findFirst({
    where:{
      listId:cardToCopy.listId,
    },
    orderBy:{
      order:"desc"
    },
    select:{
      order:true
    }
   })

   const newOrder =lastCard ? lastCard.order + 1 : 1

   card = await prismadb.card.create({
    data:{
      title: `${cardToCopy.title} - Copy`,
      description:cardToCopy.description,
      order:newOrder,
      listId:cardToCopy.listId
    }
   })

   await createAuditLog({
    entityTitle:card.title,
    entityId:card.id,
    entityType:ENTITY_TYPE.CARD,
    action:ACTION.CREATE
   })
}catch(error){
  return{
    error:"Failed to copy"
  }
}
revalidatePath(`/board/${boardId}`);
return {data:card}
}
export const copyCard = CreateSafeAction(CopyCard,handler)