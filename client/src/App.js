import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

import { Error, Landing, Register } from './pages';
import {
    AddJob,
    AllJobs,
    Profile,
    Stats,
    SharedLayout
} from './pages/dashboard';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<SharedLayout />}>
                    <Route index element={<Stats />} />
                    <Route path='all-jobs' element={<AllJobs />} />
                    <Route path='add-job' element={<AddJob />} />
                    <Route path='profile' element={<Profile />} />
                </Route>
                <Route path='/register' element={<Register />} />
                <Route path='/landing' element={<Landing />} />
                <Route path='*' element={<Error />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
