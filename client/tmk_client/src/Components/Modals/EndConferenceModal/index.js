import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useContext } from 'react';
import { Context } from '../../../';
const Index = (props) => {

    const {store} = useContext(Context)
    const closeConference = async () => {
        //window.location = '/';    
        if (store.user && store.user.userRoleId == 1) {
            window.location = process.env.REACT_APP_PATIENT_CLIENT_URL
        }
        else if (store.user) {
            window.location = '/'
        }
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
                Спасибо за участие в телемедицинской консультации!
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
