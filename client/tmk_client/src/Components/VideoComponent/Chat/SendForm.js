import React, {useEffect, useRef} from "react";
import Container from "react-bootstrap/Container";
import { MessageObj } from './MessageObj';
import './SendForm.css';
import SendImg from '../../../Assets/img/send.svg';
import AttachmentMenu from './AttachmentMenu';

const SendForm = ({
    message,
    setMessage,
    dataPosts,
    messagesEndRef,
    handleKeyDown,
    sendMessage,
    file,
    handleAttachmentSelect,
    setFile,
    store,
    containerClass
}) => {

    return (
        <>
            <Container className={containerClass} id='chatContainer'>
                <div className="row clearfix mb-0">
                    <div className="chat-app mt-5 msg-cont">
                        <div className="chat">
                            <div className="chat-history message-container">
                                <ul className="m-b-0">
                                    {dataPosts && store.user.id ? <MessageObj key={1} addComponent={() => {}} children={dataPosts}></MessageObj> : ''}
                                    
                                </ul>
                                <div ref={messagesEndRef}></div>
                            </div>
                            <div className="chat-message clearfix">
                                <div className="input-group mb-0 dropup" style={{ height: '4.5em' }}>
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
                                        style={{ width: '5em', borderColor: "red" }} 
                                        onClick={() => {
                                            if (message.length > 0)
                                                sendMessage(message, file);
                                            else
                                                sendMessage('', file);
                                        }}
                                    > 
                                        <img src={SendImg} alt="svg" style={{ maxWidth: "2em" }} />
                                    </button>
                                    <AttachmentMenu className='btn btn-outline-secondary dropdown-toggle dropdown-toggle-split' selectFile={handleAttachmentSelect} />
                                </div>
                                {file && (
                                    <div className="selected-file">
                                        <span>{file.name + ' '}</span>
                                        <button onClick={() => setFile(null)} style={{color: 'red'}}>Удалить</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </>
    );
};

export default SendForm;
