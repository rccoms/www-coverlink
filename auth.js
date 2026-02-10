/**
 * Simple Authentication Simulator
 * Mocks a backend by storing session in localStorage
 */

const Auth = {
    // Simulated user database
    mockUsers: {
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

            const user = {
                name: data.name,
                email: data.email,
                provider: 'Google',
                avatar: data.picture,
                loginTime: new Date().toISOString()
            };

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
    updateUser: function (updates) {
        const currentUser = this.getSession();
        if (!currentUser) return;

        const updatedUser = { ...currentUser, ...updates };
        this.setSession(updatedUser);
        return updatedUser;
    },

    /**
     * Simulate login process
     * @param {string} provider - 'google', 'apple', 'naver', 'kakao'
     * @returns {Promise} - Resolves with user object after delay
     */
    login: function (provider) {
        return new Promise((resolve, reject) => {
            console.log(`Attempting login with ${provider}...`);

            if (provider === 'google') {
                if (this.googleClient) {
                    // Trigger the Google Token Client
                    // Note: We don't resolve/reject here because the callback handles the rest
                    // But to keep the Promise chain pending (or to treat it as void), we can just return
                    this.googleClient.requestAccessToken();
                    return;
                } else {
                    reject(new Error('Google SDK not loaded'));
                    return;
                }
            }

            // Simulate network delay (0.5s - 1.5s) for other providers
            const delay = Math.floor(Math.random() * 1000) + 500;

            setTimeout(() => {
                const user = { ...this.mockUsers[provider] };
                if (user) {
                    user.loginTime = new Date().toISOString();
                    this.setSession(user);
                    resolve(user);
                } else {
                    reject(new Error('Login failed: Unknown provider'));
                }
            }, delay);
        });
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
