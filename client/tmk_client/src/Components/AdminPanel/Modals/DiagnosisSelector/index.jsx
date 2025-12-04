import React, { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Tooltip,
  IconButton,
  Typography
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DoctorService from "../../../../Services/DoctorService";

export default function DiagnosisSelector({ open, onClose, onSelect }) {
  const [diagnosisList, setDiagnosisList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const listRef = useRef(null);
  const limit = 50; // количество диагнозов за один запрос

  // Сброс при открытии
  useEffect(() => {
    if (open) {
      setDiagnosisList([]);
      setPage(0);
      setHasMore(true);
      fetchDiagnoses("", 0, true);
    }
  }, [open]);

  const fetchDiagnoses = async (query = "", pageNum = 0, replace = false) => {
    if (!hasMore && !replace) return;
    setLoading(true);
    try {
      const offset = pageNum * limit;
      const res = await DoctorService.getMkbDiagnoses({ level_gt: 2, search: query, limit, offset });
      if (replace) {
        setDiagnosisList(res.data);
      } else {
        setDiagnosisList((prev) => [...prev, ...res.data]);
      }
      setHasMore(res.data.length === limit);
    } catch (error) {
      console.error("Ошибка загрузки диагнозов", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setDiagnosisList([]);
    setPage(0);
    setHasMore(true);
    fetchDiagnoses(value, 0, true);
  };

  // Обработчик скролла для подгрузки
  const handleScroll = () => {
    if (!listRef.current || loading || !hasMore) return;
    const { scrollTop, scrollHeight, clientHeight } = listRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 50) { // 50px до низа
      const nextPage = page + 1;
      fetchDiagnoses(search, nextPage);
      setPage(nextPage);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Выберите диагноз</DialogTitle>
      <DialogContent
        dividers
        style={{ maxHeight: "60vh", overflowY: "auto" }}
        onScroll={handleScroll}
        ref={listRef}
      >
        <TextField
          fullWidth
          placeholder="Поиск..."
          value={search}
          onChange={handleSearchChange}
          sx={{ mb: 2 }}
        />
        {diagnosisList.length === 0 && !loading && (
          <Typography variant="body2" color="text.secondary">
            Диагнозы не найдены
          </Typography>
        )}
        <List>
          {diagnosisList.map((diag) => (
            <ListItem
              button
              key={diag.id}
              onClick={() => onSelect(diag)}
            >
              <ListItemText
                primary={`${diag.code} — ${diag.name}`}
                secondary={diag.full_name}
              />
              <Tooltip title="Скопировать описание">
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigator.clipboard.writeText(diag.full_name || diag.name);
                  }}
                >
                  <ContentCopyIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </ListItem>
          ))}
        </List>
        {loading && (
          <div style={{ display: "flex", justifyContent: "center", padding: "10px" }}>
            <CircularProgress size={24} />
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
      </DialogActions>
    </Dialog>
  );
}
