const auth = {
    modal: document.getElementById('authModal'),
    loginBtn: document.getElementById('loginBtn'),
    registerBtn: document.getElementById('registerBtn'),
    closeBtn: document.querySelector('.close'),
    authForms: document.getElementById('authForms'),

    isAuthenticated: false,
    currentUser: null,

    init() {
        this.setupEventListeners();
        this.checkAuthStatus();
    },

    setupEventListeners() {
        this.loginBtn.addEventListener('click', () => this.showAuthModal('login'));
        this.registerBtn.addEventListener('click', () => this.showAuthModal('register'));
        this.closeBtn.addEventListener('click', () => this.hideAuthModal());

        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hideAuthModal();
            }
        });
    },

    showAuthModal(type) {
        this.modal.style.display = 'block';
        this.renderAuthForm(type);
    },

    hideAuthModal() {
        this.modal.style.display = 'none';
        this.authForms.innerHTML = '';
    },

    renderAuthForm(type) {
        const isLogin = type === 'login';
        this.authForms.innerHTML = `
            <h2>${isLogin ? 'Login' : 'Register'}</h2>
            <form id="${type}Form" class="auth-form">
                ${!isLogin ? `
                    <div class="form-group">
                        <label for="username">Username</label>
                        <input type="text" id="username" required>
                    </div>
                ` : ''}
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" required>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" required>
                </div>
                ${!isLogin ? `
                    <div class="form-group">
                        <label for="confirmPassword">Confirm Password</label>
                        <input type="password" id="confirmPassword" required>
                    </div>
                ` : ''}
                <button type="submit" class="btn">${isLogin ? 'Login' : 'Register'}</button>
            </form>
        `;

        const form = document.getElementById(`${type}Form`);
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (isLogin) {
                this.handleLogin();
            } else {
                this.handleRegister();
            }
        });
    },

    async handleLogin() {
        try {
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const response = await apiRequest('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password })
            });

            this.setAuthState(response.token, response.user);
            this.hideAuthModal();
            showError('Login successful!');
        } catch (error) {
            showError('Login failed. Please check your credentials.');
        }
    },

    async handleRegister() {
        try {
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                throw new Error('Passwords do not match');
            }

            const response = await apiRequest('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ username, email, password })
            });

            this.setAuthState(response.token, response.user);
            this.hideAuthModal();
            showError('Registration successful!');
        } catch (error) {
            showError('Registration failed. Please try again.');
        }
    },

    async handleLogout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.isAuthenticated = false;
        this.currentUser = null;
        this.updateAuthUI();
        showError('Logged out successfully');
    },

    setAuthState(token, user) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        this.isAuthenticated = true;
        this.currentUser = user;
        this.updateAuthUI();
    },

    checkAuthStatus() {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        if (token && user) {
            this.isAuthenticated = true;
            this.currentUser = user;
            this.updateAuthUI();
        }
    },

    updateAuthUI() {
        if (this.isAuthenticated) {
            this.loginBtn.style.display = 'none';
            this.registerBtn.style.display = 'none';
            if (!document.getElementById('logoutBtn')) {
                const logoutBtn = document.createElement('button');
                logoutBtn.id = 'logoutBtn';
                logoutBtn.className = 'btn';
                logoutBtn.textContent = 'Logout';
                logoutBtn.addEventListener('click', () => this.handleLogout());
                document.querySelector('.auth-buttons').appendChild(logoutBtn);
            }
        } else {
            this.loginBtn.style.display = 'inline-block';
            this.registerBtn.style.display = 'inline-block';
            const logoutBtn = document.getElementById('logoutBtn');
            if (logoutBtn) {
                logoutBtn.remove();
            }
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    auth.init();
}); 