import React from 'react'
import SendForm from './SendForm'

function Index(props) {
  const roomId = props.roomId;
  const jwt = props.token
  return (
    <SendForm roomID={roomId} token={jwt}/>
  )
}

export default Index