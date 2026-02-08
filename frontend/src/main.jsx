import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'));

try {
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
    )
} catch (e) {
    console.error("Critical Render Error", e);
    document.getElementById('root').innerHTML = `<div style="color:white; padding: 20px;"><h1>Something went wrong.</h1><p>Check console for details.</p></div>`;
}
