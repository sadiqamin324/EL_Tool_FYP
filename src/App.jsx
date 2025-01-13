import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DropdownForm from './pages/Source'; // Import DropdownForm

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                
                {/* Home Page */}
                <Route path="/" element={<Home />} />

                {/* Dropdown Page */}
                <Route path="/dropdown" element={<DropdownForm />} />


            </Routes>
        </BrowserRouter>
    );
}


