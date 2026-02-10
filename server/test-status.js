// using built-in fetch for Node 18+

const BASE_URL = 'http://localhost:3000/api';

async function test() {
    console.log('Starting Status API Tests...');

    // 0. Ensure User Exists
    try {
        await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'test@example.com', name: 'Test User', provider: 'Google' })
        });
    } catch (e) { }

    // 1. Update Status
    console.log('1. Testing Update Status...');
    try {
        const res = await fetch(`${BASE_URL}/user/test@example.com/status`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ statusKey: 'meeting', statusMessage: 'In a meeting' })
        });
        const updated = await res.json();

        if (updated.statusKey === 'meeting' && updated.statusMessage === 'In a meeting') {
            console.log('Update Status Result: PASS');
        } else {
            console.log('Update Status Result: FAIL');
            console.log('Response:', JSON.stringify(updated, null, 2));
        }
    } catch (e) {
        console.error('Update Status Failed', e);
    }
}

test();
