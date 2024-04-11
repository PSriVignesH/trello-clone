"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs"

import { CreateSafeAction } from "@/lib/createSafeAction"
import prismadb from "@/lib/prismadb"
import { createAuditLog } from "@/lib/createAuditLog"
import { ACTION, ENTITY_TYPE } from "@prisma/client"

import {InputType,ReturnType} from './types'
import { CopyList } from "./schema"

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
  const listToCopy = await await prismadb.list.findUnique({
    where:{
      id,
      boardId,
      board:{
        orgId
      }
    },
    include:{
      cards:true
    }
  })

  if(!listToCopy){
    return {error:"List not found"}
  }

  const lastList = await prismadb.list.findFirst({
    where:{
      boardId
    },
    orderBy:{
      order:"desc"
    },
    select:{
      order:true
    }
  })
  
  const newOrder = lastList ? lastList.order + 1 :1

 list = await prismadb.list.create({
   data:{
    boardId:listToCopy.boardId,
    title:`${listToCopy.title} - Copy`,
    order:newOrder,
    cards:{
      createMany:{
        data:listToCopy.cards.map((card)=>({
          title:card.title,
          description:card.description,
          order:card.order
        }))
      }
    }
   },
   include:{
    cards:true
   }
 })

 await createAuditLog({
  entityTitle:list.title,
  entityId:list.id,
  entityType:ENTITY_TYPE.LIST,
  action:ACTION.CREATE
 })
 
}catch(error){
  return{
    error:"Failed to copy"
  }
}
revalidatePath(`/board/${boardId}`)
  return {data:list}
}
export const copyList = CreateSafeAction(CopyList,handler)