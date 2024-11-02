import React, { useEffect, useContext, useState } from 'react';
import { Container, Button, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Link } from 'react-router-dom';
import Header from '../../Header';
import menuItems from '../../../SubMenu/AdminDoctorManagmentSub';
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
        headerName: 'Врач', 
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
                    to={`/doctors/edit/${params.row.id}`}
                    variant="outlined"
                >
                    Редактировать
                </Button>
            )
        },
    },
];
const DoctorList = () => {

    const { store } = useContext(Context);
    const [doctors, setDoctors] = useState([]);
    const [error, setError] = useState('')
    useEffect(() => {
        if (store?.user?.id) {
            async function fetchPatients() {
                try {
                    const response = await AdminService.getDoctors()
                    let array = response.data

                    setDoctors(array);

                } catch (e) {
                    /* alert(e.response.data) */
                    setError(e.response.data);
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
                    <h2>Список врачей</h2>
                    <Button variant="contained" color="primary" component={Link} to="/doctors/create">
                        Создать
                    </Button>
                </Box>
                <Box sx={{ height: 600, width: '100%' }}>
                    {doctors.length > 0 && error.length == 0 ?
                        <DataGrid
                            localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
                            rows={doctors}
                            columns={columns}
                            pageSize={5}
                            rowsPerPageOptions={[5]}
                        />
                        : (error.length > 0 ? <h2>{error}</h2> : <LoadingScreen/>)
                    }
                </Box>
            </Container>
        </>
    );
};

export default DoctorList;
