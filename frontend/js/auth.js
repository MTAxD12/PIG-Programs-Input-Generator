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
        this.modal.classList.add('show');
        this.renderAuthForm(type);
    },

    hideAuthModal() {
        this.modal.classList.remove('show');
        this.authForms.innerHTML = '';
    },

    renderAuthForm(type) {
        const isLogin = type === 'login';
        const modalContentClass = isLogin ? 'modal-content-login' : 'modal-content-register';
        
        const modalContent = this.modal.querySelector('.modal-content, .modal-content-login, .modal-content-register');
        if (modalContent) {
            modalContent.className = modalContentClass;
        }
        
        this.authForms.innerHTML = `
            <h2>${isLogin ? 'Welcome!' : 'Let\'s get to know each other!'}</h2>
            <form id="${type}Form" class="auth-form">
                ${isLogin ? `
                    <div class="form-group">
                        <label for="email">Email / Username</label>
                        <div class="input-container">
                            <input type="text" id="email" placeholder="Enter email or username" required>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <div class="password-container">
                            <input type="password" id="password" placeholder="Enter your password" required maxlength="32">
                            <button type="button" class="password-toggle" aria-label="Toggle password visibility">
                                <img src="assets/icons/showPass.svg" alt="Show password" class="show-password">
                                <img src="assets/icons/hidePass.svg" alt="Hide password" class="hide-password" style="display: none;">
                            </button>
                        </div>
                    </div>
                ` : `
                    <div class="register-row">
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input type="email" id="email" placeholder="Ex: Enter your email" required>
                        </div>
                        <div class="form-group">
                            <label for="username">Username</label>
                            <input type="text" id="username" placeholder="Ex: Enter your username" required>
                        </div>
                    </div>
                    <div class="register-row">
                        <div class="form-group">
                            <label for="password">Password</label>
                            <div class="password-container">
                                <input type="password" id="password" placeholder="Enter your password" required maxlength="32">
                                <button type="button" class="password-toggle" aria-label="Toggle password visibility">
                                    <img src="assets/icons/showPass.svg" alt="Show password" class="show-password">
                                    <img src="assets/icons/hidePass.svg" alt="Hide password" class="hide-password" style="display: none;">
                                </button>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="confirmPassword">Confirm Password</label>
                            <div class="password-container">
                                <input type="password" id="confirmPassword" placeholder="Confirm your password" required maxlength="32">
                                <button type="button" class="password-toggle" aria-label="Toggle password visibility">
                                    <img src="assets/icons/showPass.svg" alt="Show password" class="show-password">
                                    <img src="assets/icons/hidePass.svg" alt="Hide password" class="hide-password" style="display: none;">
                                </button>
                            </div>
                        </div>
                    </div>
                `}
                <button type="submit">${isLogin ? 'Login' : 'Register'}</button>
                ${isLogin ? 
                    `<p class="signup-text"><strong>Don't</strong> have an account? <strong>Tap here!</strong></p>` : 
                    `<p class="signup-text">Already have an account? <strong>Tap here!</strong></p>`
                }
            </form>
        `;

        const form = document.getElementById(`${type}Form`);
        
        const passwordToggles = form.querySelectorAll('.password-toggle');
        passwordToggles.forEach(toggle => {
            toggle.addEventListener('click', function() {
                const passwordInput = this.parentElement.querySelector('input');
                const showIcon = this.querySelector('.show-password');
                const hideIcon = this.querySelector('.hide-password');
                
                if (passwordInput.type === 'password') {
                    passwordInput.type = 'text';
                    showIcon.style.display = 'none';
                    hideIcon.style.display = 'block';
                } else {
                    passwordInput.type = 'password';
                    showIcon.style.display = 'block';
                    hideIcon.style.display = 'none';
                }
            });
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (isLogin) {
                this.handleLogin();
            } else {
                this.handleRegister();
            }
        });

        const signupText = form.querySelector('.signup-text');
        if (signupText) {
            signupText.addEventListener('click', () => {
                this.renderAuthForm(isLogin ? 'register' : 'login');
            });
        }
    },

    async handleLogin() {
        try {
            const emailOrUsername = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            let body;
            if (emailRegex.test(emailOrUsername)) {
                body = { email: emailOrUsername, password };
            } else {
                body = { username: emailOrUsername, password };
            }

            const response = await apiRequest('/auth/login', {
                method: 'POST',
                body: JSON.stringify(body)
            });

            this.setAuthState(response.token, response.user);
            this.hideAuthModal();
            showError('Login successful!', true);
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
            showError('Registration successful!', true);
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
        showError('Logged out successfully', true);
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