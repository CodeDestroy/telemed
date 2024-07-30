import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import SendForm from '../SendForm';

const ModalChat = ({
  show,
  handleClose,
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
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Сообщения</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
          containerClass={containerClass}
        />
      </Modal.Body>

    </Modal>
  );
};

export default ModalChat;
