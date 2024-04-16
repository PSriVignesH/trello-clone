
"use client"

import {PuffLoader} from 'react-spinners'
import React from 'react'

const Loader = () => {
  return (
    <div className='h-screen flex justify-center items-center'>
      <PuffLoader size={100} color='#0369A1'/>
    </div>
  )
}

export default Loader