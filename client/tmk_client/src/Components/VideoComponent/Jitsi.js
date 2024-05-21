import React, { useEffect, useLayoutEffect } from 'react'
import { JitsiMeeting } from '@jitsi/react-sdk'
import { useSearchParams } from 'react-router-dom';
function Jitsi(props) {
    const roomName = props.room
    const domain = 'mczr-tmk.ru'

    const jwt = props.token

   /*  useLayoutEffect(() => {
        socket.on('user:registered', (bool, user) => {
            
        })
    }, []) */

    //andrey moder true
    //http://localhost:3000/room/sometestroomname?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb250ZXh0Ijp7InVzZXIiOnsibmFtZSI6IkFuZHJleSBUZXN0IE5ldyIsImlkIjoiQW5kcmV5QGdtYWlsLmNvbSIsImVtYWlsIjoidXNlckBnbWFpbC5jb20iLCJzZWNvbmROYW1lIjoiTm92aWNoaWtoaW4iLCJwYXRyb25vbWljTmFtZSI6IkV2Z2VuaWV2aWNoIiwiYmlydGhEYXRlIjoxMDAyMzE5MDk1fX0sIm5iZiI6MTY4MjMxOTA5NSwiYXVkIjoiaml0c2kiLCJpc3MiOiJiMzI2NWFlMzVhMWIzNGQxYTM2MDczOGNhZjhkMGY5NjNlZTI5ZmIwOWMwZjUyZjA3OTM0NWM3Y2MyNDU3OWQzIiwic3ViIjoibWN6ci10bWsucnUiLCJyb29tIjoiKiIsImV4cCI6MTc3NTM0OTYzNCwibW9kZXJhdG9yIjp0cnVlfQ.JJlQ8CNzi5kVC95oArJCxIaPGqWtYrViQME8yxrwNzo


    //andrey not moder
    //http://localhost:3000/room/sometestroomname?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb250ZXh0Ijp7InVzZXIiOnsibmFtZSI6IkFuZHJleSBUZXN0IE5ldyIsImlkIjoiQW5kcmV5QGdtYWlsLmNvbSIsImVtYWlsIjoidXNlckBnbWFpbC5jb20iLCJzZWNvbmROYW1lIjoiTm92aWNoaWtoaW4iLCJwYXRyb25vbWljTmFtZSI6IkV2Z2VuaWV2aWNoIiwiYmlydGhEYXRlIjoxMDAyMzE5MDk1fX0sIm5iZiI6MTY4MjMxOTA5NSwiYXVkIjoiaml0c2kiLCJpc3MiOiJiMzI2NWFlMzVhMWIzNGQxYTM2MDczOGNhZjhkMGY5NjNlZTI5ZmIwOWMwZjUyZjA3OTM0NWM3Y2MyNDU3OWQzIiwic3ViIjoibWN6ci10bWsucnUiLCJyb29tIjoiKiIsImV4cCI6MTc3NTM0OTYzNCwibW9kZXJhdG9yIjpmYWxzZX0.yFMZN2E7OLbthrZQjcONx9wbv4M5bif9Ii82xq-vb7U


    //new Andrey not moder
    //http://localhost:3000/room/sometestroomname?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb250ZXh0Ijp7InVzZXIiOnsibmFtZSI6IkFuZHJleSBUZXN0IE5ldyIsImlkIjoiQW5kcmV5QGdtYWlsLmNvbSIsImVtYWlsIjoidXNlckBnbWFpbC5jb20iLCJzZWNvbmROYW1lIjoiTm92aWNoaWtoaW4iLCJwYXRyb25vbWljTmFtZSI6IkV2Z2VuaWV2aWNoIiwiYmlydGhEYXRlIjoxMDAyMzE5MDk1fX0sIm5iZiI6MTY4MjMxOTA5NSwiYXVkIjoiaml0c2kiLCJpc3MiOiJtY3pyLXRtay5ydSIsInN1YiI6ImIzMjY1YWUzNWExYjM0ZDFhMzYwNzM4Y2FmOGQwZjk2M2VlMjlmYjA5YzBmNTJmMDc5MzQ1YzdjYzI0NTc5ZDMiLCJyb29tIjoiKiIsImV4cCI6MTc3NTM0OTYzNCwibW9kZXJhdG9yIjpmYWxzZX0.a197kVcmc81mCsl-0Zasurg2nhZrz2Y2nM5ng9ukfuQ

    //new Andrey moder
    //http://localhost:3000/room/sometestroomname?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb250ZXh0Ijp7InVzZXIiOnsibmFtZSI6IkFuZHJleSBUZXN0IE5ldyIsImlkIjoiQW5kcmV5QGdtYWlsLmNvbSIsImVtYWlsIjoidXNlckBnbWFpbC5jb20iLCJzZWNvbmROYW1lIjoiTm92aWNoaWtoaW4iLCJwYXRyb25vbWljTmFtZSI6IkV2Z2VuaWV2aWNoIiwiYmlydGhEYXRlIjoxMDAyMzE5MDk1fX0sIm5iZiI6MTY4MjMxOTA5NSwiYXVkIjoiYjMyNjVhZTM1YTFiMzRkMWEzNjA3MzhjYWY4ZDBmOTYzZWUyOWZiMDljMGY1MmYwNzkzNDVjN2NjMjQ1NzlkMyIsImlzcyI6ImIzMjY1YWUzNWExYjM0ZDFhMzYwNzM4Y2FmOGQwZjk2M2VlMjlmYjA5YzBmNTJmMDc5MzQ1YzdjYzI0NTc5ZDMiLCJzdWIiOiJtY3pyLXRtay5ydSIsInJvb20iOiIqIiwiZXhwIjoxNzc1MzQ5NjM0LCJtb2RlcmF0b3IiOnRydWV9.xesGme-4_0JRLiBNDCKDrqmctU_FajFTxVtKuOWen74
    
    //user not moderator
    //http://localhost:3000/room/sometestroomname?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb250ZXh0Ijp7InVzZXIiOnsibmFtZSI6IlVzZXIiLCJpZCI6IlVzZXJAZ21haWwuY29tIiwiZW1haWwiOiJ0ZXN0X3VzZXJAZ21haWwuY29tIn0sImZlYXR1cmVzIjp7ImxpdmVzdHJlYW1pbmciOmZhbHNlLCJyZWNvcmRpbmciOmZhbHNlfX0sIm5iZiI6MTY4MjMxOTA5NSwiYXVkIjoiaml0c2kiLCJpc3MiOiJiMzI2NWFlMzVhMWIzNGQxYTM2MDczOGNhZjhkMGY5NjNlZTI5ZmIwOWMwZjUyZjA3OTM0NWM3Y2MyNDU3OWQzIiwic3ViIjoibWN6ci10bWsucnUiLCJyb29tIjoiKiIsImV4cCI6MTc3NTM0OTYzNCwibW9kZXJhdG9yIjpmYWxzZX0.v0hFHZQctGWNwI7F32zvHlpMw_9RWe_N8Si356wdhmA
    
    //http://localhost:3000/room/sometestroomname?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb250ZXh0Ijp7InVzZXIiOnsibmFtZSI6IlVzZXIiLCJpZCI6IlVzZXJAZ21haWwuY29tIiwiZW1haWwiOiJ0ZXN0X3VzZXJAZ21haWwuY29tIn0sImZlYXR1cmVzIjp7ImxpdmVzdHJlYW1pbmciOmZhbHNlLCJyZWNvcmRpbmciOmZhbHNlfX0sIm5iZiI6MTY4MjMxOTA5NSwiYXVkIjoiaml0c2kiLCJpc3MiOiJiMzI2NWFlMzVhMWIzNGQxYTM2MDczOGNhZjhkMGY5NjNlZTI5ZmIwOWMwZjUyZjA3OTM0NWM3Y2MyNDU3OWQzIiwic3ViIjoibWN6ci10bWsucnUiLCJyb29tIjoic29tZXRlc3Ryb29tbmFtZSIsImV4cCI6MTc3NTM0OTYzNCwibW9kZXJhdG9yIjp0cnVlfQ.MFX-6jI-aXAgjCZMeKQ40lWc7LJoYVO-BEe9Yu3Myug

    //user moderator
    //http://localhost:3000/room/sometestroomname?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb250ZXh0Ijp7InVzZXIiOnsibmFtZSI6IlVzZXIiLCJpZCI6IlVzZXJAZ21haWwuY29tIiwiZW1haWwiOiJ0ZXN0X3VzZXJAZ21haWwuY29tIn0sImZlYXR1cmVzIjp7ImxpdmVzdHJlYW1pbmciOmZhbHNlLCJyZWNvcmRpbmciOmZhbHNlfX0sIm5iZiI6MTY4MjMxOTA5NSwiYXVkIjoiaml0c2kiLCJpc3MiOiJiMzI2NWFlMzVhMWIzNGQxYTM2MDczOGNhZjhkMGY5NjNlZTI5ZmIwOWMwZjUyZjA3OTM0NWM3Y2MyNDU3OWQzIiwic3ViIjoibWN6ci10bWsucnUiLCJyb29tIjoiKiIsImV4cCI6MTc3NTM0OTYzNCwibW9kZXJhdG9yIjp0cnVlfQ.VFVitUoP6Bk0XwytSQbS_4ss7dTW8u7pRdiKY1zrlr0
    
    //new user not moder
    //http://localhost:3000/room/sometestroomname?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb250ZXh0Ijp7InVzZXIiOnsibmFtZSI6IlVzZXIiLCJpZCI6IlVzZXJAZ21haWwuY29tIiwiZW1haWwiOiJ0ZXN0X3VzZXJAZ21haWwuY29tIn0sImZlYXR1cmVzIjp7ImxpdmVzdHJlYW1pbmciOmZhbHNlLCJyZWNvcmRpbmciOmZhbHNlfX0sIm5iZiI6MTY4MjMxOTA5NSwiYXVkIjoiaml0c2kiLCJpc3MiOiJtY3pyLXRtay5ydSIsInN1YiI6ImIzMjY1YWUzNWExYjM0ZDFhMzYwNzM4Y2FmOGQwZjk2M2VlMjlmYjA5YzBmNTJmMDc5MzQ1YzdjYzI0NTc5ZDMiLCJyb29tIjoic29tZXRlc3Ryb29tbmFtZSIsImV4cCI6MTc3NTM0OTYzNCwibW9kZXJhdG9yIjpmYWxzZX0.OWCMVUjQ78RhipB8JxWG-6rZ7TpgOgXAo92SBR7wLuM

    //new user moder
    //http://localhost:3000/room/sometestroomname?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJjb250ZXh0Ijp7InVzZXIiOnsibmFtZSI6IlVzZXIiLCJpZCI6IlVzZXJAZ21haWwuY29tIiwiZW1haWwiOiJ0ZXN0X3VzZXJAZ21haWwuY29tIn0sImZlYXR1cmVzIjp7ImxpdmVzdHJlYW1pbmciOmZhbHNlLCJyZWNvcmRpbmciOmZhbHNlfX0sIm5iZiI6MTY4MjMxOTA5NSwiYXVkIjoiaml0c2kiLCJpc3MiOiJtY3pyLXRtay5ydSIsInN1YiI6ImIzMjY1YWUzNWExYjM0ZDFhMzYwNzM4Y2FmOGQwZjk2M2VlMjlmYjA5YzBmNTJmMDc5MzQ1YzdjYzI0NTc5ZDMiLCJyb29tIjoic29tZXRlc3Ryb29tbmFtZSIsImV4cCI6MTc3NTM0OTYzNCwibW9kZXJhdG9yIjp0cnVlfQ.JNRlnTeQobbHrL_owcTgAs4igRBx45FR5kxFcOVpNJw


    //moderator 
    //http://localhost:3000/room/sometestroomname?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb250ZXh0Ijp7InVzZXIiOnsiYXZhdGFyIjoiaHR0cHM6Ly9leGFtcGxlLmNvbS9hdmF0YXIucG5nIiwibmFtZSI6Ik1vZGVyYXRvciIsImVtYWlsIjoibW9kZXJhdG9yQGV4YW1wbGUuY29tIiwiaWQiOiJtb2RlcmF0b3IxMjMifSwiZ3JvdXAiOiJncm91cDEifSwibmJmIjoxNjgyMzE5MDk1LCJleHAiOjE3NzUzNDk2MzQsImF1ZCI6ImIzMjY1YWUzNWExYjM0ZDFhMzYwNzM4Y2FmOGQwZjk2M2VlMjlmYjA5YzBmNTJmMDc5MzQ1YzdjYzI0NTc5ZDMiLCJpc3MiOiJiMzI2NWFlMzVhMWIzNGQxYTM2MDczOGNhZjhkMGY5NjNlZTI5ZmIwOWMwZjUyZjA3OTM0NWM3Y2MyNDU3OWQzIiwic3ViIjoibWN6ci10bWsucnUiLCJyb29tIjoiKiIsIm1vZGVyYXRvciI6dHJ1ZX0.pe3ceKd7rvFherUrKncs9naJ7uCQQdPFC4sbwnFOQ2Y


    //moderator 1
    //http://localhost:3000/room/sometestroomname?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb250ZXh0Ijp7InVzZXIiOnsiYXZhdGFyIjoiaHR0cHM6Ly9zdGVhbXVzZXJpbWFnZXMtYS5ha2FtYWloZC5uZXQvdWdjLzIyMDQwMDkyMDY0Nzk3MDcwNjkvMDI5MTY4QTdDNDQ5MDJBNDVDQzdBMDFENEEzQTY4MzQ3NkQxNjUxOS8_aW13PTYzNyZpbWg9MzU4JmltYT1maXQmaW1wb2xpY3k9TGV0dGVyYm94JmltY29sb3I9JTIzMDAwMDAwJmxldHRlcmJveD10cnVlIiwibmFtZSI6ItCi0LXRgdGC0L7QsiDQotC10YHRgiIsImVtYWlsIjoibW9kZXJhdG9yQGV4YW1wbGUuY29tIiwiaWQiOiIxIn19LCJuYmYiOjE2ODIzMTkwOTUsImV4cCI6MTc3NTM0OTYzNCwiYXVkIjoiYjMyNjVhZTM1YTFiMzRkMWEzNjA3MzhjYWY4ZDBmOTYzZWUyOWZiMDljMGY1MmYwNzkzNDVjN2NjMjQ1NzlkMyIsImlzcyI6ImIzMjY1YWUzNWExYjM0ZDFhMzYwNzM4Y2FmOGQwZjk2M2VlMjlmYjA5YzBmNTJmMDc5MzQ1YzdjYzI0NTc5ZDMiLCJzdWIiOiJtY3pyLXRtay5ydSIsInJvb20iOiIqIiwibW9kZXJhdG9yIjp0cnVlfQ.2vHd4nvTpbl4H6qbuOafzVRSkJqSxDa7dihvA1-fAzo
    
    return (
        <div>
            <JitsiMeeting
                domain = { domain }
                roomName = { roomName }
                jwt = { jwt }
                configOverwrite = {{
                    startWithAudioMuted: true,
                    disableModeratorIndicator: false,
                    startScreenSharing: true,
                    enableEmailInStats: false,
                    resolution: 720,
                    prejoinPageEnabled: false
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
                    /* TOOLBAR_BUTTONS: ["microphone", "camera", "desktop", 'fullscreen', 'chat', 'hangup'], */
                    TOOLBAR_BUTTONS: ['microphone', 'camera', 'desktop', 'fullscreen',
                    'fodeviceselection', 'recording', 'security',
                     
                    'videoquality', 'filmstrip', 
                    'tileview', 'videobackgroundblur', 'download', 'participants-pane', 'pip', 'speakerstats',
                    'mute-everyone'],
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
                
                
                /* userInfo = {{
                    
                }}, */
                displayName = {'YOUR_USERNAME'}
                onApiReady = { (externalApi) => {
                   // const waterMarks = document.getElementsByClassName('watermark')
                } }
                getIFrameRef = { (iframeRef) => { iframeRef.style.height = '800px'; } }
                containerStyles = {{display: 'flex', flex: 1}}
            />
        </div>
    )
}

export default Jitsi