import React, { useEffect, useContext, useState } from 'react';
import AdminHeader from '../../Header';
import AdminService from '../../../../Services/AdminService';
import { Context } from '../../../..';
import DataGrid from '../../../DataGrid'; // Здесь изменил импорт
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { Box, IconButton, Input, FormControl, InputLabel, InputAdornment, Snackbar } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import moment from 'moment-timezone';
import { LocalizationContext } from '../../../../Utils/LocalizationContext';
import SubMenu from '../../../SubMenu';
import adminLocations from '../../../../Locations/AdminLocations';

function AllSlots() {
    const { store } = useContext(Context);
    const [consultations, setConsultations] = useState([]);
    const [expandedRowIds, setExpandedRowIds] = useState([]);

    const handleExpandClick = (id) => {
        setExpandedRowIds((prevState) => {
            return (prevState.includes(id) ? prevState.filter(rowId => rowId !== id) : [...prevState, id]);
        });
    };

    const menuItems = new Map([
        ['Все слоты', adminLocations.slotsManagement],
        ['Создать', adminLocations.createConsultation],
        /* ['Редактировать', '/admin/slots/edit'],
        ['Удалить', '/admin/slots/delete'] */
    ]);

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
            sortable: false
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
            sortable: false
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
            sortable: false
        },
        { 
            field: "url", 
            headerName: "Информация", 
            renderCell: (cellValues) => {
                if (!cellValues.row.detail) {
                    return (
                        <FormControl sx={{ width: '20rem', ml: 0, mt: 1}} variant="standard">
                            <InputLabel htmlFor={`${cellValues.row.id}-copy`}>Ссылка для врача</InputLabel>
                            <Input
                                id="standard-adornment-password"
                                value={`http://localhost/short/${cellValues.row.dUrl}`}
                                endAdornment={
                                    <InputAdornment position="start" /* sx={{
                                        width: '5rem'
                                    }} */>
                                        <IconButton
                                            id={`${cellValues.row.id}-copy`}
                                            aria-label="toggle password visibility"
                                            onClick={event => handleClickCopy(event, `http://localhost/short/${cellValues.row.dUrl}`)}
                                        >
                                            <ContentCopyIcon />
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>
                        );
                }
                else if (cellValues.row.url) {
                    return cellValues.row.url;
                }
                return cellValues.value;
            },
            sortable: false
        },
    ];

    useEffect(() => {
        if (store?.user?.id) {
            async function fetchConsultations() {
                try {
                    const response = await AdminService.getConsultations();
                    let array = response.data[0]

                    array.forEach(function(part, index, theArray) {
                        theArray[index].patient = `Пациент: ${theArray[index].pSecondName} ${theArray[index].pFirstName}`;
                        theArray[index].url = theArray[index].dUrl;
                    });
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
                        <div>{row.patient} {row.pPatronomicName}</div>
                    </Box>
                        
                    
                ),
                slotStartDateTime: (
                    <Box>
                        <div>{moment(row.slotStartDateTime).format('DD.MM.YYYY HH:mm')}</div>
                    </Box>
                ),
                url: (
                    <FormControl sx={{ m: 1, width: '20rem', ml: 0, mt: 2.5 }} variant="standard">
                        <InputLabel htmlFor={`${row.id}-detail-url`}>Ссылка для пациента</InputLabel>
                        <Input
                            id="standard-adornment-password"
                            value={`http://localhost/short/${row.pUrl}`}
                            endAdornment={
                                <InputAdornment position="start" /* sx={{
                                    width: '5rem'
                                }} */>
                                    <IconButton
                                        id={`${row.id}-detail-copy`}
                                        aria-label="toggle password visibility"
                                        onClick={event => handleClickCopy(event, `http://localhost/short/${row.pUrl}`)}
                                    >
                                        <ContentCopyIcon />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                )
            });
            acc.push({
                id: `${row.id}-detail2`,
                detail: true,
                patient: (
                    <Box>
                        <div>Врач: {row.dSecondName} {row.dFirstName} {row.dPatronomicName}</div>
                    </Box>
                ),
                slotStartDateTime: (
                    <Box>
                        <div>{moment(row.slotStartDateTime).format('DD.MM.YYYY HH:mm')}</div>
                    </Box>
                ),
                url: (
                    <FormControl sx={{ m: 1, width: '20rem', ml: 0, mt: 2.5 }} variant="standard">
                        <InputLabel htmlFor={`${row.id}-detail-url`}>Ссылка для врача</InputLabel>
                        <Input
                            id="standard-adornment-password"
                            value={`http://localhost/short/${row.dUrl}`}
                            endAdornment={
                                <InputAdornment position="start" /* sx={{
                                    width: '5rem'
                                }} */>
                                    <IconButton
                                        id={`${row.id}-detail-copy`}
                                        aria-label="toggle password visibility"
                                        onClick={event => handleClickCopy(event, `http://localhost/short/${row.dUrl}`)}
                                    >
                                        <ContentCopyIcon />
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>
                )
            });
        }
        return acc;
    }, []);

    return (
        <LocalizationContext>
            <AdminHeader/>
            <SubMenu menuItems={menuItems}/>
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

export default AllSlots;
