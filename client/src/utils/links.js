import { AiOutlineLineChart } from 'react-icons/ai';
import { AiOutlineFileSearch } from 'react-icons/ai';
import { AiOutlineFileText } from 'react-icons/ai';
import { AiOutlineProfile } from 'react-icons/ai';

const links = [
    {
        id: 1, text: 'stats', path: '/', icon: <AiOutlineLineChart />
    },
    {
        id: 2, text: 'all jobs', path: '/all-jobs', icon: <AiOutlineFileSearch />
    },
    {
        id: 3, text: 'add job', path: '/add-job', icon: <AiOutlineFileText />
    },
    {
        id: 4, text: 'profile', path: '/profile', icon: <AiOutlineProfile />
    }
];

export default links;