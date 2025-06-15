const API_BASE_URL = 'http://localhost:3000/api';

const showLoading = () => {
    const loading = document.querySelector('.loading');
    if (loading) loading.style.display = 'block';
};

const hideLoading = () => {
    const loading = document.querySelector('.loading');
    if (loading) loading.style.display = 'none';
};

const showError = (message) => {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);

    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
};

const apiRequest = async (endpoint, options = {}) => {
    try {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        };

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        showError(error.message);
        throw error;
    }
};

const loadPage = async (pageName) => {
    showLoading();
    try {
        const content = document.getElementById('content');
        
        switch (pageName) {
            case 'home':
                content.innerHTML = `
                    <div class="welcome-section">
                        <h1>Welcome to PIG</h1>
                        <p>Generate input data for your computer science problems</p>
                        <div class="features-grid">
                            <div class="feature-card">
                                <h3>Number Sequences</h3>
                                <p>Generate various types of number sequences</p>
                            </div>
                            <div class="feature-card">
                                <h3>Matrices</h3>
                                <p>Create matrices with specific properties</p>
                            </div>
                            <div class="feature-card">
                                <h3>Strings</h3>
                                <p>Generate character strings with custom properties</p>
                            </div>
                            <div class="feature-card">
                                <h3>Graphs</h3>
                                <p>Create and visualize graphs and trees</p>
                            </div>
                        </div>
                    </div>
                `;
                break;

            case 'numbers':
                content.innerHTML = `
                    <div class="generator-form">
                        <h2>Number Sequence Generator</h2>
                        <form id="numberGeneratorForm">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="length">Length</label>
                                    <input type="number" id="length" min="1" required>
                                </div>
                                <div class="form-group">
                                    <label for="min">Minimum Value</label>
                                    <input type="number" id="min" required>
                                </div>
                                <div class="form-group">
                                    <label for="max">Maximum Value</label>
                                    <input type="number" id="max" required>
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="properties">Properties</label>
                                <select id="properties" multiple>
                                    <option value="sorted">Sorted</option>
                                    <option value="unique">Unique</option>
                                    <option value="prime">Prime Numbers</option>
                                    <option value="even">Even Numbers</option>
                                    <option value="odd">Odd Numbers</option>
                                </select>
                            </div>
                            <button type="submit" class="btn">Generate</button>
                        </form>
                    </div>
                    <div class="results-container" style="display: none;">
                        <h3>Generated Sequence</h3>
                        <pre id="numberResults"></pre>
                        <button class="btn" onclick="exportData('numbers')">Export</button>
                    </div>
                `;
                break;

        }
    } catch (error) {
        showError('Failed to load page content');
    } finally {
        hideLoading();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = e.target.dataset.page;
            loadPage(page);
        });
    });

    loadPage('home');
});

const exportData = async (type) => {
    try {
        const data = document.getElementById(`${type}Results`).textContent;
        const blob = new Blob([data], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${type}_generated_${Date.now()}.txt`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
    } catch (error) {
        showError('Failed to export data');
    }
}; 