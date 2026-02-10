// using built-in fetch for Node 18+

const BASE_URL = 'http://localhost:3000/api';

async function test() {
    console.log('Starting API Tests...');

    // 1. Login/Create User
    console.log('1. Testing Login...');
    let user;
    try {
        const res = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'test@example.com',
                name: 'Test User',
                provider: 'Google',
                avatar: 'http://example.com/avatar.jpg'
            })
        });
        user = await res.json();
        console.log('Login Result:', user.email === 'test@example.com' ? 'PASS' : 'FAIL');
    } catch (e) {
        console.error('Login Failed', e);
        return;
    }

    // 2. Update Vehicle
    console.log('2. Testing Update Vehicle...');
    try {
        const res = await fetch(`${BASE_URL}/user/test@example.com/vehicle`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ vehicleNumber: '12가1234' })
        });
        const updated = await res.json();
        console.log('Update Vehicle Result:', updated.vehicleNumber === '12가1234' ? 'PASS' : 'FAIL');
    } catch (e) {
        console.error('Update Vehicle Failed', e);
    }

    // 3. Get User
    console.log('3. Testing Get User...');
    try {
        const res = await fetch(`${BASE_URL}/user/test@example.com`);
        const fetched = await res.json();
        console.log('Get User Result:', fetched.vehicleNumber === '12가1234' ? 'PASS' : 'FAIL');
    } catch (e) {
        console.error('Get User Failed', e);
    }

    // 4. Delete Vehicle
    console.log('4. Testing Delete Vehicle...');
    try {
        const res = await fetch(`${BASE_URL}/user/test@example.com/vehicle`, {
            method: 'DELETE'
        });
        const deleted = await res.json();
        console.log('Delete Vehicle Result:', deleted.vehicleNumber === null ? 'PASS' : 'FAIL');
    } catch (e) {
        console.error('Delete Vehicle Failed', e);
    }

    console.log('Tests Completed.');
}

test();
