import { BrowserRouter, Routes, Route } from 'react-router-dom'
import React from 'react'
import FormatPage from './FormatPage';
import LyricsInput from './LyricsInput';


function App() {
 
  return (
    <div>
    <div>
     <BrowserRouter>
        <Routes>
            <Route path="/" element={<FormatPage/>} />
        </Routes>
      </BrowserRouter>
    </div>
  </div>
  );
}

export default App