import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import App from './App';
import './index.css'
import GamesList from './components/GamesList';

ReactDOM.render(
  <Router>
    <Routes>
      <Route path="/" element={<GamesList />} />
      <Route path="/game/:gameId" element={<App />} />
    </Routes>
  </Router>,
  document.getElementById('root')
);
