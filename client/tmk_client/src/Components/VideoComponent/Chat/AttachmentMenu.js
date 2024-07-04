import React from 'react';
import './AttachmentMenu.css';
import Dropdown from 'react-bootstrap/Dropdown';

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
    {children}
  </button>
));

const AttachmentMenu = ({ selectFile, className }) => {
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      selectFile(file);
      console.log(file);
    }
  };

  const getAcceptType = (type) => {
    if (type === 'photo') {
      return 'image/*';
    }
    return '*';
  };

  return (
    <Dropdown>
      <Dropdown.Toggle as={CustomToggle} className={className} id="dropdown-custom-components">
        {/* <span role="img" aria-label="attachment">📎</span> */}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Item as="button" style={{padding: '0'}}>
          <input 
            type="file"
            id={`attachment-image`}
            className="attachment-input"
            onChange={handleFileChange}
            accept={getAcceptType('photo')}
          />
          <label htmlFor={`attachment-image`} className="attachment-label dropdown-item">
            <span role="img" aria-label="attachment">Фото</span>
          </label>
        </Dropdown.Item>
        <Dropdown.Item as="button" style={{padding: '0'}}>
          <input
            type="file"
            id={`attachment-*`}
            className="attachment-input"
            onChange={handleFileChange}
            accept={getAcceptType('*')}
          />
          <label htmlFor={`attachment-*`} className="attachment-label dropdown-item">
            <span role="img" aria-label="attachment">Файл</span>
          </label>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default AttachmentMenu;
