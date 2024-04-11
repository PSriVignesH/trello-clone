"use server"

import { auth } from "@clerk/nextjs"
import {InputType,ReturnType} from './types'
import prismadb from "@/lib/prismadb"
import { revalidatePath } from "next/cache"
import { CreateSafeAction } from "@/lib/createSafeAction"
import { UpdateList } from "./schema"
import { createAuditLog } from "@/lib/createAuditLog"
import { ACTION, ENTITY_TYPE } from "@prisma/client"

const handler = async (data:InputType):Promise<ReturnType>=>{
  const {orgId,userId} = auth()

  if(!userId || !orgId){
    return {
      error:"Unauthorized"
    }
  }

  const {title,id,boardId} = data

  let list

  try {
    list = await prismadb.list.update({
      where:{
        id,
        boardId,
        board:{
          orgId
        }
      },
      data:{
        title
      }
    })

    await createAuditLog({
      entityTitle:list.title,
      entityId:list.id,
      entityType:ENTITY_TYPE.LIST,
      action:ACTION.UPDATE
     })
  } catch (error) {
     return {
      error:"Failed to update"
     }
  }

  revalidatePath(`/board/${boardId}`)
  return {data:list}
}


export const updateList = CreateSafeAction(UpdateList,handler)