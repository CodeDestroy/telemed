import React, {  useContext, useEffect, useState, useRef, useLayoutEffect, useCallback } from "react";
import socket from '../../../socket'
import { Context } from "../../..";
import Container from "react-bootstrap/Container";
import {MessageObj, ChildComponent} from './MessageObj'
import './SendForm.css'
import SendImg from '../../../Assets/img/send.svg'
import AttachmentMenu from './AttachmentMenu';

const SendForm = ({roomID, token}) => {

    const {store} = useContext(Context);
    const [roomId, setRoomId] = useState();
    const [message, setMessage] = useState('');
    const [numChildren, setNumChildren] = useState(0)
    const [children, setChildren] = useState([])
    const [dataPosts, setData] = useState([]);
    
    const [file, setFile] = useState(null)
    const messagesEndRef = useRef(null);

    const addComponent = useCallback( (message, files, user) => {
        children.push(<ChildComponent key={message.id} message={message} files={files} user={user}/>)
        setData(children)
        setNumChildren((count) => count + 1)
    }, [children])

    useLayoutEffect(() => {
        
        socket.on('room:joined', (state, roomId) => {
            children.length=0
            setData([])
            setRoomId(roomId)
        })

        socket.on('message:returnAll', (allMessages, length) => {
            for (const messageDto of allMessages) {
                addComponent(messageDto.message, messageDto.files, messageDto.user)
            }
        })

        socket.on('message:return', (message, user, file ,count) => {
            addComponent(message, file, user)
        })

    },[addComponent, children])


    useEffect(() => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }, [numChildren])
    useEffect(() => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }, [dataPosts])
    
    
    
    

    const sendMessage = (message, files) => {
        if (files) { 
            let name = files.name
            let type = files.type
            socket.emit('message:upload', message, files, name, type , roomId, store.user.id)
        }
        else {
            socket.emit('message:upload', message, null, null, null , roomId, store.user.id)
        }
        setMessage('')
        setFile(null)  
    }
  
    const handleAttachmentSelect = (file) => {
        setFile(file)
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            if (message.length > 0)
                sendMessage(message, file);
            else 
                sendMessage('', file);
        }
      }

    return (
        <>
            <Container>
                <div className="row clearfix">
                    <div className="chat-app mt-5 msg-cont">
                        <div className="chat">
                            <div className="chat-history message-container">
                                <ul className="m-b-0">
                                    {dataPosts && store.user.id ? <><MessageObj key={1} addComponent={addComponent} children={dataPosts}></MessageObj></> : ''}
                                    <div ref={messagesEndRef} />
                                </ul>
                                
                            </div>
                            
                            <div className="chat-message clearfix">
                                <div className="input-group mb-0 dropup" style={{height:' 4.5em'}}>
                                    <input 
                                        type="text" 
                                        className="form-control message-input" 
                                        aria-label="Выразить свою мысль" 
                                        onChange={e => setMessage(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                        value={message}
                                    />
                                    <button 
                                        type="button" 
                                        className="btn btn-outline-secondary" 
                                        style={{width: '5em', borderColor: "red"}} 
                                        onClick={() => {
                                            if (message.length > 0)
                                                sendMessage(message, file);
                                            else 
                                                sendMessage('', file);
                                            
                                        } }
                                    > 
                                        <img src={SendImg} alt="svg" style={{maxWidth: "2em"}} />
                                    </button>
                                    {/* <ul className="dropdown-menu dropdown-menu-end">
                                        <li style={{listStyleType: "none"}}><a className="dropdown-item"  href="#">Прикрепить файл</a></li>
                                    </ul> */}
                                    <AttachmentMenu className='btn btn-outline-secondary dropdown-toggle dropdown-toggle-split' selectFile={handleAttachmentSelect} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </>  
        
    )
}

export default SendForm