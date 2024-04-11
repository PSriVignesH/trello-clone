"use server"

import { auth } from "@clerk/nextjs"
import {InputType,ReturnType} from './types'
import prismadb from "@/lib/prismadb"
import { revalidatePath } from "next/cache"
import { CreateSafeAction } from "@/lib/createSafeAction"
import { UpdateListOrder } from "./schema"

const handler = async (data:InputType):Promise<ReturnType>=>{
  const {orgId,userId} = auth()

  if(!userId || !orgId){
    return {
      error:"Unauthorized"
    }
  }

  const {items,boardId} = data

  let lists

  try {
     const transaction = items.map((list)=>
      prismadb.list.update({
        where:{
          id:list.id,
          board:{
            orgId
          }
        },
        data:{
          order:list.order
        }
      }) 
    )

    lists = await prismadb.$transaction(transaction)
  } catch (error) {
     return {
      error:"Failed to reorder"
     }
  }

  revalidatePath(`/board/${boardId}`)
  return {data:lists}
}


export const updateListOrder = CreateSafeAction(UpdateListOrder,handler)