import React, { useEffect } from 'react';
import { Tabs, Tab } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const SubMenu = ({ menuItems }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [value, setValue] = React.useState(0);

    useEffect(() => {
        const currentPath = location.pathname;
        const tabIndex = Array.from(menuItems.values()).indexOf(currentPath);
        if (tabIndex !== -1) {
            setValue(tabIndex);
        }
    }, [location, menuItems]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        const path = Array.from(menuItems.values())[newValue];
        navigate(path);
    };

    return (
        <Tabs value={value} onChange={handleChange}>
            {Array.from(menuItems.keys()).map((label, index) => (
                <Tab key={index} label={label} />
            ))}
        </Tabs>
    );
};

export default SubMenu;
