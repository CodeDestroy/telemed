import React from 'react'
import Modal from "react-bootstrap/Modal";
import './ImageModal.css'
function Index(props) {
    const [file] = React.useState(props.file)
    const [message] = React.useState(props.message)
    return (
      <Modal
        {...props}
        /* size="lg" */
        dialogClassName="modal-90w"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        fullscreen={false}
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {new Date(file.createdAt).toLocaleDateString('ru-RU', { weekday: 'short', year: 'numeric', month: 'long', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric' })}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{textAlign: '-webkit-center'}}>
            <img alt='' id={file.id} key={file.id + '-' + Date.now()} className='message-img-modal' src={`http://localhost:80${file.path}`}></img>
            <div className='modal-message-text'>{message.text}</div>
        </Modal.Body>
      </Modal>
    );
}

  
export default Index