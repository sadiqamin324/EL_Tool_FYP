import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import SignIn from './pages/Sign-In';
import DropdownForm from "./components/Forms/forms.jsx"; // Import DropdownForm
import SignUp from './pages/Sign-up';

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                
                {/* Home Page */}
                
                <Route path="/" element={<Home />} />
                <Route path="/SignUp" element={<SignUp/>} />
                <Route path="/SignIn" element={<SignIn />} />                

                {/* Dropdown Page */}
                <Route path="/dropdown" element={<DropdownForm />} />


            </Routes>
        </BrowserRouter>
    );
}


