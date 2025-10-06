import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ViewAllOfficials = () => {
    const [officials, setOfficials] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/api/brgyOfficials')
        .then(response => {
            setOfficials(response.data);
        })
        .catch(error => {
            console.error('Error fetching officials:', error);
        });
    }, []);

    return (
        <div className="ViewAllOfficials">
            <h1>Barangay Officials</h1>
            <ul>
                {officials.map((official, index) => (
                <li key={index}>
                    <p>Name: <strong>{official.fullName}</strong> 
                    </p>
                    <p>
                        {official.position}
                    </p>
                    <p>
                        {official.username}
                    </p>
                    Term: {new Date(official.termStart).toLocaleDateString()} to {new Date(official.termEnd).toLocaleDateString()}
                </li>
                ))}
            </ul>
        </div>
    );
}

export default ViewAllOfficials;