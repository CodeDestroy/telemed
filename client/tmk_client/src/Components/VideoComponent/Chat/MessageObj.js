import { useContext, useState } from "react";
import Stack from "react-bootstrap/Stack";
import { Context } from "../../..";
import ImageModal from './ImageModal'
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

    if (store.user)
    return (
        <>
            <li className="clearfix" key={`${Date.now()}_${message.id}`}>
                <div key={`div_${Date.now()}_${message.id}`} className={`message-data ${parseInt(user.id) === parseInt(store.user.id) ? 'text-right' : '' }`} >
                    <span key={`span_${Date.now()}_${message.id}`} className="message-data-time">
                    <strong style={{fontWeight: 'bold', fontSize: 'medium' }}>
                            {user?.doctor ? 
                                user.doctor.secondName + ' ' + user.doctor.firstName + ' '
                                : 
                                (user?.patient ? 
                                    user.patient.secondName + ' ' + user.patient.firstName + ' '
                                    : 
                                    (user?.admin ? 
                                        user.admin.secondName + ' ' + user.admin.firstName + ' '
                                        :
                                        ''
                                    )
                                )
                            } 
                        </strong>
                        
                        {new Date(message.createdAt).toLocaleString('ru-RU', { weekday: 'short', year: 'numeric', month: 'long', day: '2-digit', hour: 'numeric', minute: 'numeric', second: 'numeric' })}
                    </span>
                    <img key={`img_${Date.now()}_${message.id}`} src={user.avatar} alt="avatar"/>
                </div>
                <div key={`fileContainer_${Date.now()}_${message.id}`} className={`adaptive-message message other-message ${parseInt(user.id) === parseInt(store.user.id) ? 'float-right' : '' }`}> {message.text}<br></br>
                
                    {files ?
                        files.map((file) => {
                            switch (file.type.substring(0, file.type.search('/'))) {
                                case 'image' :
                                    return (
                                    <>
                                        <br/>
                                        <img alt="" onClick={() => setModalShow(true)} id={file.id} key={file.id + '-' + Date.now()} className='message-img' src={`http://localhost:80${file.path}`}></img>
                                        <ImageModal 
                                            key={`imageModal_${Date.now()}_${message.id}`}
                                            show={modalShow}
                                            onHide={() => setModalShow(false)}
                                            file={file}
                                            message={message}
                                        />
                                    </>)
                                default:
                                    return  <Stack style={{fontSize: '13pt'}} direction="horizontal" key={file.id + '-' + Date.now()} gap={2}>
                                                
                                                <a key={`a_${file.id}-${Date.now()}`} style={{display: 'flex'}} href={`http://localhost:80${file.path}`}>
                                                    <img style={{display: 'flex'}} src={'http://localhost:80/files.png'} width={'7%'}></img>{file.name}
                                                </a>
                                            </Stack>
                            }
                        })
                        : 
                        <p></p> 
                    }
                </div>
                
            </li>
        </>
    )
  }

export {MessageObj, ChildComponent}