import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const Index = (props) => {

    const closeConference = async () => {
        window.location = '/';
    }


    return (
        <Modal
            {...props}
            backdrop="static"
            keyboard={false}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            style={{position: 'relative!important'}}
        >
            <Modal.Header closeButton>
                {/* <Modal.Title>Modal title</Modal.Title> */}
            </Modal.Header>
            <Modal.Body style={{textAlign: 'center', fontSize: '2rem'}}>
                Спасибо за участие в тестировании телемедицинских консультаций!
            </Modal.Body>
            <Modal.Footer>
                <Button style={{fontSize: '15px'}} size="lg" variant="secondary" onClick={closeConference}>
                    Закрыть
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default Index;
