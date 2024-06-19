import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const Index = (props) => {

    const closeConference = () => {
        window.location = '/'
        /* props.onHide */
    }


    return (
        <Modal
            {...props}
            /* show={show}
            onHide={handleClose} */
            backdrop="static"
            keyboard={false}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                {/* <Modal.Title>Modal title</Modal.Title> */}
            </Modal.Header>
            <Modal.Body style={{textAlign: 'center', fontSize: '2rem'}}>
                Спасибо за участие в тестировании телемедицинских консультаций!
            </Modal.Body>
            <Modal.Footer>
                <Button size="lg" variant="secondary" onClick={closeConference}>
                    Закрыть
                </Button>
                {/* <Button size="lg" variant="primary">Understood</Button> */}
            </Modal.Footer>
        </Modal>
    )
}

export default Index