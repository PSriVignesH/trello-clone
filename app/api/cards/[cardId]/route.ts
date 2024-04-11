import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";


export async function GET(req:Request,{params}:{params:{cardId:string}}){
  try {
      const {userId,orgId} = auth()

    if(!userId || !orgId){
      return new NextResponse("Unauthorized",{status:401})
    }

    const card = await prismadb.card.findUnique({
      where:{
        id:params.cardId,
        list:{
          board:{
            orgId
          }
        }
      },
      include:{
        list:{
          select:{
            title:true
          }
        }
      }
    })

    return NextResponse.json(card)
  } catch (error) {
    console.log("[CARD_ID_GET]", error);
    return new NextResponse("Internal Error",{status:500})
  }
}