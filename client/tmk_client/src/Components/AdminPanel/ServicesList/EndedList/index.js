import React, { useEffect, useContext, useState } from 'react';
import AdminHeader from '../../Header';
import DoctorService from '../../../../Services/DoctorService';
import { Context } from '../../../..';
import DataGrid from '../../../DataGrid'; // Здесь изменил импорт
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Box, IconButton, Input, FormControl, InputLabel, InputAdornment, Snackbar, Button } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import moment from 'moment-timezone';
import { LocalizationContext } from '../../../../Utils/LocalizationContext';
import EditProtocolModal from '../../Modals/Protocol/Edit';

function Index() {
    const { store } = useContext(Context);
    const [consultations, setConsultations] = useState([]);
    const [expandedRowIds, setExpandedRowIds] = useState([]);

    const [selectedConsultation, setSelectedConsultation] = useState(null);
    const [editProtocolModalOpen, setEditProtocolModalOpen] = useState(false);
    const handleChangeProtocolModalOpen = () => {setEditProtocolModalOpen(true)}
    const handleChangeProtocolModalClose = () => {setEditProtocolModalOpen(false)}



    const handleExpandClick = (id) => {
        setExpandedRowIds((prevState) => {
            return (prevState.includes(id) ? prevState.filter(rowId => rowId !== id) : [...prevState, id]);
        });
    };


    const handleChangeProtocol = (id) => {

    }

    const columns = [
        {
            field: "expand",
            headerName: "",
            renderCell: (cellValues) => {
                if (cellValues.row.detail) {
                    return '';
                }
                return (
                    <IconButton onClick={() => handleExpandClick(cellValues.row.id)}>
                        {expandedRowIds.includes(cellValues.row.id) ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                );
            },
            width: 60,
            disableColumnSort: true
        },
        { 
            field: "patient", 
            headerName: "Пациент", 
            renderCell: (cellValues) => {
                if (!cellValues.row.expanded) {
                    return (cellValues.row.patient);
                }
                else if (cellValues.row.patient) {
                    return cellValues.row.patient;
                }
                return cellValues.value;
            },
            disableColumnSort: true
        },
        { 
            field: "slotStartDateTime", 
            headerName: "Начало конференции", 
            renderCell: (cellValues) => {
                if (!cellValues.row.detail) {
                    return moment(cellValues.row.slotStartDateTime).format('DD.MM.YYYY HH:mm');
                }
                return cellValues.value;
            },
            /* width: 30, */
            disableColumnSort: true
        },
        { 
            field: "slotStartEndTime", 
            headerName: "Конец конференции", 
            renderCell: (cellValues) => {
                if (!cellValues.row.detail) {
                    return moment(cellValues.row.slotEndDateTime).format('DD.MM.YYYY HH:mm');
                }
                return cellValues.value;
            },
            /* width: 30, */
            disableColumnSort: true
        },
        { 
            field: "protocol", 
            headerName: "Протокол ТМК", 
            renderCell: (cellValues) => {
                /* if (!cellValues.row.detail) {
                    return (<a target='_blank' href={`http://localhost/short/${cellValues.row.dUrl}`} >Подключиться</a>);
                } */
                if (cellValues.row.protocol) {
                    return cellValues.row.protocol;
                }
                return cellValues.value;
            },
            disableColumnSort: true
        },
        { 
            field: "button", 
            headerName: "Изменить", 
            renderCell: (cellValues) => {
                return (
                    <>
                        <Button onClick={() => {
                            setEditProtocolModalOpen(true);
                            setSelectedConsultation(cellValues.row);
                        }}>
                            Изменить
                        </Button>
                        {editProtocolModalOpen && selectedConsultation.id === cellValues.row.id && (
                            <EditProtocolModal
                                isOpen={editProtocolModalOpen}
                                onClose={handleChangeProtocolModalClose}
                                consultation={selectedConsultation}
                            />
                        )}
                    </>
                    
                )
            },
            width: 100,
            disableColumnSort: true
        },
    ];

    useEffect(() => {
        if (store?.user?.id) {
            async function fetchConsultations() {
                try {
                    const response = await DoctorService.getEndedConsultations(store.user.id);
                    let array = response.data[0]
                    array = array.filter(item => item.type !== "protocol");
                    array.forEach(function(part, index, theArray) {
                        theArray[index].patient = `Пациент: ${theArray[index].pSecondName} ${theArray[index].pFirstName}`;
                        /* theArray[index].url = theArray[index].dUrl; */
                    });
                    console.log(array)
                    setConsultations(array);

                } catch (e) {
                    console.log(e);
                }
            }
            fetchConsultations();
        }
    }, [store]);

    const [open, setOpen] = useState(false);

    const handleClickCopy = (event, url) => {
        navigator.clipboard.writeText(url).then(() => {
            setOpen(true);
        }, (err) => {
            console.error('Could not copy text: ', err);
        });
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const rowsWithDetail = consultations.reduce((acc, row) => {
        acc.push(row);
        if (expandedRowIds.includes(row.id)) {
            acc.push({
                id: `${row.id}-detail`,
                detail: true,
                patient: (
                    <Box>
                        {row.patient} {row.pPatronomicName}
                    </Box>
                        
                    
                ),
                slotStartDateTime: (
                    <Box>
                        {moment(row.slotStartDateTime).format('DD.MM.YYYY HH:mm')}
                    </Box>
                ),
                slotEndDateTime: (
                    <Box>
                        {moment(row.slotEndDateTime).format('DD.MM.YYYY HH:mm')}
                    </Box>
                ),
                protocol: (
                    <></>
                )
            });
            acc.push({
                id: `${row.id}-detail2`,
                detail: true,
                patient: (
                    <Box>
                        {row.dSecondName} {row.dFirstName} {row.dPatronomicName}
                    </Box>
                ),
                slotStartDateTime: (
                    <Box>
                        {moment(row.slotStartDateTime).format('DD.MM.YYYY HH:mm')}
                    </Box>
                ),
                slotStartEndTime: (
                    <Box>
                        {moment(row.slotEndDateTime).format('DD.MM.YYYY HH:mm')}
                    </Box>
                ),
                protocol: (
                    <>
                        
                    </>
                )
            });
        }
        return acc;
    }, []);

    return (
        <LocalizationContext>
            <AdminHeader/>
            <Box sx={{ height: '100%', width: '100%' }}>
                <DataGrid rowsWithDetail={rowsWithDetail} columns={columns} />
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
            </Box>
        </LocalizationContext>
    );
}

export default Index;
