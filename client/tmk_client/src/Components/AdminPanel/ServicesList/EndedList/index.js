import React, { useEffect, useContext, useState } from 'react';
import { Box, Button, Snackbar, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import moment from 'moment-timezone';
import AdminHeader from '../../Header';
import DoctorService from '../../../../Services/DoctorService';
import { Context } from '../../../..';
import { LocalizationContext } from '../../../../Utils/LocalizationContext';
import EditProtocolModal from '../../Modals/Protocol/Edit';

function EndedTMKPage() {
  const { store } = useContext(Context);
  const [consultations, setConsultations] = useState([]);
  const [selectedConsultation, setSelectedConsultation] = useState(null);
  const [editProtocolModalOpen, setEditProtocolModalOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleEditOpen = (consultation) => {
    setSelectedConsultation(consultation);
    setEditProtocolModalOpen(true);
  };

  const handleOpen = (consultation) => {
    window.location = '/consultation/' + consultation.id
  }

  const handleEditClose = () => {
    setSelectedConsultation(null);
    setEditProtocolModalOpen(false);
  };

  const handleCopy = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      setOpenSnackbar(true);
    });
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setOpenSnackbar(false);
  };

  useEffect(() => {
    if (store?.user?.id) {
      async function fetchConsultations() {
        try {
          const response = await DoctorService.getEndedConsultationsByDoctorId(store.user.personId);
          let array = response.data[0] || [];
          array = array.filter((item) => item.type !== 'protocol');
          array = array.map((item) => ({
            ...item,
            id: item.slot_id,
            patient: `Пациент: ${item.pSecondName} ${item.pFirstName} ${item.pPatronomicName || ''}`.trim(),
            doctor: `${item.dSecondName} ${item.dFirstName} ${item.dPatronomicName || ''}`.trim(),
            start: moment(item.slotStartDateTime).format('DD.MM.YYYY HH:mm'),
            end: moment(item.slotEndDateTime).format('DD.MM.YYYY HH:mm'),
            
            sendCount: item.sendCount ?? 0, // добавили счётчик отправок
          }));
          array = array.sort((a, b) => {
            return a.slotStartDateTime < b.slotStartDateTime ? 1 : -1
          })
          setConsultations(array);
        } catch (e) {
          console.error(e);
        }
      }
      fetchConsultations();
    }
  }, [store]);

  const columns = [
    {
      field: 'patient',
      headerName: 'Пациент',
      flex: 1,
      minWidth: 200,
    },
    {
      field: 'start',
      headerName: 'Начало конференции',
      flex: 0.8,
      minWidth: 180,
      sortable: false
    },
    {
      field: 'end',
      headerName: 'Конец конференции',
      flex: 0.8,
      minWidth: 180,
      sortable: false
    },
    {
      field: "serviceShortName",
      headerName: "Тип конференции",
      width: 150,
      disableColumnSort: false,
    },
    {
      field: 'protocol',
      headerName: 'Протокол ТМК',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {params.row.protocol ? params.row.protocol.slice(0, 40) : ''}
        </Box>
      ),
    },
    {
      field: 'sendCount',
      headerName: 'Отправлено',
      flex: 0.5,
      minWidth: 120,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Tooltip title={params.row.sendCount > 0 ? 'Отправлено' : 'Не отправлено'}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: params.row.sendCount > 0 ? 'success.main' : 'error.main',
                flexShrink: 0,
              }}
            />
          </Tooltip>
          <span>{params.row.sendCount}</span>
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Действия',
      flex: 0.8,
      minWidth: 240,
      sortable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            gap: 1,
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexWrap: 'nowrap',
            width: '100%',
          }}
        >
          <Button
            variant="outlined"
            size="small"
            sx={{
              minWidth: 90,
              textTransform: 'none',
              fontSize: '0.8rem',
              px: '6px',
            }}
            onClick={() => handleEditOpen(params.row)}
          >
            Изменить протокол
          </Button>

          <Button
            variant="contained"
            color="primary"
            size="small"
            sx={{
              minWidth: 90,
              textTransform: 'none',
              fontSize: '0.8rem',
              px: '6px',
            }}
            onClick={() => handleOpen(params.row)} // ты допишешь сюда свою логику
          >
            Открыть
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <LocalizationContext>
      <AdminHeader />
      <Box sx={{ p: 3, height: 'calc(100vh - 100px)', width: '100%' }}>
        <DataGrid
          rows={consultations}
          columns={columns}
          disableSelectionOnClick
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          autoHeight
          sx={{
            '& .MuiDataGrid-cell': {
              alignItems: 'center',
              display: 'flex',
              py: 1,
            },
            '& .MuiButton-root': {
              borderRadius: '10px',
            },
            '@media (max-width: 900px)': {
              '& .MuiDataGrid-columnHeaders': { fontSize: '0.8rem' },
              '& .MuiButton-root': { fontSize: '0.7rem' },
            },
          }}
        />

        {editProtocolModalOpen && selectedConsultation && (
          <EditProtocolModal
            isOpen={editProtocolModalOpen}
            onClose={handleEditClose}
            consultation={selectedConsultation}
          />
        )}

        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          open={openSnackbar}
          autoHideDuration={800}
          onClose={handleSnackbarClose}
          message="Скопировано"
        />
      </Box>
    </LocalizationContext>
  );
}

export default EndedTMKPage;
