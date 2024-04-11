"use server"

import { auth } from "@clerk/nextjs"
import { revalidatePath } from "next/cache"


import prismadb from "@/lib/prismadb"
import { CreateSafeAction } from "@/lib/createSafeAction"
import { createAuditLog } from "@/lib/createAuditLog"
import { ACTION, ENTITY_TYPE } from "@prisma/client"

import { CreateList } from "./schema"
import {InputType,ReturnType} from './types'

const handler = async (data:InputType):Promise<ReturnType>=>{
  const {orgId,userId} = auth()

  if(!userId || !orgId){
    return {
      error:"Unauthorized"
    }
  }

  const {title,boardId} = data
  let list

  let board

  try {
    const board =await prismadb.board.findUnique({
      where:{
        id:boardId,
        orgId
      }
    })

    if(!board){
      return{
        error:"Board not found"
      }
    }
    const lastList = await prismadb.list.findFirst({
      where:{boardId:boardId},
      orderBy:{order:"desc"},
      select:{order:true}
    })   
   
    const newOrder = lastList ? lastList.order + 1 : 1
    list = await prismadb.list.create({
      data:{
        title,
        boardId,
        order:newOrder
      }
    })

    await createAuditLog({
      entityTitle:list.title,
      entityId:list.id,
      entityType:ENTITY_TYPE.LIST,
      action:ACTION.CREATE
     })
  } catch (error) {
     return {
      error:"Failed to create"
     }
  }

  revalidatePath(`/board/${boardId}`)
  return {data:list}
}


export const createList = CreateSafeAction(CreateList,handler)