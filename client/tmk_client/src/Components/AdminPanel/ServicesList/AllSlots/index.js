import React, { useEffect, useContext, useState } from "react";
import AdminHeader from "../../Header";
import AdminService from "../../../../Services/AdminService";
import { Context } from "../../../..";
import DataGrid from "../../../DataGrid";
import {
  Box,
  Snackbar,
  Chip,
  Button,
  Stack,
} from "@mui/material";
import moment from "moment-timezone";
import { LocalizationContext } from "../../../../Utils/LocalizationContext";
import SubMenu from "../../../SubMenu";
import adminLocations from "../../../../Locations/AdminLocations";
import CreateSlotModal from "../../Modals/CreateSlotModalForDoctor";

function AllSlots() {
  const { store } = useContext(Context);
  const [consultations, setConsultations] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const now = moment();

  const menuItems = new Map([
    ["Все слоты", adminLocations.slotsManagement],
    ["Создать", adminLocations.createConsultation],
  ]);

  useEffect(() => {
    if (store?.user?.id) {
      async function fetchConsultations() {
        try {
          const response = await AdminService.getConsultations();
          let array = response.data[0];

          array.forEach((el) => {
            el.id = el.slot_id || el.id;
            el.patient = `${el.pSecondName} ${el.pFirstName}`;
            el.slotStartDateTimeFormatted = moment(el.slotStartDateTime).format(
              "DD.MM.YYYY HH:mm"
            );
          });

          setConsultations(array);
        } catch (e) {
          console.error(e);
        }
      }

      fetchConsultations();
    }
  }, [store]);

  const handleOpenDetails = (slotId) => {
    window.location.href = `/consultation/${slotId}`;
  };

  const statusColor = (status) => {
    const code = (status || "").toLowerCase();
    if (code.includes("оплачен") || code.includes("успешно")) return "success";
    if (code.includes("ожид") || code.includes("wait") || code.includes("pending"))
      return "warning";
    if (code.includes("отмен") || code.includes("fail")) return "error";
    return "default";
  };

  const columns = [
    { field: "patient", headerName: "Пациент", width: 220 },

    {
      field: "slotStartDateTime",
      headerName: "Начало конференции",
      width: 200,
      renderCell: (params) => {
        const date = moment(params.row.slotStartDateTime);
        return (
          <Box sx={{ color: date.isBefore(now) ? "red" : "inherit" }}>
            {date.format("DD.MM.YYYY HH:mm")}
          </Box>
        );
      },
    },

    {
      field: "paymentStatusDescription",
      headerName: "Статус оплаты",
      width: 250,
      renderCell: (params) => (
        <Chip
          label={params.row.paymentStatusDescription || "—"}
          color={statusColor(params.row.paymentStatusDescription)}
          size="small"
        />
      ),
    },

    {
      field: "details",
      headerName: "",
      width: 130,
      renderCell: (params) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleOpenDetails(params.row.slot_id)}
        >
          Подробнее
        </Button>
      ),
    },
  ];

  return (
    <LocalizationContext>
      <AdminHeader />
      <SubMenu menuItems={menuItems} />

      <Box sx={{ height: "100%", width: "100%", p: 2 }}>
        {/* Кнопка создания консультации */}
        <Stack direction="row" justifyContent="flex-end" sx={{ mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setCreateModalOpen(true)}
          >
            Создать консультацию
          </Button>
        </Stack>

        <DataGrid
          rowsWithDetail={consultations}
          columns={columns}
        />

        <Snackbar
          open={openSnackbar}
          autoHideDuration={800}
          onClose={() => setOpenSnackbar(false)}
          message="Скопировано"
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        />
      </Box>

      {/* Модал создания слота */}
      <CreateSlotModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        doctor={store.user.personId}
        item={{
          date: moment().format("YYYY-MM-DD"),
          scheduleStartTime: "09:00",
          scheduleEndTime: "09:30",
        }}
      />
    </LocalizationContext>
  );
}

export default AllSlots;
