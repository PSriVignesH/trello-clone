"use server"

import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { auth } from "@clerk/nextjs"

import { CreateSafeAction } from "@/lib/createSafeAction"
import prismadb from "@/lib/prismadb"
import { ACTION, ENTITY_TYPE } from "@prisma/client"
import { createAuditLog } from "@/lib/createAuditLog"
import { decreaseAvailableCount } from "@/lib/orgLimit"

import {InputType,ReturnType} from './types'
import { DeleteBoard } from "./schema"
import { checkSubscription } from "@/lib/subscription"

const handler = async (data:InputType):Promise<ReturnType>=>{
  const {orgId,userId} = auth()
  const isPro = await checkSubscription()

  if(!userId || !orgId){
    return {
      error:"Unauthorized"
    }
  }

  const {id} = data

  let board

  try {
    board = await prismadb.board.delete({
      where:{
        id,
        orgId
      }
    })
    
    if(!isPro){
      await decreaseAvailableCount()
    }

    await createAuditLog({
      entityTitle:board.title,
      entityId:board.id,
      entityType:ENTITY_TYPE.BOARD,
      action:ACTION.DELETE
     })
  } catch (error) {
     return {
      error:"Failed to delete"
     }
  }

  revalidatePath(`/organization/${orgId}`)
  redirect(`/organization/${orgId}`)
}


export const deleteBoard = CreateSafeAction(DeleteBoard,handler)