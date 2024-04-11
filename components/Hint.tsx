import { Tooltip,TooltipContent,TooltipProvider,TooltipTrigger } from "@/components/ui/tooltip"
import { FC } from "react"

interface HintProps{
  children:React.ReactNode
}

interface HintProps{
  children:React.ReactNode,
  description:string,
  side?:"left" | "right" |"top" | "bottom",
  sideOffset?:number
}

const Hint:FC<HintProps>= ({children,description,side="bottom",sideOffset=0}) => {
  return (
    <TooltipProvider>
        <Tooltip delayDuration={0}>
          <TooltipTrigger>
            {children}
          </TooltipTrigger>
          <TooltipContent sideOffset={sideOffset} side={side} className="text-xs max-w-[220px] break-words mt-1">
            {description}
          </TooltipContent>
        </Tooltip>
    </TooltipProvider>
  )
}

export default Hint