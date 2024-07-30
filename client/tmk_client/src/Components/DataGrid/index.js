import * as React from "react";
import { Paper } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { ruRU } from "@mui/x-data-grid/locales";
// Вспомогательная функция для измерения ширины текста
const getTextWidth = (text, font) => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = font;
    return context.measureText(text).width;
};

const getEstimatedColumnWidth = (rows, field, headerName) => {
    if (field == 'expand') {
        return 50
    }
    else if (field == 'url') {
        return 350
    }
    else {
        const headerWidth = getTextWidth(field, 'bold 2rem Arial') + 50; // добавим небольшой запас на отступы
        const cellWidths = rows.map(row => {
            const value = row[field];
            return getTextWidth(value ? value.toString() : '', 'normal 2rem Arial') + 50;
        });
        return Math.max(headerWidth, ...cellWidths);
    }
    
};

const datagridSx = {
    marginTop: 4,
    borderRadius: 2,

};

const detailStyles = {
    borderTop: "2px solid",
    borderTopColor: "primary.main",
    pt: 2,
    padding: 2,
    backgroundColor: '#f5f5f5',
    width: '100%',
};

export default function ExpandedRowDataGrid({ rowsWithDetail, columns }) {
    // Автоматически задаём ширину колонок
    const columnsWithAutoWidth = columns.map(column => ({
        ...column,
        width: getEstimatedColumnWidth(rowsWithDetail, column.field, column.headerName)
    }));

    const getRowHeight = (params) => {
        if (params.id.toString().includes('-detail')) {
            return 100; // Высота строки с подробностями
        }
        return 70; // Обычная высота строки
    };

    return (
        <Paper sx={datagridSx}>
            <DataGrid
                localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
                rows={rowsWithDetail}
                columns={columnsWithAutoWidth}
                pagination
                rowHeight={70}
                getRowHeight={getRowHeight}
                sx={{
                    height: 700,
                    mt: 10
                }}
            />
        </Paper>
    );
}
