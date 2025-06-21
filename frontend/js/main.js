const API_BASE_URL = 'http://localhost:3000/api';

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM Content Loaded');
    
    document.querySelectorAll('.nav-link, .logo').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const page = link.dataset.page || 'home';
            loadPage(page);
        });
    });

    window.addEventListener('popstate', (event) => {
        const page = event.state?.page || 'home';
        console.log('Popstate event, loading page:', page);
        loadPage(page);
    });

    initFormHandlers();
    console.log('Form handlers initialized');

    const path = window.location.pathname;
    const page = path === '/' ? 'home' : path.substring(1);
    console.log('Loading initial page:', page);
    loadPage(page);
});

window.loadPage = async (pageName) => {
    showLoading();
    try {
        const content = document.getElementById('content');
        
        if (pageName === 'home') {
            history.pushState({ page: pageName }, '', '/');
        } else {
            history.pushState({ page: pageName }, '', `/${pageName}`);
        }
        
        switch (pageName) {
            case 'home':
            case '':
                content.innerHTML = `
                    <div class="welcome-section">
                        <h1 class="welcome-title">Welcome to PIG${auth.isAuthenticated ? `, ${auth.currentUser.username}` : ''} !</h1>
                        <p class="welcome-description">Generate input data for your computer science problems</p>
                        <div class="features-grid">
                            <div class="feature-card">
                                <img src="assets/icons/featureNumbers.svg" alt="Numbers icon" class="feature-card-icon feature-numbers-icon">
                                <h3 class="feature-title">Number Sequences</h3>
                                <p class="feature-description">Generate various types of number sequences</p>
                            </div>
                            <div class="feature-card">
                                <img src="assets/icons/featureMatrices.svg" alt="Matrices icon" class="feature-card-icon feature-matrices-icon">
                                <h3 class="feature-title">Matrices</h3>
                                <p class="feature-description">Create matrices with specific properties</p>
                            </div>
                            <div class="feature-card">
                                <img src="assets/icons/featureStrings.svg" alt="Strings icon" class="feature-card-icon feature-strings-icon">
                                <h3 class="feature-title">Strings</h3>
                                <p class="feature-description">Generate character strings with custom properties</p>
                            </div>
                            <div class="feature-card">
                                <img src="assets/icons/featureHistory.svg" alt="Graphs icon" class="feature-card-icon feature-graphs-icon">
                                <h3 class="feature-title">Graphs</h3>
                                <p class="feature-description">Create and visualize graphs and trees</p>
                            </div>
                        </div>
                    </div>
                `;
                break;
            case 'numbers':
                content.innerHTML = `
                    <div id="numbersPage" class="page-content">
                        <h1 class="numbers-title">Number Sequence Generator</h1>
                        <div class="numbers-container">
                            <div class="numbers-inputs">
                                <div class="input-group">
                                    <label for="length">Length</label>
                                    <input type="number" id="length" name="length">
                                </div>
                                <div class="input-group">
                                    <label for="minValue">Minimum Value</label>
                                    <input type="number" id="minValue" name="minValue">
                                </div>
                                <div class="input-group">
                                    <label for="maxValue">Maximum Value</label>
                                    <input type="number" id="maxValue" name="maxValue">
                                </div>
                            </div>
                            <div class="vertical-line"></div>
                            <div class="numbers-properties">
                                <h2>Properties</h2>
                                <div class="property-group">
                                    <input type="checkbox" id="sorted" name="property" value="sorted">
                                    <label for="sorted">Sorted</label>
                                </div>
                                <div class="property-group">
                                    <input type="checkbox" id="unique" name="property" value="unique">
                                    <label for="unique">Unique</label>
                                </div>
                                <div class="property-group">
                                    <input type="checkbox" id="prime" name="property" value="prime">
                                    <label for="prime">Prime Numbers</label>
                                </div>
                                <div class="property-group">
                                    <input type="checkbox" id="even" name="property" value="even">
                                    <label for="even">Even Numbers</label>
                                </div>
                                <div class="property-group">
                                    <input type="checkbox" id="odd" name="property" value="odd">
                                    <label for="odd">Odd Numbers</label>
                                </div>
                            </div>
                        </div>
                        <button id="generateNumbers" class="generate-btn">Generate</button>
                        <div class="results-container" style="display: none;">
                            <h3 class="numbers-title">Generated sequence</h3>
                            <div class="output-container">
                                <pre id="numberResults"></pre>
                                <div class="vertical-separator"></div>
                                <div class="expand-button">
                                    <img src="assets/icons/expand.svg" alt="Expand" />
                                    <span>Expand</span>
                                </div>
                                <div class="retract-button" style="display: none;">
                                    <img src="assets/icons/retract.svg" alt="Retract" />
                                    <span>Retract</span>
                                </div>
                            </div>
                            <div class="export-container">
                                <button class="export-btn">Export</button>
                                <div class="export-dropdown">
                                    <div class="export-option">CSV</div>
                                    <div class="export-option">JSON</div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                break;
            case 'matrices':
                content.innerHTML = `
                    <div class="generator-form">
                        <h2>Matrix Generator</h2>
                        <form id="matrixGeneratorForm">
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="rows">Rows</label>
                                    <input type="number" id="rows" min="1" required>
                                </div>
                                <div class="form-group">
                                    <label for="cols">Columns</label>
                                    <input type="number" id="cols" min="1" required>
                                </div>
                            </div>
                            <div class="form-row">
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
                                    <option value="symmetric">Symmetric</option>
                                    <option value="diagonal">Diagonal</option>
                                </select>
                            </div>
                            <button type="submit" class="btn">Generate</button>
                        </form>
                    </div>
                    <div class="results-container" style="display: none;">
                        <h3>Generated Matrix</h3>
                        <pre id="matrixResults"></pre>
                        <button class="btn" onclick="exportData('matrix')">Export</button>
                    </div>
                `;
                break;

            case 'strings':
                content.innerHTML = `
                    <div class="generator-form">
                        <h2>String Generator</h2>
                        <form id="stringGeneratorForm">
                            <div class="form-group">
                                <label for="length">Length</label>
                                <input type="number" id="length" min="1" required>
                            </div>
                            <div class="form-group">
                                <label for="alphabet">Alphabet</label>
                                <input type="text" id="alphabet" required>
                            </div>
                            <div class="form-group">
                                <label for="properties">Properties</label>
                                <select id="properties" multiple>
                                    <option value="palindrome">Palindrome</option>
                                </select>
                            </div>
                            <button type="submit" class="btn">Generate</button>
                        </form>
                    </div>
                    <div class="results-container" style="display: none;">
                        <h3>Generated String</h3>
                        <pre id="stringResults"></pre>
                        <button class="btn" onclick="exportData('string')">Export</button>
                    </div>
                `;
                break;

            case 'graphs':
                content.innerHTML = `
                    <div class="generator-form">
                        <h2>Graph Generator</h2>
                        <form id="graphGeneratorForm">
                            <div class="form-group">
                                <label for="vertices">Number of Vertices</label>
                                <input type="number" id="vertices" min="1" required>
                            </div>
                            <div class="form-group">
                                <label for="edges">Number of Edges</label>
                                <input type="number" id="edges" min="0" required>
                            </div>
                            <div class="form-group">
                                <label for="properties">Properties</label>
                                <select id="properties" multiple>
                                    <option value="connected">Connected</option>
                                    <option value="acyclic">Acyclic</option>
                                </select>
                            </div>
                            <button type="submit" class="btn">Generate</button>
                        </form>
                    </div>
                    <div class="results-container" style="display: none;">
                        <h3>Generated Graph</h3>
                        <pre id="graphResults"></pre>
                        <button class="btn" onclick="exportData('graph')">Export</button>
                    </div>
                `;
                break;

            case 'history':
                content.innerHTML = `
                    <div class="history-container">
                        <h2>Generation History</h2>
                        <div id="historyList" class="history-list"></div>
                    </div>
                `;
                loadHistory();
                break;

            default:
                content.innerHTML = '<h2>Page not found</h2>';
        }

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.page === pageName) {
                link.classList.add('active');
            }
        });

        initFormHandlers();

    } catch (error) {
        console.error('Error loading page:', error);
        showError('Failed to load page content');
    } finally {
        hideLoading();
    }
};

const showLoading = () => {
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading';
    loadingDiv.textContent = 'Loading...';
    document.body.appendChild(loadingDiv);
};

const hideLoading = () => {
    const loadingDiv = document.getElementById('loading');
    if (loadingDiv) {
        loadingDiv.remove();
    }
};

let currentErrorElement = null;

const showError = (message, isSuccess) => {
    if (isSuccess === undefined) {
        isSuccess = false;
    }
    
    if (currentErrorElement) {
        currentErrorElement.remove();
    }

    const errorDiv = document.createElement('div');
    errorDiv.className = isSuccess ? 'success-message' : 'error-message';
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    currentErrorElement = errorDiv;
    
    setTimeout(() => {
        if (currentErrorElement === errorDiv) {
            errorDiv.remove();
            currentErrorElement = null;
        }
    }, 5000);
};

const apiRequest = async (endpoint, options = {}) => {
    try {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        };

        console.log('Making request to:', `${API_BASE_URL}${endpoint}`);
        console.log('With options:', { ...options, headers });

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
            credentials: 'include'
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('Error response:', errorData);
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Response data:', data);
        return data;
    } catch (error) {
        console.error('Request error:', error);
        showError(error.message);
        throw error;
    }
};

const checkAuth = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        showError('Please login first to generate data');
        auth.showAuthModal('login');
        return false;
    }
    return true;
};

const validateNumberForm = (formData) => {
    if (!formData.length || formData.length <= 0) {
        throw new Error('Length must be a positive number');
    }
    if (formData.min === undefined || formData.max === undefined) {
        throw new Error('Minimum and maximum values are required');
    }
    if (formData.min > formData.max) {
        throw new Error('Minimum value cannot be greater than maximum value');
    }
    return true;
};

const initFormHandlers = () => {
    const generateNumbersBtn = document.getElementById('generateNumbers');
    if (generateNumbersBtn) {
        generateNumbersBtn.onclick = async () => {
            if (!checkAuth()) return false;
            
            console.log('Generate numbers button clicked');
            
            try {
                const lengthInput = document.getElementById('length');
                const minInput = document.getElementById('minValue');
                const maxInput = document.getElementById('maxValue');
                const selectedProperties = document.querySelectorAll('input[name="property"]:checked');

                if (!lengthInput || !minInput || !maxInput) {
                    throw new Error('Required input fields not found');
                }

                const formData = {
                    length: parseInt(lengthInput.value),
                    min: parseInt(minInput.value),
                    max: parseInt(maxInput.value),
                    properties: Array.from(selectedProperties).map(prop => prop.value)
                };

                console.log('Form data before validation:', formData);

                validateNumberForm(formData);

                console.log('Sending request with data:', formData);
                console.log('Request body will be:', JSON.stringify(formData));

                const response = await apiRequest('/generators/numbers/generate', {
                    method: 'POST',
                    body: JSON.stringify(formData)
                });

                console.log('Received response:', response);

                const resultsContainer = document.querySelector('.results-container');
                const resultsElement = document.getElementById('numberResults');
                const outputContainer = document.querySelector('.output-container');
                
                if (resultsContainer && resultsElement) {
                    resultsElement.textContent = response.result.join(', ');
                    resultsContainer.style.display = 'block';
                    
                    const exportBtn = resultsContainer.querySelector('.export-btn');
                    const exportContainer = resultsContainer.querySelector('.export-container');
                    const exportOptions = resultsContainer.querySelectorAll('.export-option');

                    exportBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        exportContainer.classList.toggle('active');
                    });

                    document.addEventListener('click', (e) => {
                        if (!exportContainer.contains(e.target)) {
                            exportContainer.classList.remove('active');
                        }
                    });

                    exportOptions.forEach(option => {
                        option.addEventListener('click', () => {
                            const format = option.textContent;
                            const data = response.result;
                            
                            let exportData;
                            let filename;
                            let mimeType;

                            if (format === 'CSV') {
                                exportData = data.join(',');
                                filename = 'numbers_sequence.csv';
                                mimeType = 'text/csv';
                            } else {
                                exportData = JSON.stringify(data);
                                filename = 'numbers_sequence.json';
                                mimeType = 'application/json';
                            }

                            const blob = new Blob([exportData], { type: mimeType });
                            const url = window.URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = filename;
                            document.body.appendChild(a);
                            a.click();
                            window.URL.revokeObjectURL(url);
                            a.remove();
                            
                            exportContainer.classList.remove('active');
                        });
                    });

                    const expandButton = document.querySelector('.expand-button');
                    const retractButton = document.querySelector('.retract-button');
                    const verticalSeparator = document.querySelector('.vertical-separator');
                    if (expandButton && retractButton) {
                        const isOverflowing = resultsElement.scrollHeight > 24;
                        
                        if (isOverflowing) {
                            expandButton.style.display = 'flex';
                            const toggleExpand = () => {
                                outputContainer.classList.toggle('expanded');
                                if (outputContainer.classList.contains('expanded')) {
                                    expandButton.style.display = 'none';
                                    retractButton.style.display = 'flex';
                                    verticalSeparator.style.display = 'flex';
                                } else {
                                    expandButton.style.display = 'flex';
                                    retractButton.style.display = 'none';
                                    verticalSeparator.style.display = 'flex';
                                }
                            };
                            expandButton.onclick = toggleExpand;
                            retractButton.onclick = toggleExpand;
                        } else {
                            expandButton.style.display = 'none';
                            retractButton.style.display = 'none';
                            verticalSeparator.style.display = 'none';
                        }
                    }
                } else {
                    console.error('Results container or element not found');
                }
            } catch (error) {
                console.error('Error:', error);
                if (error.message.includes('HTTP error')) {
                    try {
                        const errorData = await error.response.json();
                        showError(errorData.error || 'Failed to generate numbers');
                    } catch (e) {
                        showError(error.message || 'Failed to generate numbers');
                    }
                } else {
                    showError(error.message || 'Failed to generate numbers');
                }
            }
            return false;
        };
    }

    const matrixForm = document.getElementById('matrixGeneratorForm');
    if (matrixForm) {
        matrixForm.onsubmit = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (!checkAuth()) return false;
            
            console.log('Matrix form submitted');
            
            const formData = {
                rows: parseInt(document.getElementById('rows').value),
                cols: parseInt(document.getElementById('cols').value),
                min: parseInt(document.getElementById('min').value),
                max: parseInt(document.getElementById('max').value),
                properties: Array.from(document.getElementById('properties').selectedOptions).map(opt => opt.value)
            };

            console.log('Sending request with data:', formData);

            try {
                const response = await apiRequest('/generators/matrices/generate', {
                    method: 'POST',
                    body: JSON.stringify(formData)
                });

                console.log('Received response:', response);

                const resultsContainer = document.querySelector('.results-container');
                const resultsElement = document.getElementById('matrixResults');
                
                if (resultsContainer && resultsElement) {
                    resultsElement.textContent = response.result.map(row => row.join(' ')).join('\n');
                    resultsContainer.style.display = 'block';
                } else {
                    console.error('Results container or element not found');
                }
            } catch (error) {
                console.error('Error generating matrix:', error);
                if (error.message.includes('401')) {
                    showError('Session expired. Please login again.');
                    auth.handleLogout();
                } else {
                    showError('Failed to generate matrix: ' + error.message);
                }
            }
            return false;
        };
    }

    const stringForm = document.getElementById('stringGeneratorForm');
    if (stringForm) {
        stringForm.onsubmit = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (!checkAuth()) return false;
            
            console.log('String form submitted');
            
            const formData = {
                length: parseInt(document.getElementById('length').value),
                alphabet: document.getElementById('alphabet').value,
                properties: Array.from(document.getElementById('properties').selectedOptions).map(opt => opt.value)
            };

            console.log('Sending request with data:', formData);

            try {
                const response = await apiRequest('/generators/strings/generate', {
                    method: 'POST',
                    body: JSON.stringify(formData)
                });

                console.log('Received response:', response);

                const resultsContainer = document.querySelector('.results-container');
                const resultsElement = document.getElementById('stringResults');
                
                if (resultsContainer && resultsElement) {
                    resultsElement.textContent = response.result;
                    resultsContainer.style.display = 'block';
                } else {
                    console.error('Results container or element not found');
                }
            } catch (error) {
                console.error('Error generating string:', error);
                if (error.message.includes('401')) {
                    showError('Session expired. Please login again.');
                    auth.handleLogout();
                } else {
                    showError('Failed to generate string: ' + error.message);
                }
            }
            return false;
        };
    }

    const graphForm = document.getElementById('graphGeneratorForm');
    if (graphForm) {
        graphForm.onsubmit = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (!checkAuth()) return false;
            
            console.log('Graph form submitted');
            
            const formData = {
                vertices: parseInt(document.getElementById('vertices').value),
                edges: parseInt(document.getElementById('edges').value),
                properties: Array.from(document.getElementById('properties').selectedOptions).map(opt => opt.value)
            };

            console.log('Sending request with data:', formData);

            try {
                const response = await apiRequest('/generators/graphs/generate', {
                    method: 'POST',
                    body: JSON.stringify(formData)
                });

                console.log('Received response:', response);

                const resultsContainer = document.querySelector('.results-container');
                const resultsElement = document.getElementById('graphResults');
                
                if (resultsContainer && resultsElement) {
                    resultsElement.textContent = JSON.stringify(response.result, null, 2);
                    resultsContainer.style.display = 'block';
                } else {
                    console.error('Results container or element not found');
                }
            } catch (error) {
                console.error('Error generating graph:', error);
                if (error.message.includes('401')) {
                    showError('Session expired. Please login again.');
                    auth.handleLogout();
                } else {
                    showError('Failed to generate graph: ' + error.message);
                }
            }
            return false;
        };
    }

    const propertyRadios = document.querySelectorAll('.property-group input[type="radio"]');
    propertyRadios.forEach(radio => {
        radio.addEventListener('click', function(e) {
            if (this.dataset.wasChecked === 'true') {
                this.checked = false;
                this.dataset.wasChecked = 'false';
            } else {
                propertyRadios.forEach(r => r.dataset.wasChecked = 'false');
                this.dataset.wasChecked = 'true';
            }
        });
    });
};

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

const loadHistory = async () => {
    try {
        const data = await apiRequest('/data');
        const historyList = document.getElementById('historyList');
        
        if (data.length === 0) {
            historyList.innerHTML = '<p class="no-data">No generation history found.</p>';
            return;
        }

        historyList.innerHTML = data.map(item => `
            <div class="history-item">
                <div class="history-item-header">
                    <span class="history-type">${item.type}</span>
                    <span class="history-date">${new Date(item.createdAt).toLocaleString()}</span>
                </div>
                <div class="history-content">
                    <pre>${JSON.stringify(item.result, null, 2)}</pre>
                </div>
                <div class="history-actions">
                    <button class="btn btn-small" onclick="exportData('${item.type}', ${item.id})">Export</button>
                    <button class="btn btn-small btn-danger" onclick="deleteHistoryItem(${item.id})">Delete</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading history:', error);
        showError('Failed to load history');
    }
};

const deleteHistoryItem = async (id) => {
    if (!confirm('Are you sure you want to delete this item?')) {
        return;
    }

    try {
        await apiRequest(`/data/${id}`, {
            method: 'DELETE'
        });
        loadHistory();


    } catch (error) {
        console.error('Error deleting history item:', error);
        showError('Failed to delete history item');
    }
};
