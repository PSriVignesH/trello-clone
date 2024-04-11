"use server"

import { auth } from "@clerk/nextjs"
import {InputType,ReturnType} from './types'
import prismadb from "@/lib/prismadb"
import { revalidatePath } from "next/cache"
import { CreateSafeAction } from "@/lib/createSafeAction"
import { UpdateCard } from "./schema"
import { createAuditLog } from "@/lib/createAuditLog"
import { ACTION, ENTITY_TYPE } from "@prisma/client"

const handler = async (data:InputType):Promise<ReturnType>=>{
  const {orgId,userId} = auth()

  if(!userId || !orgId){
    return {
      error:"Unauthorized"
    }
  }

  const {id,boardId,...values} = data

  let card

  try {
    card = await prismadb.card.update({
      where:{
        id,
        list:{
          board:{
            orgId
          }
        }
      },
      data:{
        ...values
      }
    })

    await createAuditLog({
      entityTitle:card.title,
      entityId:card.id,
      entityType:ENTITY_TYPE.CARD,
      action:ACTION.UPDATE
     })
  } catch (error) {
     return {
      error:"Failed to update"
     }
  }

  revalidatePath(`/board/${boardId}`)
  return {data:card}
}


export const updateCard = CreateSafeAction(UpdateCard,handler)