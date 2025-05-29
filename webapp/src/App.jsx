import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} /> {/* Default to login */}
        <Route path="/dashboard" element={<div>Dashboard (Placeholder)</div>} /> {/* Placeholder */}
      </Routes>
    </Router>
  );
}

export default App;