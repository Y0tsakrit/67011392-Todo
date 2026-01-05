// frontend/src/App.js
import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import TodoList from './components/TodoList';

function App() {
    const [currentUser, setCurrentUser] = useState(null);

    // Check for stored username on initial load
    useEffect(() => {
        const storedUser = localStorage.getItem('todo_username');
        if (storedUser) {
            setCurrentUser(storedUser);
        }
    }, []);

    const handleLogin = (username) => {
        setCurrentUser(username);
    };

    const handleLogout = () => {
        // Clear username from local storage and state
        localStorage.removeItem('todo_username');
        setCurrentUser(null);
    };

    return (
        <div className="flex flex-col gap-6">
            <h1 className='flex items-center justify-center mt-4 text-3xl gap-3'>
                Full Stack Todo App
                <img src='/logo.png' alt='Logo' className='w-10 h-10' />
            </h1>
            {/* Conditional rendering based on login status */}
            {currentUser ? (
                <TodoList username={currentUser} onLogout={handleLogout} />
            ) : (
                <Login onLogin={handleLogin} />
            )}
        </div>
    );
}

export default App;