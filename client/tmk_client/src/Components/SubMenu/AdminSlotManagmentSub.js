import adminLocations from "../../Locations/AdminLocations";

const menuItems = new Map([
    ['Все слоты', adminLocations.slotsManagement],
    ['Создать', adminLocations.createConsultation],
    /* ['Редактировать', '/admin/slots/edit'],
    ['Удалить', '/admin/slots/delete'] */
]);

export default menuItems;
