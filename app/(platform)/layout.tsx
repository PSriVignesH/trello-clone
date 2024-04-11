import { ClerkProvider } from '@clerk/nextjs'
import React, { FC } from 'react'
import {Toaster} from 'sonner'

import ModalProvider from '@/components/providers/ModalProvider'
import QueryProvider from '@/components/providers/QueryProvider'


interface PlatformLayoutProps{
  children:React.ReactNode
}

const PlatformLayout:FC<PlatformLayoutProps>= ({children}) => {
  return (
    <ClerkProvider>
      <QueryProvider>
      <Toaster/>
      <ModalProvider/>
      {children}
      </QueryProvider>
    </ClerkProvider>
  )
}

export default PlatformLayout