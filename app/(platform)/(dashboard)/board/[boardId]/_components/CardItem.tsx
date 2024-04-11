"Use client"

import { FC } from "react"
import {Draggable} from '@hello-pangea/dnd'

import { Card } from "@prisma/client"
import { useCardModal } from "@/hooks/useCardModal"

interface CardItemProps{
  data:Card,
  index:number
}

const CardItem:FC<CardItemProps>= ({data,index}) => {
  const cardModal = useCardModal()

  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided)=>(
         <div
            {...provided.draggableProps} 
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            onClick={()=>cardModal.onOpen(data.id)}
            className="truncate border-2 border-transparent hover:border-black py-2 px-3 
            text-sm bg-white rounded-md shadow-sm" role="button">
           {data.title}
         </div>
      )}  
    </Draggable>
  )
}

export default CardItem