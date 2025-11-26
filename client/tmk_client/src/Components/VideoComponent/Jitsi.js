import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { JitsiMeeting } from '@jitsi/react-sdk'
import { useSearchParams } from 'react-router-dom';
import ConferenceProtocol from '../Modals/ConferenceProtocol'
import ConferenceService from '../../Services/ConferenceService';
import mainUtil from '../../Utils/mainUtil';
import { Context } from '../..';
import { observer } from 'mobx-react-lite';
import socket from '../../socket'
import EndConferenceModal from '../Modals/EndConferenceModal'
import './Jitsi.css'
const CustomComponent = () => {
    /* useEffect(() => {
        document.getElementById('someid').requestFullscreen();
    },[]) */
    return (
        <div id='someid' style={{ position: 'relative', top: '10px', right: '10px', zIndex: 1000 }} className='testBtn'>
            <button style={{color: 'red'}} onClick={() => alert('Custom Button Clicked!')}>Custom Button</button>
        </div>
    )
};
function Jitsi(props) {
    const {store} = React.useContext(Context)
    const roomName = props.room
    const domain = 'clinicode.online'
    /* const [time, setTime] = useState(props.timerSeconds) */
    const jwt = props.token
    let localId = 0;
    /* let time = props.timerSeconds; */
    const JitsiRef = useRef(null)
    /* const [avatar, setAvatar] = useState('http://distant-assistant.ru:80') */
    const [showProtocolModal, setProtocolModalShow] = useState(false);

    const handleProtocolModalClose = () => setProtocolModalShow(false);
    const handleProtocolModalShow = () => setProtocolModalShow(true);

    const isModerator = store.selectedProfile?.isWorker;

    const TOOLBAR_BUTTONS = [
        'microphone', 'camera', 'desktop', 'fullscreen',
        'fodeviceselection', 'hangup', 'chat',
        'videoquality', 'filmstrip',
        'tileview', 'videobackgroundblur', 'download',
        'participants-pane', 'pip', 'speakerstats',
        'mute-everyone'
    ];

    if (isModerator) {
        TOOLBAR_BUTTONS.push('recording');
    }

    const onConferenceCreatedTimestamp = (nativeEvent) => {
        /* Conference terminated event */
        /* console.log(`created ${nativeEvent}`); */
      
    }




    //Срабатывает у входящего
    const onConferenceJoined = async (nativeEvent) => {
        try {
            
            const result = await ConferenceService.joinConference({...nativeEvent}); 
            
            /* socket.emit('timer:start', {...nativeEvent, time}) */
            if (result.data.timer == 'start') {
                var date = new Date(result.data.time);
                props.onJoin(result.data?.time);
            }

            localId = result.data.data.id 
            
        }
        catch (e) {
            console.log(e)
        }
        
         // Проверяйте каждую секунду, пока не найдете кнопку
          
    }

    //Срабатывает у всех
    const onParticipantLeft = async (nativeEvent) => {
        try {
            console.log('onParticipantLeft')
            /* console.log(nativeEvent, localId) */
            /* const currTime = Date.now(); */
            const result = await ConferenceService.leaveConference({...nativeEvent, roomName});

            if (result.data.timer == 'stop') {
                props.onLeave();
            }
            
        }
        catch (e) {
            console.log(e)
        }
        /* console.log(nativeEvent) */
    }

    //Срабатывает у всех
    const onParticipantJoined = async (nativeEvent) => {
        try {
            /* const currTime = Date.now(); */
            const result = await ConferenceService.participantJoined({...nativeEvent, roomName});
            /* if (result.data.timer == 'start') {
                console.log(result.data)
                props.onJoin(result.data?.time);
            } */
        }
        catch (e) {

        }
    }

    //Срабатывает только у выходящего
    const handleEndCall = async (event) => {
        try {
            /* const currTime = Date.now(); */
            console.log('handleEndCall')
            const nativeEvent = { id: localId, roomName: roomName}
            const result = await ConferenceService.leaveConference(nativeEvent);
            /* JitsiRef.current.style.display = 'none' */
            console.log('Call ended successfully: ', nativeEvent, ' ', result.data); 
            /* window.location = '/' */

            handleProtocolModalShow()
            
        } catch (error) {
            console.error('Error ending call:', error);
        }
    };

    const openCustomFullScreen = (event, jitsiFrame) => {
        let isFullScreen = false
        if (jitsiFrame.classList.contains('fullscreen'))
            isFullScreen = true
        props.onFullScreen(event, jitsiFrame, isFullScreen)
        /* setIsFullScreen(!isFullScreen) */
    }
    const openModelChat = () => {
        props.openModalChat()
    }
    return (
        <div ref={JitsiRef}>
            <JitsiMeeting
                /* avatarUrl={avatar} */
                domain = { domain }
                roomName = { roomName }
                jwt = { jwt }
                
                configOverwrite = {{
                    startWithAudioMuted: true,
                    disableModeratorIndicator: false,
                    startScreenSharing: true,
                    enableEmailInStats: false,
                    resolution: 720,
                    prejoinPageEnabled: false,
                    buttonsWithNotifyClick: [
                        {
                            key: 'fullscreen',
                            preventExecution: true
                        },
                        {
                            key: 'invite',
                            preventExecution: false
                        },
                        {
                            key:  'chat',
                            preventExecution: true
                        }
                    ]
                    /* customToolbarButtons: [
                        {
                            icon: 'data:image/svg+xml;base64,...',
                            id: 'custom-toolbar-button',
                            text: 'Custom Toolbar Button'
                        }
                    ] */

                }}
                interfaceConfigOverwrite={{
                    DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                    SHOW_JITSI_WATERMARK: false,
                    SHOW_WATERMARK_FOR_GUESTS: false,
                    SHOW_CHROME_EXTENSION_BANNER: false,

                    TOOLBAR_BUTTONS: TOOLBAR_BUTTONS,
                    HIDE_KICK_BUTTON_FOR_GUESTS: true,
                    JITSI_WATERMARK_LINK: "null",
                    MOBILE_APP_PROMO: false,
                    
                    // Массив кнопок, которые вы хотите отображать на панели инструментов
                    /* toolbarButtons: [
                        'microphone', 'camera', 'closedcaptions', 'desktop', 'fullscreen',
                        'fodeviceselection', 'hangup', 'profile', 'recording',
                        'livestreaming', 'etherpad', 'sharedvideo', 'settings', 'raisehand',
                        'videoquality', 'filmstrip', 'feedback', 'stats', 'shortcuts',
                        'tileview', 'videobackgroundblur', 'download', 'help', 'mute-everyone',
                        'security', 'participants-pane', 'pip', 'speakerstats',
                        'tileview', 'mute-everyone'
                    ], */
                }}
                
                displayName = {'YOUR_USERNAME'}
                onApiReady={(externalApi) => {
                    /* console.log(externalApi);
                    console.log(externalApi._parentNode.childNodes[0]) */
                    // Добавляем обработчик события завершения конференции
                    externalApi.on('videoConferenceLeft', (event) => {
                        handleEndCall(event);
                    });
                    externalApi.on('videoConferenceJoined', (event) => {
                        onConferenceJoined(event);
                    })
                    externalApi.on('conferenceCreatedTimestamp', (event) => {
                        onConferenceCreatedTimestamp(event);
                    })
                    externalApi.on('participantLeft', (event) => {
                        onParticipantLeft(event);
                    })
                    externalApi.on('participantJoined', (event) => {
                        onParticipantJoined(event);
                    })
                    externalApi.on('toolbarButtonClicked', (event) => {
                        if (event.key === 'fullscreen') {
                            openCustomFullScreen(event, externalApi.getIFrame().parentNode)
                        }
                        if (event.key === 'chat') {
                            openModelChat(event)
                        }
                    })

                     

                    
                }}
                getIFrameRef = { (iframeRef) => { iframeRef.style.height = '40vh'; iframeRef.style.position = 'absolute'; iframeRef.style.width = '100%' } }
                containerStyles = {{display: 'flex', flex: 1}}
            />

            { roomName && ( store.user?.Doctors?.length > 0 || store.user?.isWorker) ?
                <ConferenceProtocol 
                    show={showProtocolModal} 
                    onHide={handleProtocolModalClose}
                    room={roomName}
                />
                :
                <EndConferenceModal 
                    show={showProtocolModal} 
                    onHide={handleProtocolModalClose}
                />
            }
        </div>
        
    )
}

export default observer(Jitsi)