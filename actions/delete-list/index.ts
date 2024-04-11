"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs"

import { CreateSafeAction } from "@/lib/createSafeAction"
import prismadb from "@/lib/prismadb"


import {InputType,ReturnType} from './types'
import { DeleteList } from "./schema"
import { createAuditLog } from "@/lib/createAuditLog"
import { ACTION, ENTITY_TYPE } from "@prisma/client"

const handler = async (data:InputType):Promise<ReturnType>=>{
  const {orgId,userId} = auth()

  if(!userId || !orgId){
    return {
      error:"Unauthorized"
    }
  }

  const {id,boardId} = data

  let list

  try {
    list = await prismadb.list.delete({
      where:{
        id,
        boardId,
        board:{
          orgId
        }
      }
    })

    await createAuditLog({
      entityTitle:list.title,
      entityId:list.id,
      entityType:ENTITY_TYPE.LIST,
      action:ACTION.DELETE
     })
  } catch (error) {
     return {
      error:"Failed to delete"
     }
  }

  revalidatePath(`/board/${boardId}`)
  return {data:list}
}


export const deleteList = CreateSafeAction(DeleteList,handler)