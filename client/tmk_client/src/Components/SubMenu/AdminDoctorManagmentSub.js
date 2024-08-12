import adminLocations from "../../Locations/AdminLocations";

const menuItems = new Map([
    ['Все врачи', adminLocations.doctorManagement],
    ['Создать', adminLocations.createDoctor],
    /* ['Редактировать', '/admin/slots/edit'],
    ['Удалить', '/admin/slots/delete'] */
]);

export default menuItems;
