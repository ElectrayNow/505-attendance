import { APPS_SCRIPT_URL } from '../config';
import { AttendanceRecord, Student } from '../types';

interface SavePayload {
    batchName: string;
    sessionDate: string;
    classNumber: number;
    attendance: AttendanceRecord[];
    students: Pick<Student, 'id' | 'name'>[];
}

export const saveAttendanceToSheet = async (payload: SavePayload) => {
    // If the URL is the placeholder, simulate a successful save for local testing.
    if (!APPS_SCRIPT_URL || APPS_SCRIPT_URL.includes('PASTE_YOUR_DEPLOYED_APPS_SCRIPT_URL_HERE')) {
        console.warn("Google Apps Script URL not configured. Simulating a successful save. Please update config.ts to use Google Sheets.");
        
        // Return a promise that resolves after a short delay to mimic a network request.
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({ status: 'success', message: 'Saved locally (simulation).' });
            }, 1000); 
        });
    }
    
    try {
        const response = await fetch(APPS_SCRIPT_URL, {
            method: 'POST',
            mode: 'cors',
            credentials: 'omit',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8', // Apps Script web apps handle POST as text/plain
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.status === 'success') {
            console.log('Successfully saved to Google Sheet:', result.message);
            return result;
        } else {
            console.error('API Error:', result.message);
            throw new Error(result.message || 'An error occurred while saving to the sheet.');
        }
    } catch (error) {
        console.error('Network or fetch error:', error);
        throw new Error('Could not connect to the Google Sheet backend. Please check your network and the Apps Script URL.');
    }
};