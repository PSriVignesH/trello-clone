import { FC } from "react"
import { OrganizationControl } from "./_components/OrganizationControl"
import { startCase } from "lodash"
import { auth } from "@clerk/nextjs"

export async function generateMetadata(){
   const {orgSlug} =auth()

   return {
    title: startCase(orgSlug || "organization")
   }
}

interface OrganizationIdLayoutProps{
  children:React.ReactNode
}

const OrganizationIdLayout:FC<OrganizationIdLayoutProps>= ({children}) => {
  return (
    <>
    <OrganizationControl/>
    {children}
    </>
  )
}

export default OrganizationIdLayout