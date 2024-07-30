import React, { useContext, useEffect, useState, useRef, useLayoutEffect, useCallback } from "react";
import socket from '../../../socket';
import { Context } from "../../..";
import SendForm from './SendForm';
import ModalChat from './ModalChat';
import { MessageObj, ChildComponent } from './MessageObj';
import { Button } from 'react-bootstrap';

const ParentComponent = ({ roomID, token, show, onHide }) => {
    const { store } = useContext(Context);
    const [roomId, setRoomId] = useState();
    const [message, setMessage] = useState('');
    const [numChildren, setNumChildren] = useState(0);
    const [children, setChildren] = useState([]);
    const [dataPosts, setData] = useState([]);
    const [file, setFile] = useState(null);
    const messagesEndRef = useRef(null);
    const messagesEndRefModal = useRef(null);
    const [showModal, setShowModal] = useState(false);

    const addComponent = useCallback((message, files, user) => {
        children.push(<ChildComponent key={message.id} message={message} files={files} user={user} />);
        setData(children);
        setNumChildren((count) => count + 1);
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }, [children]);

    useLayoutEffect(() => {
        socket.on('room:joined', (state, roomId) => {
            console.log(`sendform roomJoined ${roomId}`);
            children.length = 0;
            setData([]);
            setRoomId(roomId);
        });

        socket.on('message:returnAll', (allMessages, length) => {
            for (const message of allMessages) {
                addComponent(message.message, message.files, message.user);
            }
        });

        socket.on('message:return', (message, user, file, count) => {
            addComponent(message, file, user);
        });
    }, [addComponent, children]);

    useEffect(() => {
        if (!show)
            messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
        else 
            messagesEndRefModal.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
        
    }, [numChildren]);

    /* useEffect(() => {
        if (!show)
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }, [messagesEndRef]) */

    useEffect(() => {
        if (!show)
            messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
        else 
            messagesEndRefModal.current.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
    }, [dataPosts]);

    useEffect(() => {
        if (show)
            messagesEndRefModal.current.scrollIntoView({ behavior: "instant", block: "end", inline: "nearest" });
        
    }, [show])

    const sendMessage = (message, files) => {
        if (files) {
            let name = files.name;
            let type = files.type;
            socket.emit('message:upload', message, files, name, type, roomId, store.user.id);
        } else {
            socket.emit('message:upload', message, null, null, null, roomId, store.user.id);
        }
        setMessage('');
        setFile(null);
    };

    const handleAttachmentSelect = (file) => {
        setFile(file);
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            if (message.length > 0)
                sendMessage(message, file);
            else
                sendMessage('', file);
        }
    };

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    return (
        <>
            <SendForm
                message={message}
                setMessage={setMessage}
                dataPosts={dataPosts}
                messagesEndRef={messagesEndRef}
                handleKeyDown={handleKeyDown}
                sendMessage={sendMessage}
                file={file}
                handleAttachmentSelect={handleAttachmentSelect}
                setFile={setFile}
                store={store}
                containerClass={'msg-container-wrapper'}
            />
            <ModalChat
                show={show}
                handleClose={onHide}
                message={message}
                setMessage={setMessage}
                dataPosts={dataPosts}
                messagesEndRef={messagesEndRefModal}
                handleKeyDown={handleKeyDown}
                sendMessage={sendMessage}
                file={file}
                handleAttachmentSelect={handleAttachmentSelect}
                setFile={setFile}
                store={store}
                containerClass={'msg-container-wrapper-modal'}
            />
        </>
    );
};

export default ParentComponent;
