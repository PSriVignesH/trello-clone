"use server"

import { auth } from "@clerk/nextjs"
import {InputType,ReturnType} from './types'
import prismadb from "@/lib/prismadb"
import { revalidatePath } from "next/cache"
import { CreateSafeAction } from "@/lib/createSafeAction"
import { UpdateCardOrder } from "./schema"

const handler = async (data:InputType):Promise<ReturnType>=>{
  const {orgId,userId} = auth()

  if(!userId || !orgId){
    return {
      error:"Unauthorized"
    }
  }

  const {items,boardId} = data

  let updatedCards

  try {
    const transaction =items.map((card)=>
     prismadb.card.update({
      where:{
        id:card.id,
        list:{
          board:{
            orgId
          }
        }
      },
      data:{
        order:card.order,
        listId:card.listId
      }
     })
    )

    updatedCards = await prismadb.$transaction(transaction)
  } catch (error) {
     return {
      error:"Failed to reorder"
     }
  }

  revalidatePath(`/board/${boardId}`)
  return {data:updatedCards}
}


export const updateCardOrder = CreateSafeAction(UpdateCardOrder,handler)