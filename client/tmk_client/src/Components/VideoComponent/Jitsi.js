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
    const domain = 'mczr-tmk.ru'
    /* const [time, setTime] = useState(props.timerSeconds) */
    const jwt = props.token
    let localId = 0;
    /* let time = props.timerSeconds; */
    const JitsiRef = useRef(null)
    /* const [avatar, setAvatar] = useState('http://distant-assistant.ru:80') */
    const [showProtocolModal, setProtocolModalShow] = useState(false);

    const handleProtocolModalClose = () => setProtocolModalShow(false);
    const handleProtocolModalShow = () => setProtocolModalShow(true);

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
    

    //Андрей Евгеньевич
    //http://localhost:3000/room/sometestroomname?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb250ZXh0Ijp7InVzZXIiOnsiYXZhdGFyIjoiaHR0cHM6Ly9zdGVhbXVzZXJpbWFnZXMtYS5ha2FtYWloZC5uZXQvdWdjLzIyMDQwMDkyMDY0Nzk3MDcwNjkvMDI5MTY4QTdDNDQ5MDJBNDVDQzdBMDFENEEzQTY4MzQ3NkQxNjUxOS8_aW13PTYzNyZpbWg9MzU4JmltYT1maXQmaW1wb2xpY3k9TGV0dGVyYm94JmltY29sb3I9JTIzMDAwMDAwJmxldHRlcmJveD10cnVlIiwibmFtZSI6ItCd0L7QstC40YfQuNGF0LjQvSDQkNC90LTRgNC10Lkg0JXQstCz0LXQvdGM0LXQstC40YciLCJlbWFpbCI6Im1vZGVyYXRvckBleGFtcGxlLmNvbSIsImlkIjoiMSJ9fSwibmJmIjoxNjgyMzE5MDk1LCJleHAiOjE3NzUzNDk2MzQsImF1ZCI6ImIzMjY1YWUzNWExYjM0ZDFhMzYwNzM4Y2FmOGQwZjk2M2VlMjlmYjA5YzBmNTJmMDc5MzQ1YzdjYzI0NTc5ZDMiLCJpc3MiOiJiMzI2NWFlMzVhMWIzNGQxYTM2MDczOGNhZjhkMGY5NjNlZTI5ZmIwOWMwZjUyZjA3OTM0NWM3Y2MyNDU3OWQzIiwic3ViIjoibWN6ci10bWsucnUiLCJyb29tIjoiKiIsIm1vZGVyYXRvciI6dHJ1ZX0.uIKhf6HKv7RzlaY1gYajoaRw4T4ee85_170xyVOa0E4
    //https://distant-assistant.ru:9443/room/sometestroomname?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb250ZXh0Ijp7InVzZXIiOnsiYXZhdGFyIjoiaHR0cHM6Ly9zdGVhbXVzZXJpbWFnZXMtYS5ha2FtYWloZC5uZXQvdWdjLzIyMDQwMDkyMDY0Nzk3MDcwNjkvMDI5MTY4QTdDNDQ5MDJBNDVDQzdBMDFENEEzQTY4MzQ3NkQxNjUxOS8_aW13PTYzNyZpbWg9MzU4JmltYT1maXQmaW1wb2xpY3k9TGV0dGVyYm94JmltY29sb3I9JTIzMDAwMDAwJmxldHRlcmJveD10cnVlIiwibmFtZSI6ItCd0L7QstC40YfQuNGF0LjQvSDQkNC90LTRgNC10Lkg0JXQstCz0LXQvdGM0LXQstC40YciLCJlbWFpbCI6Im1vZGVyYXRvckBleGFtcGxlLmNvbSIsImlkIjoiMSJ9fSwibmJmIjoxNjgyMzE5MDk1LCJleHAiOjE3NzUzNDk2MzQsImF1ZCI6ImIzMjY1YWUzNWExYjM0ZDFhMzYwNzM4Y2FmOGQwZjk2M2VlMjlmYjA5YzBmNTJmMDc5MzQ1YzdjYzI0NTc5ZDMiLCJpc3MiOiJiMzI2NWFlMzVhMWIzNGQxYTM2MDczOGNhZjhkMGY5NjNlZTI5ZmIwOWMwZjUyZjA3OTM0NWM3Y2MyNDU3OWQzIiwic3ViIjoibWN6ci10bWsucnUiLCJyb29tIjoiKiIsIm1vZGVyYXRvciI6dHJ1ZX0.uIKhf6HKv7RzlaY1gYajoaRw4T4ee85_170xyVOa0E4
    
    //Андрей без авы
    //http://localhost:3000/room/sometestroomname?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb250ZXh0Ijp7InVzZXIiOnsiYXZhdGFyIjoiIiwibmFtZSI6ItCd0L7QstC40YfQuNGF0LjQvSDQkNC90LTRgNC10Lkg0JXQstCz0LXQvdGM0LXQstC40YciLCJlbWFpbCI6Im1vZGVyYXRvckBleGFtcGxlLmNvbSIsImlkIjoiMSJ9fSwibmJmIjoxNjgyMzE5MDk1LCJleHAiOjE3NzUzNDk2MzQsImF1ZCI6ImIzMjY1YWUzNWExYjM0ZDFhMzYwNzM4Y2FmOGQwZjk2M2VlMjlmYjA5YzBmNTJmMDc5MzQ1YzdjYzI0NTc5ZDMiLCJpc3MiOiJiMzI2NWFlMzVhMWIzNGQxYTM2MDczOGNhZjhkMGY5NjNlZTI5ZmIwOWMwZjUyZjA3OTM0NWM3Y2MyNDU3OWQzIiwic3ViIjoibWN6ci10bWsucnUiLCJyb29tIjoiKiIsIm1vZGVyYXRvciI6dHJ1ZX0.QxXEiZnHSaLrVCRBmHlcy-VpDTTVaKBgfqL27kvu6IY

    //пациент 2
    //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb250ZXh0Ijp7InVzZXIiOnsiYXZhdGFyIjoiaHR0cHM6Ly93d3cuZnJlZWljb25zcG5nLmNvbS90aHVtYnMvcGF0aWVudC1pY29uL3BhdGllbnQtaWNvbi1wbmctMjEucG5nIiwibmFtZSI6ItCf0LDRhtC40LXQvdGC0L7QsiDQn9Cw0YbQuNC10L3RgiIsImVtYWlsIjoibW9kZXJhdG9yQGV4YW1wbGUuY29tIiwiaWQiOiIyIn19LCJuYmYiOjE2ODIzMTkwOTUsImV4cCI6MTc3NTM0OTYzNCwiYXVkIjoiYjMyNjVhZTM1YTFiMzRkMWEzNjA3MzhjYWY4ZDBmOTYzZWUyOWZiMDljMGY1MmYwNzkzNDVjN2NjMjQ1NzlkMyIsImlzcyI6ImIzMjY1YWUzNWExYjM0ZDFhMzYwNzM4Y2FmOGQwZjk2M2VlMjlmYjA5YzBmNTJmMDc5MzQ1YzdjYzI0NTc5ZDMiLCJzdWIiOiJtY3pyLXRtay5ydSIsInJvb20iOiIqIiwibW9kZXJhdG9yIjp0cnVlfQ.AnY0cxFg6y0hjOpz-sdn5BF3v80uSfgQQnD4Je_FiuE


    //пользователь 
    //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb250ZXh0Ijp7InVzZXIiOnsiYXZhdGFyIjoiaHR0cHM6Ly9lNy5wbmdlZ2cuY29tL3BuZ2ltYWdlcy84NC8xNjUvcG5nLWNsaXBhcnQtdW5pdGVkLXN0YXRlcy1hdmF0YXItb3JnYW5pemF0aW9uLWluZm9ybWF0aW9uLXVzZXItYXZhdGFyLXNlcnZpY2UtY29tcHV0ZXItd2FsbHBhcGVyLnBuZyIsIm5hbWUiOiLQn9C-0LvRjNC30L7QstCw0YLQtdC70YwiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJpZCI6IjMifX0sIm5iZiI6MTY4MjMxOTA5NSwiZXhwIjoxNzc1MzQ5NjM0LCJhdWQiOiJiMzI2NWFlMzVhMWIzNGQxYTM2MDczOGNhZjhkMGY5NjNlZTI5ZmIwOWMwZjUyZjA3OTM0NWM3Y2MyNDU3OWQzIiwiaXNzIjoiYjMyNjVhZTM1YTFiMzRkMWEzNjA3MzhjYWY4ZDBmOTYzZWUyOWZiMDljMGY1MmYwNzkzNDVjN2NjMjQ1NzlkMyIsInN1YiI6Im1jenItdG1rLnJ1Iiwicm9vbSI6IioiLCJtb2RlcmF0b3IiOmZhbHNlfQ.oyM4hkUyvcIT-nBgYKIYf2ShM3aeCqhyRGtf7J5gPDQ
    //https://distant-assistant.ru:9443/room/sometestroomname?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb250ZXh0Ijp7InVzZXIiOnsiYXZhdGFyIjoiaHR0cHM6Ly9lNy5wbmdlZ2cuY29tL3BuZ2ltYWdlcy84NC8xNjUvcG5nLWNsaXBhcnQtdW5pdGVkLXN0YXRlcy1hdmF0YXItb3JnYW5pemF0aW9uLWluZm9ybWF0aW9uLXVzZXItYXZhdGFyLXNlcnZpY2UtY29tcHV0ZXItd2FsbHBhcGVyLnBuZyIsIm5hbWUiOiLQn9C-0LvRjNC30L7QstCw0YLQtdC70YwiLCJlbWFpbCI6InVzZXJAZXhhbXBsZS5jb20iLCJpZCI6IjMifX0sIm5iZiI6MTY4MjMxOTA5NSwiZXhwIjoxNzc1MzQ5NjM0LCJhdWQiOiJiMzI2NWFlMzVhMWIzNGQxYTM2MDczOGNhZjhkMGY5NjNlZTI5ZmIwOWMwZjUyZjA3OTM0NWM3Y2MyNDU3OWQzIiwiaXNzIjoiYjMyNjVhZTM1YTFiMzRkMWEzNjA3MzhjYWY4ZDBmOTYzZWUyOWZiMDljMGY1MmYwNzkzNDVjN2NjMjQ1NzlkMyIsInN1YiI6Im1jenItdG1rLnJ1Iiwicm9vbSI6IioiLCJtb2RlcmF0b3IiOmZhbHNlfQ.oyM4hkUyvcIT-nBgYKIYf2ShM3aeCqhyRGtf7J5gPDQ

    //пользоваетль 2 его https://distant-assistant.ru:8441/short/h9Lsveq3RS2  !!!!!!!!!!!!!!! h12sveq3TF2
    //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb250ZXh0Ijp7InVzZXIiOnsiYXZhdGFyIjoiaHR0cHM6Ly9lNy5wbmdlZ2cuY29tL3BuZ2ltYWdlcy84NC8xNjUvcG5nLWNsaXBhcnQtdW5pdGVkLXN0YXRlcy1hdmF0YXItb3JnYW5pemF0aW9uLWluZm9ybWF0aW9uLXVzZXItYXZhdGFyLXNlcnZpY2UtY29tcHV0ZXItd2FsbHBhcGVyLnBuZyIsIm5hbWUiOiLQn9C-0LvRjNC30L7QstCw0YLQtdC70YwgMiIsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsImlkIjoiNCJ9fSwibmJmIjoxNjgyMzE5MDk1LCJleHAiOjE3NzUzNDk2MzQsImF1ZCI6ImIzMjY1YWUzNWExYjM0ZDFhMzYwNzM4Y2FmOGQwZjk2M2VlMjlmYjA5YzBmNTJmMDc5MzQ1YzdjYzI0NTc5ZDMiLCJpc3MiOiJiMzI2NWFlMzVhMWIzNGQxYTM2MDczOGNhZjhkMGY5NjNlZTI5ZmIwOWMwZjUyZjA3OTM0NWM3Y2MyNDU3OWQzIiwic3ViIjoibWN6ci10bWsucnUiLCJyb29tIjoiKiIsIm1vZGVyYXRvciI6ZmFsc2V9.km07xLmp0tleYj8oWSibr9PaH8MEm44hVY5JXEldnmI
    //https://distant-assistant.ru:9443/room/sometestroomname?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb250ZXh0Ijp7InVzZXIiOnsiYXZhdGFyIjoiaHR0cHM6Ly9lNy5wbmdlZ2cuY29tL3BuZ2ltYWdlcy84NC8xNjUvcG5nLWNsaXBhcnQtdW5pdGVkLXN0YXRlcy1hdmF0YXItb3JnYW5pemF0aW9uLWluZm9ybWF0aW9uLXVzZXItYXZhdGFyLXNlcnZpY2UtY29tcHV0ZXItd2FsbHBhcGVyLnBuZyIsIm5hbWUiOiLQn9C-0LvRjNC30L7QstCw0YLQtdC70YwgMiIsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsImlkIjoiNCJ9fSwibmJmIjoxNjgyMzE5MDk1LCJleHAiOjE3NzUzNDk2MzQsImF1ZCI6ImIzMjY1YWUzNWExYjM0ZDFhMzYwNzM4Y2FmOGQwZjk2M2VlMjlmYjA5YzBmNTJmMDc5MzQ1YzdjYzI0NTc5ZDMiLCJpc3MiOiJiMzI2NWFlMzVhMWIzNGQxYTM2MDczOGNhZjhkMGY5NjNlZTI5ZmIwOWMwZjUyZjA3OTM0NWM3Y2MyNDU3OWQzIiwic3ViIjoibWN6ci10bWsucnUiLCJyb29tIjoiKiIsIm1vZGVyYXRvciI6ZmFsc2V9.km07xLmp0tleYj8oWSibr9PaH8MEm44hVY5JXEldnmI

    //пользоваетль 3 и его https://distant-assistant.ru:8441/short/gT5mK1aZJ3  !!!!!!!!!!!!! gT5n61ayR3
    //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb250ZXh0Ijp7InVzZXIiOnsiYXZhdGFyIjoiaHR0cHM6Ly9lNy5wbmdlZ2cuY29tL3BuZ2ltYWdlcy84NC8xNjUvcG5nLWNsaXBhcnQtdW5pdGVkLXN0YXRlcy1hdmF0YXItb3JnYW5pemF0aW9uLWluZm9ybWF0aW9uLXVzZXItYXZhdGFyLXNlcnZpY2UtY29tcHV0ZXItd2FsbHBhcGVyLnBuZyIsIm5hbWUiOiLQn9C-0LvRjNC30L7QstCw0YLQtdC70YwgMyIsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsImlkIjoiNSJ9fSwibmJmIjoxNjgyMzE5MDk1LCJleHAiOjE3NzUzNDk2MzQsImF1ZCI6ImIzMjY1YWUzNWExYjM0ZDFhMzYwNzM4Y2FmOGQwZjk2M2VlMjlmYjA5YzBmNTJmMDc5MzQ1YzdjYzI0NTc5ZDMiLCJpc3MiOiJiMzI2NWFlMzVhMWIzNGQxYTM2MDczOGNhZjhkMGY5NjNlZTI5ZmIwOWMwZjUyZjA3OTM0NWM3Y2MyNDU3OWQzIiwic3ViIjoibWN6ci10bWsucnUiLCJyb29tIjoiKiIsIm1vZGVyYXRvciI6ZmFsc2V9.USO1e1Um1uw0r2gZk9zDpqHXe6tPQfgLto1CwxBXb7A
    //https://distant-assistant.ru:9443/room/sometestroomname?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb250ZXh0Ijp7InVzZXIiOnsiYXZhdGFyIjoiaHR0cHM6Ly9lNy5wbmdlZ2cuY29tL3BuZ2ltYWdlcy84NC8xNjUvcG5nLWNsaXBhcnQtdW5pdGVkLXN0YXRlcy1hdmF0YXItb3JnYW5pemF0aW9uLWluZm9ybWF0aW9uLXVzZXItYXZhdGFyLXNlcnZpY2UtY29tcHV0ZXItd2FsbHBhcGVyLnBuZyIsIm5hbWUiOiLQn9C-0LvRjNC30L7QstCw0YLQtdC70YwgMyIsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsImlkIjoiNSJ9fSwibmJmIjoxNjgyMzE5MDk1LCJleHAiOjE3NzUzNDk2MzQsImF1ZCI6ImIzMjY1YWUzNWExYjM0ZDFhMzYwNzM4Y2FmOGQwZjk2M2VlMjlmYjA5YzBmNTJmMDc5MzQ1YzdjYzI0NTc5ZDMiLCJpc3MiOiJiMzI2NWFlMzVhMWIzNGQxYTM2MDczOGNhZjhkMGY5NjNlZTI5ZmIwOWMwZjUyZjA3OTM0NWM3Y2MyNDU3OWQzIiwic3ViIjoibWN6ci10bWsucnUiLCJyb29tIjoiKiIsIm1vZGVyYXRvciI6ZmFsc2V9.USO1e1Um1uw0r2gZk9zDpqHXe6tPQfgLto1CwxBXb7A

    //пользователь 4
    //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb250ZXh0Ijp7InVzZXIiOnsiYXZhdGFyIjoiaHR0cHM6Ly9lNy5wbmdlZ2cuY29tL3BuZ2ltYWdlcy84NC8xNjUvcG5nLWNsaXBhcnQtdW5pdGVkLXN0YXRlcy1hdmF0YXItb3JnYW5pemF0aW9uLWluZm9ybWF0aW9uLXVzZXItYXZhdGFyLXNlcnZpY2UtY29tcHV0ZXItd2FsbHBhcGVyLnBuZyIsIm5hbWUiOiLQn9C-0LvRjNC30L7QstCw0YLQtdC70YwgNCIsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsImlkIjoiNiJ9fSwibmJmIjoxNjgyMzE5MDk1LCJleHAiOjE3NzUzNDk2MzQsImF1ZCI6ImIzMjY1YWUzNWExYjM0ZDFhMzYwNzM4Y2FmOGQwZjk2M2VlMjlmYjA5YzBmNTJmMDc5MzQ1YzdjYzI0NTc5ZDMiLCJpc3MiOiJiMzI2NWFlMzVhMWIzNGQxYTM2MDczOGNhZjhkMGY5NjNlZTI5ZmIwOWMwZjUyZjA3OTM0NWM3Y2MyNDU3OWQzIiwic3ViIjoibWN6ci10bWsucnUiLCJyb29tIjoiKiIsIm1vZGVyYXRvciI6ZmFsc2V9.a4oFfNiIK7h5CAgmdhiHwlK6ycWNfrNYXmkTBbqetvM
    
    //Астахов Георгий Васильевич этот
    //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb250ZXh0Ijp7InVzZXIiOnsiYXZhdGFyIjoiaHR0cHM6Ly9lNy5wbmdlZ2cuY29tL3BuZ2ltYWdlcy84NC8xNjUvcG5nLWNsaXBhcnQtdW5pdGVkLXN0YXRlcy1hdmF0YXItb3JnYW5pemF0aW9uLWluZm9ybWF0aW9uLXVzZXItYXZhdGFyLXNlcnZpY2UtY29tcHV0ZXItd2FsbHBhcGVyLnBuZyIsIm5hbWUiOiLQkNGB0YLQsNGF0L7QsiDQk9C10L7RgNCz0LjQuSDQktCw0YHQuNC70YzQtdCy0LjRhyIsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsImlkIjoiNyJ9fSwibmJmIjoxNjgyMzE5MDk1LCJleHAiOjE3NzUzNDk2MzQsImF1ZCI6ImIzMjY1YWUzNWExYjM0ZDFhMzYwNzM4Y2FmOGQwZjk2M2VlMjlmYjA5YzBmNTJmMDc5MzQ1YzdjYzI0NTc5ZDMiLCJpc3MiOiJiMzI2NWFlMzVhMWIzNGQxYTM2MDczOGNhZjhkMGY5NjNlZTI5ZmIwOWMwZjUyZjA3OTM0NWM3Y2MyNDU3OWQzIiwic3ViIjoibWN6ci10bWsucnUiLCJyb29tIjoiKiIsIm1vZGVyYXRvciI6ZmFsc2V9.UKNGR-RraQpT8Qfcuy3qE_nw43ubIQPKEiCXIVuByes
    //DYpEP78i5H  ASThY4QP38i12
    //https://distant-assistant.ru:8441/short/


    //новый домен
    //https://distant-assistant.ru:9443/room/sometestroomname?token=
    //https://distant-assistant.ru:9443/room/newroom?token=
    //https://distant-assistant.ru:9443/room/room?token=


    /* useEffect(() => {
        console.log(store.user)
    }, [store]) */

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
                console.log(date)
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

                    TOOLBAR_BUTTONS: ['microphone', 'camera', 'desktop', 'fullscreen',
                    'fodeviceselection', 'recording', 'hangup', 'chat',
                     
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

            { roomName && store.user?.doctor ?
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