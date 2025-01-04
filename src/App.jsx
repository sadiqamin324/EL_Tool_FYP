import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import DropdownForm from './components/forms'; // Import DropdownForm

function App() {
    return (
        <Router>
            <Routes>
                {/* Home Page */}
                <Route path="/" element={<Home />} />

                {/* Dropdown Page */}
                <Route path="/dropdown" element={<DropdownForm />} />
            </Routes>
        </Router>
    );
}

export default App;
