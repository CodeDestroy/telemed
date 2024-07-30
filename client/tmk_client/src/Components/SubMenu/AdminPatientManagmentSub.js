import adminLocations from "../../Locations/AdminLocations";

const menuItems = new Map([
    ['Все пациенты', adminLocations.patientManagement],
    ['Создать', adminLocations.createPatient],
    /* ['Редактировать', '/admin/slots/edit'],
    ['Удалить', '/admin/slots/delete'] */
]);

export default menuItems;
