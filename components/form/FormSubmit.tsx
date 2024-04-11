"use client"

import { useFormStatus } from "react-dom"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FC } from "react"

interface FormSubmitProps{
  children:React.ReactNode,
  disabled?:boolean,
  className?:string,
  variant?:"default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "primary"
}

const FormSubmit:FC<FormSubmitProps>= ({children,disabled,className,variant="primary"}) => {
   const {pending} = useFormStatus()
  return (
    <Button
      disabled={pending || disabled}
      type="submit"
      variant={variant}
      size="sm"
      className={cn(className)}    
    >
      {children}
    </Button>
  )
}

export default FormSubmit