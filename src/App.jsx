import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Community } from './pages/Community';
import { Admin } from './pages/Admin';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Community />} />
        <Route path="/embed/community" element={<Community />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
