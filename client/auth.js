/**
 * Simple Authentication Simulator
 * Mocks a backend by storing session in localStorage
 */

const Auth = {
    // Simulated user database
    mockUsers: {
        google: {
            name: 'Google User',
            email: 'google@example.com',
            provider: 'Google',
            avatar: null
        },
        apple: {
            name: 'Apple User',
            email: 'user@icloud.com',
            provider: 'Apple',
            avatar: null
        },
        naver: {
            name: '네이버 회원',
            email: 'naver@example.com',
            provider: 'Naver',
            avatar: null
        },
        kakao: {
            name: '카카오 회원',
            email: 'kakao@example.com',
            provider: 'Kakao',
            avatar: null
        }
    },

    googleClient: null,

    /**
     * Initialize Google Auth Client
     */
    initGoogleAuth: function () {
        if (window.google) {
            this.googleClient = google.accounts.oauth2.initTokenClient({
                client_id: '475907696864-gm0e0otjs519ma7ij7gjrk6m682ht5o0.apps.googleusercontent.com',
                scope: 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
                callback: (tokenResponse) => {
                    if (tokenResponse.access_token) {
                        this.handleGoogleResponse(tokenResponse.access_token);
                    }
                },
            });
        }
    },

    /**
     * Handle Google Token Response
     */
    handleGoogleResponse: async function (accessToken) {
        try {
            const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            const data = await response.json();

            const payload = {
                name: data.name,
                email: data.email,
                provider: 'Google',
                avatar: data.picture
            };

            // Call API
            const apiResp = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!apiResp.ok) throw new Error('API Login failed');

            const user = await apiResp.json();
            this.setSession(user);
            window.location.href = 'dashboard.html';
        } catch (error) {
            console.error('Error fetching Google user info:', error);
            if (typeof document !== 'undefined') {
                const el = document.getElementById('login-error');
                if (el) {
                    el.textContent = '구글 로그인 중 오류가 발생했습니다.';
                    el.style.display = 'block';
                }
            }
        }
    },


    /**
     * Update user session data
     * Merges new data into existing user object
     */
    updateUser: async function (updates) {
        const currentUser = this.getSession();
        if (!currentUser) return;

        try {
            let apiUrl = '';
            let method = 'PUT';

            if (updates.hasOwnProperty('vehicleNumber')) {
                apiUrl = `/api/user/${currentUser.email}/vehicle`;
                if (updates.vehicleNumber === null) method = 'DELETE';
            } else if (updates.hasOwnProperty('phoneNumber')) {
                apiUrl = `/api/user/${currentUser.email}/phone`;
                if (updates.phoneNumber === null) method = 'DELETE';
            } else if (updates.hasOwnProperty('statusKey') || updates.hasOwnProperty('statusMessage')) {
                apiUrl = `/api/user/${currentUser.email}/status`;
            }

            if (apiUrl) {
                const response = await fetch(apiUrl, {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updates)
                });
                if (!response.ok) throw new Error('Update failed');

                // Fetch latest user data anyway to be sure
                const userResp = await fetch(`/api/user/${currentUser.email}`);
                const updatedUser = await userResp.json();

                this.setSession(updatedUser);
                return updatedUser;
            } else {
                // Fallback for other updates (client side only or not implemented)
                const updatedUser = { ...currentUser, ...updates };
                this.setSession(updatedUser);
                return updatedUser;
            }
        } catch (e) {
            console.error(e);
            throw e;
        }
    },

    /**
     * Simulate login process
     * @param {string} provider - 'google', 'apple', 'naver', 'kakao'
     * @returns {Promise} - Resolves with user object after delay
     */
    login: async function (provider) {
        console.log(`Attempting login with ${provider}...`);

        if (provider === 'google') {
            // Force mock login for development/demo purposes
            /*
             if (this.googleClient) {
                 // Try real Google Login
                 this.googleClient.requestAccessToken();
                 return new Promise((resolve, reject) => {
                     // We need to expose the resolve/reject to the callback or handle it differently.
                     // For now, let's keep the legacy behavior of not awaiting the specific google popup closure here
                     // OR, simpler: just return a resolved promise and let the callback handle redirection.
                     // But wait, if we want to fallback to mock, we need to know if it failed.
                     // Real Google Login is hard to catch errors for in this pattern (popup).

                     // Let's force mock login for Google for now since we don't have a valid Client ID for localhost.
                     // Commenting out real google login for stability in this demo.
                     // this.googleClient.requestAccessToken();
                     // return;
                 });
             }
             */
            // Fall through to mock login if no client or forced fallback
            console.warn('Google SDK not ready or using mock fallback.');
        }

        // Simulate network delay for other providers (mock login)
        const delay = Math.floor(Math.random() * 1000) + 500;
        await new Promise(r => setTimeout(r, delay));

        const mockUser = this.mockUsers[provider];
        if (!mockUser) {
            throw new Error('Login failed: Unknown provider');
        }

        // Call API to login/register
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(mockUser)
            });

            if (!response.ok) throw new Error('API Login failed');

            const user = await response.json();
            this.setSession(user);
            return user;
        } catch (err) {
            console.error(err);
            throw err;
        }
    },

    /**
     * Log out the current user
     */
    logout: function () {
        localStorage.removeItem('auth_user');
        window.location.href = 'index.html';
    },

    /**
     * Save user session
     */
    setSession: function (user) {
        localStorage.setItem('auth_user', JSON.stringify(user));
    },

    /**
     * Get current user session
     */
    getSession: function () {
        const userStr = localStorage.getItem('auth_user');
        return userStr ? JSON.parse(userStr) : null;
    },

    /**
     * Middleware check - redirects if not logged in
     * Call this on protected pages (like dashboard.html)
     */
    checkAuth: function () {
        const user = this.getSession();
        if (!user) {
            // Not logged in, redirect to login page
            window.location.href = 'index.html';
            return null;
        }
        return user;
    },

    /**
     * Middleware check - redirects if ALREADY logged in
     * Call this on public pages (like index.html)
     */
    redirectIfLoggedIn: function () {
        const user = this.getSession();
        if (user) {
            window.location.href = 'dashboard.html';
        }
    }
};

// Export for global usage if needed, though scripts will load it into window
window.Auth = Auth;
