import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Components/Home';
import Statistics from './Components/Statistics';
import ChatGeneratePage from './Components/ChatGeneratePage';
import ChatConversationPage from './Components/ChatConversationPage';
import { useState } from 'react';

function App() {
  const [data, setData] = useState(null);
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<Home setData={setData} />} />
        <Route path="/statistics" element={<Statistics data={data} />} />
        <Route path="/chat-generate" element={<ChatGeneratePage data={data}/>}/>
        <Route path="/chat-conversation" element={<ChatConversationPage data={data}/>}/>
       
       
      </Routes>
    </BrowserRouter>
  );
}

export default App;
