// frontend/src/components/Login.js
import React, { useState } from 'react';

const API_URL = 'http://localhost:5001/api';

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!username.trim()) {
            setError('Please enter a username.');
            return;
        }

        try {
            // Use Fetch API for POST request
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username }), // Convert object to JSON string
            });

            // Check if the response status is OK (200-299)
            if (!response.ok) {
                const errorData = await response.json();
                setError(errorData.message || 'Login failed due to server error.');
                return;
            }

            const data = await response.json(); // Parse the response body as JSON

            if (data.success) {
                localStorage.setItem('todo_username', username);
                onLogin(username); // Update App component state
            } else {
                setError(data.message || 'Login failed.');
            }
        } catch (err) {
            // Handle network connection errors
            setError('Network error: Could not connect to the server.');
            console.error(err);
        }
    };

    return (
        <div className='flex flex-col justify-center items-center '>
            <div className='border border-black rounded-2xl p-3 flex flex-col items-center gap-2'>
                <h2 className=''>Login (Username Only)</h2>
                <form onSubmit={handleSubmit} className='flex flex-col gap-1'>
                    <input className='border border-transparent border-b-black'
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <button type="submit" className='border border-blue-500 w-fit flex self-center p-2 rounded-3xl bg-blue-500 text-white'>Login</button>
                </form>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
            
        </div>
    );
}

export default Login;