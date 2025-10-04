import React, { useEffect, useContext, useState } from "react";
import AdminHeader from "../../Header";
import DoctorService from "../../../../Services/DoctorService";
import { Context } from "../../../..";
import DataGrid from "../../../DataGrid";
import { Box, Snackbar, Chip, Button } from "@mui/material";
import moment from "moment-timezone";
import { LocalizationContext } from "../../../../Utils/LocalizationContext";
import ConsultationDetailsModal from "../../ConsultationDetailsModal";

function Index() {
  const { store } = useContext(Context);
  const [consultations, setConsultations] = useState([]);
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const now = moment();

  useEffect(() => {
    if (store?.user?.id) {
      async function fetchConsultations() {
        try {
          const response = await DoctorService.getConsultationsByDoctorId(store.user.personId);
          let array = response.data[0] || response.data;
          array.forEach(el => {
            el.id = el.slot_id;
            el.patient = `${el.pSecondName} ${el.pFirstName}`;
          });
          setConsultations(array);
        } catch (e) {
          console.log(e);
        }
      }
      fetchConsultations();
    }
  }, [store]);

  const handleOpenModal = (slotId) => {
    setSelectedSlot(slotId);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedSlot(null);
  };

  const statusColor = (status) => {
    const code = (status || "").toLowerCase();
    if (code.includes("оплачен") || code.includes("paid")) return "success";
    if (code.includes("ожид") || code.includes("wait") || code.includes("pending")) return "warning";
    if (code.includes("отмен") || code.includes("fail")) return "error";
    return "default";
  };

  const columns = [
    { field: "patient", headerName: "Пациент", disableColumnSort: true },
    {
      field: "slotStartDateTime",
      headerName: "Начало конференции",
      renderCell: (params) => {
        const t = moment(params.row.slotStartDateTime);
        return <Box sx={{ color: t.isBefore(now) ? "red" : "inherit" }}>{t.format("DD.MM.YYYY HH:mm")}</Box>;
      },
      disableColumnSort: true,
    },
    {
      field: "status",
      headerName: "Статус оплаты",
      renderCell: (params) => (
        <Chip
          label={params.row.paymentStatusDescription || "—"}
          color={statusColor(params.row.paymentStatusDescription)}
          size="small"
        />
      ),
      disableColumnSort: true,
    },
    {
      field: "details",
      headerName: "",
      renderCell: (params) => (
        <Button variant="outlined" size="small" onClick={() => handleOpenModal(params.row.slot_id)}>
          Подробнее
        </Button>
      ),
      width: 130,
      disableColumnSort: true,
    },
  ];

  return (
    <LocalizationContext>
      <AdminHeader />
      <Box sx={{ height: "100%", width: "100%" }}>
        <DataGrid rowsWithDetail={consultations} columns={columns} />
        <Snackbar
          open={open}
          autoHideDuration={800}
          onClose={() => setOpen(false)}
          message="Скопировано"
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        />
      </Box>

      {/* Подключаем модалку */}
      <ConsultationDetailsModal
        open={modalOpen}
        onClose={handleCloseModal}
        slotId={selectedSlot}
      />
    </LocalizationContext>
  );
}

export default Index;
