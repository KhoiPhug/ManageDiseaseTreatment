import { useEffect, useLayoutEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

function Home() {
    const token = JSON.parse(localStorage.getItem('token'));

    let pathDefault = '';
    if (token) {
        const job = token.account._doc.job;
        switch (job) {
            case 'Specialist doctor':
                pathDefault = 'specialistChecklist';
                break;
            case 'General doctor':
                pathDefault = 'medicalChecklist';
                break;
            case 'Pharmacist':
                pathDefault = 'manageDrugBook';
                break;
            case 'Staff':
                pathDefault = 'medicalChecklist';
                break;
            case 'Manager':
                pathDefault = 'managerAccount';
                break;
            default:
                break;
        }
    }

    return (
        <div>
            <Navigate to={`/${pathDefault}`} replace />
            <h2>Home Page</h2>
        </div>
    );
}

export default Home;
