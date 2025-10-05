import { useContext, useEffect, useState } from "react";
import Stack from "react-bootstrap/Stack";
import { Context } from "../../..";
import ImageModal from './ImageModal'
import './MessageObj.css'
const MessageObj = ({ children }) => {
    return (
        children.length !== 0 ? children : ''

    )
}

const ChildComponent = ({message, files, user}) => {
    const [modalShow, setModalShow] = useState(false);

    /* const handleClose = () => setShow(false);
    const handleShow = () => setShow(true); */

    const {store} = useContext(Context);


    useEffect(()=>{
        console.log(user)
    }, [])

    if (store.user)
    return (

            <li className="clearfix" key={`${Date.now()}_${message.id}`}>
                <div key={`div_${Date.now()}_${message.id}`} className={`message-data ${parseInt(user.id) === parseInt(store.user.id) ? 'text-right' : '' }`} >
                    <span key={`span_${Date.now()}_${message.id}`} className="message-data-time">
                    <strong style={{fontWeight: 'bold', fontSize: 'medium' }}>
                            {user?.Doctors.length > 0 ? 
                                user.Doctors[0].secondName + ' ' + user.Doctors[0].firstName + ' '
                                : 
                                (user?.Patient ? 
                                    user.Patient.secondName + ' ' + user.Patient.firstName + ' '
                                    : 
                                    (user?.Admins.length > 0 ? 
                                        user.Admins[0].secondName + ' ' + user.Admins[0].firstName + ' '
                                        :
                                        ''
                                    )
                                )
                            } 
                        </strong>
                        
                        {new Date(message.createdAt).toLocaleString('ru-RU', { weekday: 'short', year: 'numeric', month: 'long', day: '2-digit', hour: 'numeric', minute: 'numeric' })}
                    </span>
                    <img key={`img_${Date.now()}_${message.id}`} src={user.avatar} alt="avatar"/>
                </div>
                <div key={`fileContainer_${Date.now()}_${message.id}`} className={`adaptive-message message other-message ${parseInt(user.id) === parseInt(store.user.id) ? 'float-right' : '' }`}> {message.text}<br></br>
                
                    {files ?
                        files.map((file) => {
                            switch (file.type.substring(0, file.type.search('/'))) {
                                case 'image' :
                                    return (
                                    <div key={`imageFileBlock_${Date.now()}_${file.id}`}>
                                        <br/>
                                        <img alt="" onClick={() => setModalShow(true)} id={file.id} key={file.id + '-' + Date.now()} className='message-img' src={`${process.env.REACT_APP_SERVER_URL}${file.path}`}></img>
                                        <ImageModal 
                                            key={`imageModal_${Date.now()}_${message.id}`}
                                            show={modalShow}
                                            onHide={() => setModalShow(false)}
                                            file={file}
                                            message={message}
                                        />
                                    </div>)
                                default:
                                    return  <Stack style={{fontSize: '13pt'}} direction="horizontal" key={file.id + '-' + Date.now()} gap={2}>
                                                
                                                <a key={`a_${file.id}-${Date.now()}`} style={{display: 'flex'}} target="_blank" href={`${process.env.REACT_APP_SERVER_URL}${file.path}`}>
                                                    <img style={{display: 'flex'}} src={`${process.env.REACT_APP_SERVER_URL}/files.png`} width={'7%'}></img>{file.name}
                                                </a>
                                            </Stack>
                            }
                        })
                        : 
                        <p></p> 
                    }
                </div>
                
            </li>

    )
  }

export {MessageObj, ChildComponent}