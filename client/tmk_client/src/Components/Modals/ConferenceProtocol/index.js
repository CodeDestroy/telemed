import { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { TextField, IconButton, InputAdornment } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ConferenceService from '../../../Services/ConferenceService';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import Snackbar from '@mui/material/Snackbar'

const Index = (props) => {
    const [inputValue, setInputValue] = useState('');
    const [prevValue, setPrevValue] = useState('')
    
    const [openAlert, setOpenAlert] = useState(false);
    const roomName = props.room

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    useEffect(() => {
        if (listening ) {
            setInputValue(prevValue + ' ' + transcript);
        }
    }, [transcript]);

    if (!browserSupportsSpeechRecognition) {
        return <span>Ваш браузер не поддерживает распознавание речи.</span>;
    }

    const toggleListening = () => {
        if (listening) {
            SpeechRecognition.stopListening();
        } else {
            setPrevValue(inputValue)
            resetTranscript();
            SpeechRecognition.startListening({ continuous: true });
        }
    };

    const closeConference = () => {
        window.location = '/';
        /* props.onHide */
    };

    const endConference = async () => {
        console.log(`roomName: ${roomName}`)
        try {

            const response = await ConferenceService.endConference(roomName, inputValue)
            if (response.status == 200)
                handleOpenAlert()
            /* console.log(response.data) */
        }
        catch (e) {
            alert(e.message)
        }
    }


    const handleOpenAlert = () => {
        setOpenAlert(true);
    };

    const handleCloseAlert = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        
        setOpenAlert(false);
        window.location = '/';
    };

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
                <div style={{ marginTop: '20px', position: 'relative' }}>
                    <TextField
                        multiline
                        rows={20}
                        variant="outlined"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        fullWidth
                        InputProps={{
                            style: { fontSize: '2rem', paddingRight: '50px' }
                        }}
                    />
                    <IconButton
                        onClick={toggleListening}
                        color={listening ? 'secondary' : 'primary'}
                        style={{ position: 'absolute', right: '15px', top: '15px' }}
                    >
                        {!listening ? <MicOffIcon style={{width: '2.5rem', height: '2.5rem'}} /> : <MicIcon style={{width: '2.5rem', height: '2.5rem'}} />}
                    </IconButton>
                </div>
            </Modal.Body>
            <Modal.Footer>
                {/* <Button style={{fontSize: '15px'}} size="lg" variant="secondary" onClick={closeConference}>
                    Закрыть
                </Button> */}
                <Button style={{fontSize: '15px'}} size="lg" variant="secondary" onClick={endConference}>
                    Завершить
                </Button>
                <Snackbar open={openAlert} autoHideDuration={6000} onClose={handleCloseAlert}>
                    <Alert 
                        icon={<CheckIcon fontSize="inherit" />} 
                        severity="success"
                        onClose={handleCloseAlert}
                        sx={{ width: '100%', fontSize: '15px' }}
                    >
                        Успешно передано!
                    </Alert>
                    {/* <Alert onClose={handleCloseAlert} severity="success" sx={{ width: '100%' }}>
                        Успешно передано!
                    </Alert> */}
                </Snackbar>
                
            </Modal.Footer>
        </Modal>
    );
}

export default Index;
