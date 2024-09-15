import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {StrictMode} from 'react';
import {createRoot} from 'react-dom';

//const root = ReactDOM.createRoot(document.getElementById('root'));
ReactDOM.render(
  <React.StrictMode>
    <App id="app"/>
  </React.StrictMode>,
  document.getElementById('root')
);


