import React, { useEffect, useContext, useState } from 'react';
import { Box, Button, Snackbar } from '@mui/material';
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
          }));
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
    },
    {
      field: 'end',
      headerName: 'Конец конференции',
      flex: 0.8,
      minWidth: 180,
    },
    {
      field: 'protocol',
      headerName: 'Протокол ТМК',
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Box sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {params.row.protocol ? params.row.protocol.slice(0, 40) : '-'}
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Действия',
      flex: 0.7,
      minWidth: 200,
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
              minWidth: 100,
              textTransform: 'none',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontSize: '0.8rem',
                paddingX: '5px'
            }}
            onClick={() => handleEditOpen(params.row)}
          >
            Изменить
          </Button>

          {/* {params.row.dUrl && (
            <Button
              variant="outlined"
              size="small"
              sx={{
                minWidth: 120,
                textTransform: 'none',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontSize: '0.8rem',
                paddingX: '5px'
              }}
              onClick={() => handleCopy(params.row.dUrl)}
            >
              Копировать ссылку
            </Button>
          )} */}
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
