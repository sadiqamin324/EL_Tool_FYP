import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/Sign-In';
import DropdownForm from './pages/Source'; // Import DropdownForm
import SignUp from './pages/Sign-up';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                
                {/* Home Page */}
                <Route path="/SignIn" element={<SignIn />} />
                <Route path="/SignUp" element={<SignUp />} />
                <Route path="/home" element={<Home />} />

                {/* Dropdown Page */}
                <Route path="/dropdown" element={<DropdownForm />} />


            </Routes>
        </BrowserRouter>
    );
}


