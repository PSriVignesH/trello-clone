"use server"
import { auth } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";

import { InputType, ReturnType } from "./types";
import prismadb from "@/lib/prismadb";
import { CreateSafeAction } from "@/lib/createSafeAction";
import { CreateBoard } from "./schema";
import { createAuditLog } from "@/lib/createAuditLog";
import { ACTION, ENTITY_TYPE } from "@prisma/client";
import { incrementAvailableCount,hasAvailableCount } from "@/lib/orgLimit";
import { checkSubscription } from "@/lib/subscription";



const handler = async (data:InputType):Promise<ReturnType>=>{
  const {userId,orgId} = auth()

  if(!userId || !orgId){
    return {
      error:"Unauthorized"
    }
  }
  
  const canCreate = await hasAvailableCount()
  const isPro = await checkSubscription()
  
  if(!canCreate && !isPro){
    return {
      error:"You have reached your limit of free boards .Please upgrade to create more. "
    }
  }
  const {title,image} = data

  const [
    imageId,
    imageThumbUrl,
    imageFullUrl,
    imageLinkHtml,
    imageUserName,
  ] = image.split("|")

 
if(!imageId || !imageThumbUrl || !imageFullUrl ||  !imageUserName || !imageLinkHtml){
  return {
    error:"Missing Fields.Failed to create board"
  }
}

  let board

  try {
    board = await prismadb.board.create({
    data:{
      title,
      orgId,
      imageId,
      imageThumbUrl,
      imageFullUrl,
      imageUserName,
      imageLinkHtml
    }
    })
    
    if(!isPro){
      await incrementAvailableCount()
    }
   
    await createAuditLog({
      entityTitle:board.title,
      entityId:board.id,
      entityType:ENTITY_TYPE.BOARD,
      action:ACTION.CREATE
     })
  } catch (error) {
    return {
      error:"Failed to create"
    }
  }

  revalidatePath(`/board/${board.id}`);
  return {data:board}
}


export const createBoard = CreateSafeAction(CreateBoard,handler)