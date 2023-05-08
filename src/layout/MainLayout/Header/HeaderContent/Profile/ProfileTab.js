import PropTypes from 'prop-types';
import { useState, useContext } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';

// assets
import { EditOutlined, ProfileOutlined, LogoutOutlined, UserOutlined, WalletOutlined } from '@ant-design/icons';

// firebase
import { getAuth, onAuthStateChanged } from "firebase/auth";

import UserContext from '../../../../../context/UserContext';
// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

const ProfileTab = ({ handleLogout }) => {
    const theme = useTheme();
    const { user } = useContext(UserContext);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
    };

    return (
        <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32, color: theme.palette.grey[500] } }}>
            {user.email !== undefined ? (
                <ListItemButton selected={selectedIndex === 2} onClick={handleLogout}>
                    <ListItemIcon>
                        <LogoutOutlined />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItemButton>

            ):(
                <ListItemButton selected={selectedIndex === 2} onClick={handleLogout}>
                    <ListItemIcon>
                        <LogoutOutlined />
                    </ListItemIcon>
                    <ListItemText primary="Register" />
                </ListItemButton>
            )}
        </List>
    );
};

ProfileTab.propTypes = {
    handleLogout: PropTypes.func
};

export default ProfileTab;
