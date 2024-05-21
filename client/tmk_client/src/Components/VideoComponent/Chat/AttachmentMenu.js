import React from 'react';
import './AttachmentMenu.css'; // Стили, которые мы добавим позже
import Dropdown from 'react-bootstrap/Dropdown'

const CustomToggle = React.forwardRef(({ children, onClick, className }, ref) => (
  <button 
    type="button" 
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    className={className}
    data-bs-toggle="dropdown" 
    aria-expanded="false" 
    style={{borderColor: "red", borderTopLeftRadius: '0', borderBottomLeftRadius: '0'}}
  >
                           
  </button>
));

const AttachmentMenu = ({ selectFile, className }) => {

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      selectFile(file)
    }
  };

  const getAcceptType = (type) => {
    if (type === 'photo') {
      return 'image/*'; // Только изображения
    }
    return '*'; // Все файлы
  };
  return (
    <Dropdown>
      <Dropdown.Toggle as={CustomToggle} className={className} id="dropdown-custom-components">
        
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item as="button" style={{padding: '0'}}>
          <input 
            type="file"
            id={`attachment-image`}
            className="attachment-input"
            onChange={handleFileChange}
            accept={getAcceptType('photo')} // Используем тип
          />
          <label htmlFor={`attachment-image`} className="attachment-label dropdown-item">
            <span role="img" aria-label="attachment">
              Фото
            </span>
          </label>
        </Dropdown.Item>
        <Dropdown.Item as="button" style={{padding: '0'}}>
          <input
            type="file"
            id={`attachment-*`}
            className="attachment-input"
            onChange={handleFileChange}
            accept={getAcceptType('*')} // Используем тип
          />
          <label htmlFor={`attachment-*`} className="attachment-label dropdown-item">
            <span role="img" aria-label="attachment-*">
              Файл
            </span>
          </label>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
   
  );
};

export default AttachmentMenu;
