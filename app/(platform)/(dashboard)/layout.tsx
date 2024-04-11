import { FC } from 'react'
import { Navbar } from './_components/Navbar'


interface DashboardLayoutProps{
  children:React.ReactNode
}

const DashboardLayout:FC<DashboardLayoutProps>= ({children}) => {
  return (
    <div className='h-full'>
      <Navbar/>
      {children}
    </div>
  )
}

export default DashboardLayout