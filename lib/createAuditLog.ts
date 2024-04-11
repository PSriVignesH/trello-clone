import { auth, currentUser } from "@clerk/nextjs";
import {ACTION,ENTITY_TYPE} from '@prisma/client'
import prismadb from "@/lib/prismadb";


interface Props{
  entityId:string,
  entityType:ENTITY_TYPE,
  entityTitle:string,
  action:ACTION
}


export const createAuditLog =async (props:Props)=>{
  try {
     const {orgId} = auth()
     const user = await currentUser()

     if(!user || !orgId){
       throw new Error("User not found")
     }

     const {entityId,entityType,entityTitle,action} = props

     await prismadb.auditLog.create({
       data:{
        orgId,
        entityId,
        entityType,
        entityTitle,
        action,
        userId:user.id,
        userImage:user.imageUrl,
        userName:user?.firstName + "" + user?.lastName
       }
     })
  } catch (error) {
    console.log("[AUDIT_LOG_ERROR]",error);
    
  }
}