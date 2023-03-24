// assets
import { ChromeOutlined, QuestionOutlined } from '@ant-design/icons';
import { SupportAgent } from '@mui/icons-material';
// icons
const icons = {
    ChromeOutlined,
    QuestionOutlined,
    SupportAgent
};

// ==============================|| MENU ITEMS - SAMPLE PAGE & DOCUMENTATION ||============================== //

const support = {
    id: 'support',
    title: 'Support',
    type: 'group',
    children: [
        {
            id: 'sample-page',
            title: 'Contact',
            type: 'item',
            url: '/support',
            icon: icons.SupportAgent
        },
    ]
};

export default support;
