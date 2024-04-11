"use server"

import { auth } from "@clerk/nextjs"
import {InputType,ReturnType} from './types'
import prismadb from "@/lib/prismadb"
import { revalidatePath } from "next/cache"
import { CreateSafeAction } from "@/lib/createSafeAction"
import { CreateCard } from "./schema"
import { createAuditLog } from "@/lib/createAuditLog"
import { ACTION, ENTITY_TYPE } from "@prisma/client"

const handler = async (data:InputType):Promise<ReturnType>=>{
  const {orgId,userId} = auth()

  if(!userId || !orgId){
    return {
      error:"Unauthorized"
    }
  }

  const {title,boardId,listId} = data
  let card



  try {
   const list = await prismadb.list.findUnique({
    where:{
      id:listId,
      board:{
        orgId
      }
    }
   })

   if(!list){
    return {
      error:"List not found"
    }
   }


   const lastCard = await prismadb.card.findFirst({
    where:{
      listId
    },
    orderBy:{
      order:"desc"
    },
    select:{
      order:true
    }
   })

   const newOrder = lastCard ? lastCard.order + 1: 1 

   card = await prismadb.card.create({
     data:{
      title,
      listId,
      order:newOrder
     }
   })

   await createAuditLog({
      entityId:card.id,
      entityTitle:card.title,
      entityType:ENTITY_TYPE.CARD,
      action:ACTION.CREATE
   })
  } catch (error) {
     return {
      error:"Failed to create"
     }
  }

  revalidatePath(`/board/${boardId}`)
  return {data:card}
}


export const createCard= CreateSafeAction(CreateCard,handler)