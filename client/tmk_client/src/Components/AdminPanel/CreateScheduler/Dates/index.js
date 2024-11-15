import {useEffect, useState, useContext} from 'react'
import Header from '../../Header'
import { Scheduler } from "@aldabil/react-scheduler";
import {ru } from "date-fns/locale";
import russianTranslition from '../../../../Assets/translate/russianTranslition';

import dayjs from 'dayjs';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Context } from '../../../../';
import { IconButton, Snackbar } from "@mui/material";
import DoctorService from '../../../../Services/DoctorService';

function CreateDateSchedule() {
    const {store} = useContext(Context)
    let [events, setEvents] = useState([
    ])

    const handleEventDelete = (event) => {
        
        let newEvents = events.filter((item) => item.event_id !== event)
        setEvents(newEvents)
    }

    /* useEffect(() => {
        async function fetchSchedule() {
            console.log(store.user)
            if (store.user?.personId) {
                const response = await DoctorService.getSchedule(store.user.personId);
                const newSchedule = { ...schedule };
    
                response.data.forEach(el => {
                    const day = el.WeekDay.name;
                    const start = el.scheduleStartTime.substring(0,5);
                    const end = el.scheduleEndTime.substring(0,5);
                    const id = el.id
                    
                    if (!newSchedule[day]) newSchedule[day] = [];
                    newSchedule[day].push({ start, end, id });
                });
    
                setSchedule(newSchedule);
            }
        }
        fetchSchedule();
    }, [store]); */

    useEffect(() => {
        async function fetchSchedule() {
            try {
                if (store.user?.personId) {
                    const response = await DoctorService.getSchedule(store.user.personId);
                    /* const newSchedule = { ...events }; */
                    console.log(response)
                    response.data.forEach(el => {
                        const day = el.WeekDay.name;
                        const start = el.scheduleStartTime.substring(0,5);
                        const end = el.scheduleEndTime.substring(0,5);
                        const date = el.Date
                        const id = el.id
                        
                        /* if (!newSchedule[day]) newSchedule[day] = [];
                        newSchedule[day].push({ start, end, id }); */
                    });
                    /* response.data[0].map((slot) => {
                        const newEvent = {
                            event_id: slot.id || Math.random(),
                            title: `Конференция ${slot?.dSecondName} ${slot?.dFirstName}`,
                            start: new Date(slot.slotStartDateTime),
                            end: new Date(slot.slotEndDateTime),
                            description: `Конференция. Врач: ${slot?.dSecondName} ${slot?.dFirstName}. Пациент: ${slot?.pSecondName} ${slot?.pFirstName}`,
                            patientUrl: process.env.REACT_APP_SERVER_URL + '/short/' + slot.pUrl,
                            doctorUrl:  process.env.REACT_APP_SERVER_URL + '/short/' + slot.dUrl,
                            doctorId: slot.doctorId,
                            patientId: slot.patientId,
                            dotorSecondName: slot?.dSecondName,
                            dotorFirstName: slot?.dFirstName,
                            patientSecondName: slot?.pSecondName,
                            patientFirstName: slot?.pFirstName,
                        }
                        setEvents((prevEvents) => [...prevEvents, newEvent]);
                    }) */
                    return response.data[0]
                }
                
            }
            catch (e) {
                alert(e.response.data.error)
            }
            
        }
        fetchSchedule()
    }, [])


    const handleEventsChange = (event) => {
        /* console.log(event) */
    }

    const handleConfirm = async (newEvent, action) => {
        /* console.log(newEvent) */
        // Логика для создания нового события
        if (action === 'create') {
            setEvents((prevEvents) => [...prevEvents, newEvent]);
        }
        // Логика для обновления существующего события
        else if (action === 'edit') {
            setEvents((prevEvents) =>
                prevEvents.map((evt) =>
                evt.event_id === newEvent.event_id
                    ? { ...evt, title: newEvent.title, start: newEvent.start, end: newEvent.end, description: newEvent.description, patientUrl: newEvent.patientUrl, doctorUrl: newEvent.doctorUrl }
                    : evt
                )
            );
        }
    
        return newEvent;
    };

    const handleClickCopy = (event, url) => {
        navigator.clipboard.writeText(url).then(() => {
            setOpen(true);
        }, (err) => {
            console.error('Could not copy text: ', err);
        });
    };

    const [open, setOpen] = useState(false);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };
    const css = `
        .css-s22wio {
                    width: 420px;
                }
    `
    useEffect(() => {console.log(store.user)}, [store])
  
    return (
        <>
            <style>
                {css}
            </style>
            <Header/>
            <Scheduler
                view="week"
                /* disableViewNavigator={true} */
                locale={ru}
                translations={russianTranslition}
                hourFormat='24'
                month={
                    {
                        weekDays: [0, 1, 2, 3, 4, 5], 
                        weekStartOn: 1, 
                        startHour: 8, 
                        endHour: 22,
                        navigation: true,
                        disableGoToDay: false,
                        
                    }
                }
                week={{
                    weekDays: [0, 1, 2, 3, 4, 5], 
                    weekStartOn: 1, 
                    startHour: 8, 
                    endHour: 22,
                    step: 60,
                    navigation: true,
                    disableGoToDay: false
                }}      
                day={{
                    startHour: 8, 
                    endHour: 22, 
                    step: 60,
                    navigation: true
                }}
                /* fields={[
                    {
                        name: "patientUrl",
                        type: "input",
                        // Should provide options with type:"select"
                        config: { label: "Ссылка для пациента", required: false, errMsg: "Нет ссылки, обратитесь в поддержку" }
                    },
                    {
                        name: "doctorUrl",
                        type: "input",
                        // Should provide options with type:"select"
                        config: { label: "Ссылка для врача", required: false, errMsg: "Нет ссылки, обратитесь в поддержку" }
                    },
                    {
                        name: "Description",
                        type: "input",
                        default: "Описание",
                        config: { label: "Описание", multiline: true, rows: 4 }
                    },
                    {
                        name: "doctorId",
                        type: "input"
                    },
                    {
                        name: "patientId",
                        type: "input"
                    }
                ]} */
                deletable={false}
                draggable={false}
                events={events}
                editable={true}
                onConfirm={handleConfirm}
                onDelete={handleEventDelete} 
                /* customEditor={(scheduler) => <CustomEditor scheduler={scheduler} onStateChange={handleEventsChange} onConfirm={handleConfirm}/>}
                viewerExtraComponent={(fields, event) => {
                    return (
                      <div>
                        <p style={{fontSize: '1rem'}}>{event.description || ''}</p>
                        <p style={{fontSize: '1rem'}}>
                            Ссылка для подключения Врача: 
                            <a href={event.doctorUrl} target='_blank'>{` ${event.doctorUrl}`}</a>
                            <IconButton
                                id={`${event.id}-doctorCopy`}
                                aria-label="toggle password visibility"
                                onClick={e => handleClickCopy(e, event.doctorUrl)}
                            >
                                <ContentCopyIcon />
                            </IconButton></p>
                        <p style={{fontSize: '1rem'}}>
                            Ссылка для подключения Пациента: 
                            <a href={event.patientUrl} target='_blank'>{` ${event.patientUrl}`}</a>
                            <IconButton
                                id={`${event.id}-patientCopy`}
                                aria-label="toggle password visibility"
                                onClick={e => handleClickCopy(e, event.patientUrl)}
                            >
                                <ContentCopyIcon />
                            </IconButton></p>
                      </div>
                    );
                }} */
            />
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                }}
                open={open}
                autoHideDuration={800}
                onClose={handleClose}
                message="Скопировано"
            />
        </>
      
    )
}

export default CreateDateSchedule

