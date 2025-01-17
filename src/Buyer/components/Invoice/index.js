import React from 'react'
import Invoices from './Invoice'


const Invoice = ({socket}) => {
  return (
    <div>
      <Invoices socket={socket}/>
    </div>
  )
}

export default Invoice