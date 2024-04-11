import prismadb from '@/lib/prismadb'
import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import React, { FC } from 'react'
import ListContainer from './_components/ListContainer'

interface BoardIdPageProps{
  params:{
    boardId:string
  }
}

const BoardIdPage:FC<BoardIdPageProps>=async({params}) => {
  const {orgId}=auth()
 
   if(!orgId){
    redirect("/select-org")
   }

   const lists = await prismadb.list.findMany({
    where:{
      boardId:params.boardId,
      board:{
        orgId
      }
    },
    include:{
      cards:{
        orderBy:{
          order:"asc"
        }
      }
    },
    orderBy:{
      order:"asc"
    }
   })
  return (
    <div className='p-4 h-full overflow-x-auto'>
       <ListContainer boardId={params.boardId} data={lists}/>
    </div>
  )
}

export default BoardIdPage