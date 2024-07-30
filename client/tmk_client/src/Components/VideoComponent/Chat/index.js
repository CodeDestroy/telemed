import React, {useEffect} from 'react';
import ParentComponent from './ParentComponent';

function Index(props) {
  const roomId = props.roomId;
  const jwt = props.token;

  return (
    <ParentComponent roomID={roomId} token={jwt} show={props.show} onHide={props.onHide}/>
  );
}

export default Index;
