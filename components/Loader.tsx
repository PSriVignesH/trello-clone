"use client"

import {HashLoader} from 'react-spinners'
import React from 'react'

const Loader = () => {
  return (
    <div className='h-[70vh] flex flex-col justify-center items-center'>
      <HashLoader size={100} color='#0369A1'/>
    </div>
  )
}

export default Loader