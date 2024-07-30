import React, { useState, useEffect } from 'react';
import './Calendar.css'; // Подключаем файл со стилями
import { Button, Row } from 'react-bootstrap';

const Index = ({ data }) => {
    const [schedule, setSchedule] = useState([]);
    const [selectedDay, setSelectedDay] = useState(null);
  
    useEffect(() => {
        const today = new Date();
        const nextTwoWeeks = Array.from({ length: 14 }, (_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        return date;
        });

        const groupedData = nextTwoWeeks.map(date => {
            const dateString = (date.toISOString().split('T')[0]).replaceAll('-','.');
            const dayData = data.filter(d => d.date === dateString);
            return {
                date,
                dayData
            };
        });
        console.log(data)
        setSchedule(groupedData);
    }, [data]);

    const renderDayName = (date) => {
        const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
        return dayNames[date.getDay()];
    };

    const handleDayClick = (date) => {
        setSelectedDay(selectedDay === date ? null : date);
    };

    const setDateSelected = (event) => {
        console.log(event.nativeEvent.srcElement)
    }
    return (
        <div className="schedule-component">
            <div className="days">
                {schedule.map((day, index) => (
                <button 
                    key={index} 
                    className='day'
                    onClick={(event) => {
                        handleDayClick(day.date)
                        setDateSelected(event)
                    }}
                    disabled={day.dayData.length == 0}
                >
                    <div className="day-name">{renderDayName(day.date)}</div>
                    <div className="day-date">{day.date.getDate()}</div>
                </button>
                ))}
            </div>
            <div className="timeslots">
                {schedule.map((day, index) => (
                day.date === selectedDay && (
                    <div key={index} className="timeslots-day row">
                    {day.dayData.map((slot, slotIndex) => (
                        <Button variant="primary" size="lg" key={slotIndex} className="timeslot col">
                            {slot.stime}{/*  - {slot.etime} */}
                        
                        </Button>
                    ))}
                    </div>
                )
                ))}
            </div>
        </div>
    );
};

export default Index;
