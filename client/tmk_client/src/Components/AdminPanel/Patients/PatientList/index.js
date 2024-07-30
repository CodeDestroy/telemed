import React, { useEffect, useContext, useState } from 'react';
import { Container, Button, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import Header from '../../Header';
import menuItems from '../../../SubMenu/AdminPatientManagmentSub';
import SubMenu from '../../../SubMenu';
import { ruRU } from "@mui/x-data-grid/locales";
import { Context } from '../../../..';
import AdminService from '../../../../Services/AdminService';
import LoadingScreen from '../../../Loading';
import moment from 'moment-timezone';
import Avatar from '@mui/material/Avatar';

const columns = [
    { 
        field: 'avatar', 
        headerName: '', 
        width: 70 ,
        renderCell: (cellValues) => {
            return <Avatar sx={{mt: 0.5}} alt="Remy Sharp" src={cellValues.row.user.avatar} />
            
        } 
    },
    { 
        field: 'secondName', 
        headerName: 'Пациент', 
        width: 400 ,
        renderCell: (cellValues) => {
            return `${cellValues.row.secondName} ${cellValues.row.firstName} ${cellValues.row.patronomicName}`
            
        } 
    },
    /* { field: 'firstName', headerName: 'Имя', width: 400 }, */
    { 
        field: 'birthDate', 
        headerName: 'Дата рождения', 
        width: 300,
        renderCell: (cellValues) => {
            if (!cellValues.row.detail) {
                return moment(cellValues.row.birthDate).format('DD.MM.YYYY');
            }
            return cellValues.value;
        },
    },
    {
        field: 'actions',
        headerName: 'Действия',
        width: 250,
        renderCell: (params) => { 
            return (
                <Button
                    component={Link}
                    to={`/patients/edit/${params.row.id}`}
                    variant="outlined"
                >
                    Редактировать
                </Button>
            )
        },
    },
];
const PatientList = () => {

    const { store } = useContext(Context);
    const [patients, setPatients] = useState([]);
    useEffect(() => {
        if (store?.user?.id) {
            async function fetchPatients() {
                try {
                    const response = await AdminService.getPatients()
                    let array = response.data

                    setPatients(array);

                } catch (e) {
                    console.log(e);
                }
            }
            fetchPatients();
        }
    }, [store]);

    return (
        <>
            <Header/>
            <SubMenu menuItems={menuItems} />
            <Container>
                <Box display="flex" justifyContent="space-between" alignItems="center" my={2}>
                    <h2>Список пациентов</h2>
                    <Button variant="contained" color="primary" component={Link} to="/patients/create">
                        Создать
                    </Button>
                </Box>
                <Box sx={{ height: 600, width: '100%' }}>
                    {patients.length > 0 ?
                        <DataGrid
                            localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
                            rows={patients}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                        />
                        :
                        <LoadingScreen/>
                    }
                </Box>
            </Container>
        </>
    );
};

export default PatientList;
