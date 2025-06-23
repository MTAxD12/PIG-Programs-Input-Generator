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
        
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            const linkPage = link.getAttribute('href').replace('/', '');
            if ((pageName === '' && linkPage === 'home') || linkPage === pageName) {
                link.classList.add('active');
            }
        });
        
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
                        <h1 class="page-title">Number Sequence Generator</h1>
                        <div class="generator-container">
                            <div class="generator-inputs">
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
                            <div class="generator-properties">
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
                            <h1 class="page-title">Generated sequence</h1>
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
                    <div id="matricesPage" class="page-content">
                        <h1 class="page-title">Matrix Generator</h1>
                        <div class="generator-container">
                            <div class="generator-inputs">
                                <div class="input-group">
                                    <label for="rows">Rows</label>
                                    <input type="number" id="rows" name="rows">
                                </div>
                                <div class="input-group">
                                    <label for="columns">Columns</label>
                                    <input type="number" id="columns" name="columns">
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
                            <div class="generator-properties">
                                <h2>Properties</h2>
                                <div class="property-group">
                                    <input type="checkbox" id="symmetrical" name="property" value="symmetrical">
                                    <label for="symmetrical">Symmetrical</label>
                                </div>
                                <div class="property-group">
                                    <input type="checkbox" id="diagonal" name="property" value="diagonal">
                                    <label for="diagonal">Diagonal</label>
                                </div>
                            </div>
                        </div>
                        <button id="generateMatrices" class="generate-btn">Generate</button>
                        <div class="results-container" style="display: none;">
                            <h1 class="page-title">Generated matrix</h1>
                            <div class="output-container">
                                <pre id="matricesResults"></pre>
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
            case 'strings':
                content.innerHTML = `
                    <div id="stringsPage" class="page-content">
                        <h1 class="page-title">String Generator</h1>
                        <div class="generator-container">
                            <div class="generator-inputs">
                                <div class="input-group">
                                    <label for="length">Length</label>
                                    <input type="number" id="length" name="length">
                                </div>
                                <div class="input-group">
                                    <label for="alphabet">Alphabet</label>
                                    <input type="text" id="alphabet" name="alphabet" placeholder="e.g., abcdefghijklmnopqrstuvwxyz">
                                </div>
                            </div>
                            <div class="vertical-line"></div>
                            <div class="generator-properties">
                                <h2>Properties</h2>
                                <div class="property-group">
                                    <input type="checkbox" id="palindrome" name="property" value="palindrome">
                                    <label for="palindrome">Palindrome</label>
                                </div>
                            </div>
                        </div>
                        <button id="generateStrings" class="generate-btn">Generate</button>
                        <div class="results-container" style="display: none;">
                            <h1 class="page-title">Generated string</h1>
                            <div class="output-container">
                                <pre id="stringsResults"></pre>
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
                                    <div class="export-option">TXT</div>
                                    <div class="export-option">JSON</div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                break;                
            case 'graphs':
                content.innerHTML = `
                    <div id="graphsPage" class="page-content">
                        <h1 class="page-title">Graph Generator</h1>
                        <div class="generator-container">
                            <div class="generator-inputs">
                                <div class="input-group">
                                    <label for="nodes">Number of Nodes</label>
                                    <input type="number" id="nodes" name="nodes" min="1" required>
                                </div>
                                <div class="input-group">
                                    <label for="edges">Number of Edges</label>
                                    <input type="number" id="edges" name="edges" min="0" required>
                                </div>
                            </div>
                            <div class="vertical-line"></div>
                            <div class="generator-properties">
                                <h2>Properties</h2>
                                <div class="property-group">
                                    <input type="checkbox" id="directed" name="property" value="directed">
                                    <label for="directed">Directed</label>
                                </div>
                                <div class="property-group">
                                    <input type="checkbox" id="weighted" name="property" value="weighted">
                                    <label for="weighted">Weighted</label>
                                </div>
                            </div>
                        </div>
                        <button id="generateGraphs" class="generate-btn">Generate</button>
                        <div class="results-container" style="display: none;">
                            <h1 class="page-title">Generated graph</h1>
                            <div class="output-container">
                                <pre id="graphResults"></pre>
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
                                    <div class="export-option">JSON</div>
                                    <div class="export-option svg-export" style="display: none;">SVG</div>
                                </div>
                            </div>
                        </div>
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

const validateMatrixForm = (formData) => {
    const { rows, columns, min, max } = formData;
    if (!rows || !columns || !min || !max) {
        throw new Error('All fields are required');
    }
    if (rows < 1 || columns < 1) {
        throw new Error('Matrix dimensions must be positive');
    }
    if (Number(min) > Number(max)) {
        throw new Error('Minimum value cannot be greater than maximum value');
    }
};

const resetResultsContainer = (resultsContainer) => {
    if (!resultsContainer) return;
    
    const outputContainer = resultsContainer.querySelector('.output-container');
    const expandButton = resultsContainer.querySelector('.expand-button');
    const retractButton = resultsContainer.querySelector('.retract-button');
    
    if (outputContainer) {
        outputContainer.classList.remove('expanded');
    }
    
    if (expandButton) {
        expandButton.style.display = 'none';
    }
    
    if (retractButton) {
        retractButton.style.display = 'none';
    }
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
                    resetResultsContainer(resultsContainer);
                    resultsElement.textContent = response.result.join(', ');
                    resultsContainer.style.display = 'block';
                    
                    const { exportBtn, exportContainer, exportOptions } = cleanupExportListeners(resultsContainer);

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

    const generateStringsBtn = document.getElementById('generateStrings');
    if (generateStringsBtn) {
        generateStringsBtn.onclick = async () => {
            if (!checkAuth()) return false;
            
            console.log('Generate strings button clicked');
            
            try {
                const lengthInput = document.getElementById('length');
                const alphabetInput = document.getElementById('alphabet');
                const selectedProperties = document.querySelectorAll('#stringsPage input[name="property"]:checked');

                if (!lengthInput || !alphabetInput) {
                    throw new Error('Required input fields not found');
                }

                const formData = {
                    length: parseInt(lengthInput.value),
                    alphabet: alphabetInput.value,
                    properties: Array.from(selectedProperties).map(prop => prop.value)
                };

                console.log('Form data before validation:', formData);

                if (!formData.length || formData.length <= 0) {
                    throw new Error('Length must be a positive number');
                }
                if (!formData.alphabet || formData.alphabet.length === 0) {
                    throw new Error('Alphabet cannot be empty');
                }

                console.log('Sending request with data:', formData);

                const response = await apiRequest('/generators/strings/generate', {
                    method: 'POST',
                    body: JSON.stringify(formData)
                });

                console.log('Received response:', response);

                const resultsContainer = document.querySelector('#stringsPage .results-container');
                const resultsElement = document.getElementById('stringsResults');
                const outputContainer = document.querySelector('#stringsPage .output-container');
                
                if (resultsContainer && resultsElement) {
                    resetResultsContainer(resultsContainer);
                    resultsElement.textContent = response.result;
                    resultsContainer.style.display = 'block';
                    
                    const { exportBtn, exportContainer, exportOptions } = cleanupExportListeners(resultsContainer);

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

                            if (format === 'TXT') {
                                exportData = data;
                                filename = 'generated_string.txt';
                                mimeType = 'text/plain';
                            } else {
                                exportData = JSON.stringify({ string: data });
                                filename = 'generated_string.json';
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
                            
                            exportContainer.classList.remove('active');
                        });
                    });

                    const expandButton = document.querySelector('#stringsPage .expand-button');
                    const retractButton = document.querySelector('#stringsPage .retract-button');
                    const verticalSeparator = document.querySelector('#stringsPage .vertical-separator');
                    
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
                showError(error.message || 'Failed to generate string');
            }
            return false;
        };
    }

    const graphGenerateBtn = document.getElementById('generateGraphs');
    if (graphGenerateBtn) {
        graphGenerateBtn.onclick = async () => {
            if (!checkAuth()) return false;
            
            try {
                const nodesInput = document.getElementById('nodes');
                const edgesInput = document.getElementById('edges');
                const directedCheckbox = document.getElementById('directed');
                const weightedCheckbox = document.getElementById('weighted');

                if (!nodesInput || !edgesInput) {
                    throw new Error('Required input fields not found');
                }

                const nodes = parseInt(nodesInput.value);
                const edges = parseInt(edgesInput.value);
                const isDirected = directedCheckbox.checked;
                const isWeighted = weightedCheckbox.checked;

                const warnings = validateGraphInputs(nodes, edges, isDirected, isWeighted);

                if (warnings.length > 0) {
                    const warningMessage = warnings.join('\n');
                    const proceed = confirm(`${warningMessage}\n\nDo you want to proceed anyway?`);
                    if (!proceed) {
                        return false;
                    }
                }

                const formData = {
                    nodes: nodes,
                    edges: edges,
                    directed: isDirected,
                    weighted: isWeighted,
                    properties: []
                };

                const response = await apiRequest('/generators/graphs/generate', {
                    method: 'POST',
                    body: JSON.stringify(formData)
                });

                const resultsContainer = document.querySelector('#graphsPage .results-container');
                const resultsElement = document.getElementById('graphResults');
                const outputContainer = document.querySelector('#graphsPage .output-container');
                
                if (resultsContainer && resultsElement) {
                    resetResultsContainer(resultsContainer);
                    resultsElement.textContent = JSON.stringify(response.result, null, 2);
                    resultsContainer.style.display = 'block';

                    const expandButton = resultsContainer.querySelector('.expand-button');
                    const retractButton = resultsContainer.querySelector('.retract-button');
                    const verticalSeparator = resultsContainer.querySelector('.vertical-separator');
                    
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

                    const { exportBtn, exportContainer, exportOptions } = cleanupExportListeners(resultsContainer);
                    const svgExportOption = resultsContainer.querySelector('.svg-export');
                    
                    if (nodes < 10) {
                        svgExportOption.style.display = 'block';
                    }

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
                        option.addEventListener('click', async () => {
                            const format = option.textContent;
                            const data = response.result;
                            
                            let exportData;
                            let filename;
                            let mimeType;

                            if (format === 'SVG') {
                                try {
                                    const token = localStorage.getItem('token');
                                    const svgResponse = await fetch(`${API_BASE_URL}/generators/graphs/${response.id}/svg`, {
                                        method: 'GET',
                                        headers: {
                                            'Authorization': `Bearer ${token}`
                                        }
                                    });
                                    
                                    if (!svgResponse.ok) {
                                        throw new Error('Failed to fetch SVG');
                                    }
                                    
                                    exportData = await svgResponse.text();
                                    filename = 'generated_graph.svg';
                                    mimeType = 'image/svg+xml';
                                } catch (error) {
                                    showError('Failed to generate SVG');
                                    return;
                                }
                            } else {
                                exportData = JSON.stringify(data, null, 2);
                                filename = 'generated_graph.json';
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
                            
                            exportContainer.classList.remove('active');
                        });
                    });
                }
            } catch (error) {
                console.error('Error:', error);
                showError(error.message || 'Failed to generate graph');
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

    document.addEventListener('click', async (e) => {
        if (e.target.id === 'generateMatrices') {
            try {
                const formData = {
                    rows: document.getElementById('rows').value,
                    columns: document.getElementById('columns').value,
                    min: document.getElementById('minValue').value,
                    max: document.getElementById('maxValue').value,
                    properties: Array.from(document.querySelectorAll('#matricesPage input[type="checkbox"]:checked')).map(cb => cb.value)
                };

                validateMatrixForm(formData);
                showLoading();

                const response = await apiRequest('/generators/matrices/generate', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                const resultsContainer = document.querySelector('#matricesPage .results-container');
                const resultsElement = document.getElementById('matricesResults');
                
                if (response.data) {
                    resetResultsContainer(resultsContainer);
                    resultsElement.textContent = response.data.map(row => row.join(' ')).join('\n');
                    resultsContainer.style.display = 'block';
                    
                    const expandButton = resultsContainer.querySelector('.expand-button');
                    const retractButton = resultsContainer.querySelector('.retract-button');
                    const verticalSeparator = resultsContainer.querySelector('.vertical-separator');
                    const outputContainer = resultsContainer.querySelector('.output-container');
                    
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

                    const { exportBtn, exportContainer, exportOptions } = cleanupExportListeners(resultsContainer);

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
                            const data = response.data;
                            
                            let exportData;
                            let filename;
                            let mimeType;

                            if (format === 'CSV') {
                                exportData = data.map(row => row.join(',')).join('\n');
                                filename = 'matrix.csv';
                                mimeType = 'text/csv';
                            } else {
                                exportData = JSON.stringify(data, null, 2);
                                filename = 'matrix.json';
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
                            
                            exportContainer.classList.remove('active');
                        });
                    });
                }
            } catch (error) {
                showError(error.message);
            } finally {
                hideLoading();
            }
        }
    });
};

const cleanupExportListeners = (resultsContainer) => {
    const exportBtn = resultsContainer.querySelector('.export-btn');
    const exportContainer = resultsContainer.querySelector('.export-container');
    const exportOptions = resultsContainer.querySelectorAll('.export-option');
    
    const newExportBtn = exportBtn.cloneNode(true);
    exportBtn.parentNode.replaceChild(newExportBtn, exportBtn);
    
    exportOptions.forEach(option => {
        const newOption = option.cloneNode(true);
        option.parentNode.replaceChild(newOption, option);
    });
    
    exportContainer.classList.remove('active');
    
    return {
        exportBtn: newExportBtn,
        exportContainer,
        exportOptions: resultsContainer.querySelectorAll('.export-option')
    };
};

const exportData = async (type, format, data) => {
    let content = '';
    let filename = '';
    
    if (type === 'matrices') {
        if (format === 'csv') {
            content = data.map(row => row.join(',')).join('\n');
            filename = 'matrix.csv';
        } else if (format === 'json') {
            content = JSON.stringify(data, null, 2);
            filename = 'matrix.json';
        }
    } else if (type === 'numbers') {
    }
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
};

const loadHistory = async () => {
    try {
        const data = await apiRequest('/data');
        const historyList = document.getElementById('historyList');
        
        if (data.length === 0) {
            historyList.innerHTML = '<p class="no-data">No generation history found.</p>';
            return;
        }

        historyList.innerHTML = data.map(item => {
            let formattedResult = '';
            if (item.type === 'numbers') {
                formattedResult = Array.isArray(item.result) ? item.result.join(', ') : JSON.stringify(item.result);
            } else if (item.type === 'matrices') {
                formattedResult = Array.isArray(item.result) ? 
                    item.result.map(row => Array.isArray(row) ? row.join(' ') : row).join('\n') : 
                    JSON.stringify(item.result);
            } else if (item.type === 'strings') {
                formattedResult = typeof item.result === 'string' ? item.result : JSON.stringify(item.result);
            } else {
                formattedResult = JSON.stringify(item.result, null, 2);
            }

            const itemId = `history-item-${item.id}`;
            
            return `
                <div class="history-item">
                    <div class="history-item-header">
                        <span class="history-type">${item.type}</span>
                        <span class="history-date">${new Date(item.createdAt).toLocaleString()}</span>
                    </div>
                    <div class="history-results-container">
                        <h3 class="history-title">Generated ${item.type}</h3>
                        <div class="output-container" id="output-${itemId}">
                            <pre id="results-${itemId}">${formattedResult}</pre>
                            <div class="vertical-separator" id="separator-${itemId}"></div>
                            <div class="expand-button" id="expand-${itemId}" style="display: none;">
                                <img src="assets/icons/expand.svg" alt="Expand" />
                                <span>Expand</span>
                            </div>
                            <div class="retract-button" id="retract-${itemId}" style="display: none;">
                                <img src="assets/icons/retract.svg" alt="Retract" />
                                <span>Retract</span>
                            </div>
                        </div>
                        <div class="export-container">
                            <button class="export-btn" data-item-id="${item.id}" data-item-type="${item.type}">Export</button>
                            <div class="export-dropdown">
                                ${getExportOptionsForType(item.type)}
                            </div>
                        </div>
                    </div>
                    <div class="history-actions">
                        <button class="btn btn-small btn-danger" onclick="deleteHistoryItem(${item.id})">Delete</button>
                    </div>
                </div>
            `;
        }).join('');

        data.forEach(item => {
            const itemId = `history-item-${item.id}`;
            initializeHistoryItemExpansion(itemId);
            initializeHistoryItemExport(item);
        });

    } catch (error) {
        console.error('Error loading history:', error);
        showError('Failed to load history');
    }
};

const getExportOptionsForType = (type) => {
    switch (type) {
        case 'numbers':
            return `
                <div class="export-option">CSV</div>
                <div class="export-option">JSON</div>
            `;
        case 'matrix':
            return `
                <div class="export-option">CSV</div>
                <div class="export-option">JSON</div>
            `;
        case 'string':
            return `
                <div class="export-option">TXT</div>
                <div class="export-option">JSON</div>
            `;
        case 'graph':
            return `
                <div class="export-option">JSON</div>
                <div class="export-option svg-export" style="display: none;">SVG</div>
            `;
        default:
            return `<div class="export-option">JSON</div>`;
    }
};

const initializeHistoryItemExpansion = (itemId) => {
    const outputContainer = document.getElementById(`output-${itemId}`);
    const resultsElement = document.getElementById(`results-${itemId}`);
    const expandButton = document.getElementById(`expand-${itemId}`);
    const retractButton = document.getElementById(`retract-${itemId}`);
    const verticalSeparator = document.getElementById(`separator-${itemId}`);

    if (!outputContainer || !resultsElement || !expandButton || !retractButton) {
        return;
    }

    const isOverflowing = resultsElement.scrollHeight > 24;
    
    if (isOverflowing) {
        expandButton.style.display = 'flex';
        verticalSeparator.style.display = 'flex';
        
        const toggleExpand = () => {
            outputContainer.classList.toggle('expanded');
            if (outputContainer.classList.contains('expanded')) {
                expandButton.style.display = 'none';
                retractButton.style.display = 'flex';
            } else {
                expandButton.style.display = 'flex';
                retractButton.style.display = 'none';
            }
        };
        
        expandButton.onclick = toggleExpand;
        retractButton.onclick = toggleExpand;
    } else {
        expandButton.style.display = 'none';
        retractButton.style.display = 'none';
        verticalSeparator.style.display = 'none';
    }
};

const initializeHistoryItemExport = (item) => {
    const exportBtn = document.querySelector(`[data-item-id="${item.id}"]`);
    const exportContainer = exportBtn.parentElement;
    const exportOptions = exportContainer.querySelectorAll('.export-option');
    
    if (item.type === 'graph' && item.result && item.result.nodes && item.result.nodes.length < 10) {
        const svgOption = exportContainer.querySelector('.svg-export');
        if (svgOption) {
            svgOption.style.display = 'block';
        }
    }

    exportBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        document.querySelectorAll('.export-container.active').forEach(container => {
            if (container !== exportContainer) {
                container.classList.remove('active');
            }
        });
        exportContainer.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!exportContainer.contains(e.target)) {
            exportContainer.classList.remove('active');
        }
    });

    exportOptions.forEach(option => {
        option.addEventListener('click', async () => {
            const format = option.textContent.trim();
            const data = item.result;
            
            let exportData;
            let filename;
            let mimeType;

            try {
                switch (item.type) {
                    case 'numbers':
                        if (format === 'CSV') {
                            exportData = Array.isArray(data) ? data.join(',') : JSON.stringify(data);
                            filename = `numbers_sequence_${item.id}.csv`;
                            mimeType = 'text/csv';
                        } else if (format === 'JSON') {
                            exportData = JSON.stringify(data);
                            filename = `numbers_sequence_${item.id}.json`;
                            mimeType = 'application/json';
                        }
                        break;
                        
                    case 'matrix':
                        if (format === 'CSV') {
                            exportData = Array.isArray(data) ? 
                                data.map(row => Array.isArray(row) ? row.join(',') : row).join('\n') : 
                                JSON.stringify(data);
                            filename = `matrix_${item.id}.csv`;
                            mimeType = 'text/csv';
                        } else if (format === 'JSON') {
                            exportData = JSON.stringify(data, null, 2);
                            filename = `matrix_${item.id}.json`;
                            mimeType = 'application/json';
                        }
                        break;
                        
                    case 'string':
                        if (format === 'TXT') {
                            exportData = typeof data === 'string' ? data : JSON.stringify(data);
                            filename = `generated_string_${item.id}.txt`;
                            mimeType = 'text/plain';
                        } else if (format === 'JSON') {
                            exportData = JSON.stringify({ string: data });
                            filename = `generated_string_${item.id}.json`;
                            mimeType = 'application/json';
                        }
                        break;
                        
                    case 'graph':
                        if (format === 'SVG') {
                            try {
                                const token = localStorage.getItem('token');
                                const svgResponse = await fetch(`${API_BASE_URL}/generators/graphs/${item.id}/svg`, {
                                    method: 'GET',
                                    headers: {
                                        'Authorization': `Bearer ${token}`
                                    }
                                });
                                
                                if (!svgResponse.ok) {
                                    throw new Error('Failed to fetch SVG');
                                }
                                
                                exportData = await svgResponse.text();
                                filename = `generated_graph_${item.id}.svg`;
                                mimeType = 'image/svg+xml';
                            } catch (error) {
                                showError('Failed to generate SVG');
                                return;
                            }
                        } else if (format === 'JSON') {
                            exportData = JSON.stringify(data, null, 2);
                            filename = `generated_graph_${item.id}.json`;
                            mimeType = 'application/json';
                        }
                        break;
                        
                    default:
                        exportData = JSON.stringify(data, null, 2);
                        filename = `data_${item.id}.json`;
                        mimeType = 'application/json';
                }

                if (!exportData || !filename || !mimeType) {
                    showError('Invalid export format selected');
                    return;
                }

                const blob = new Blob([exportData], { type: mimeType });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                
                exportContainer.classList.remove('active');
                showError('File exported successfully!', true);
                
            } catch (error) {
                console.error('Export error:', error);
                showError('Failed to export file');
            }
        });
    });
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

const validateGraphInputs = (nodes, edges, isDirected, isWeighted) => {
    if (isNaN(nodes) || nodes <= 0) {
        throw new Error('Number of nodes must be a positive number');
    }

    if (isNaN(edges) || edges < 0) {
        throw new Error('Number of edges must be a non-negative number');
    }

    const maxPossibleEdges = isDirected ? 
        nodes * (nodes - 1) :         
        (nodes * (nodes - 1)) / 2;    

    const minEdgesForConnected = nodes - 1;

    if (edges > maxPossibleEdges) {
        throw new Error(
            `Too many edges! Maximum possible edges for ${nodes} nodes in a ${isDirected ? 'directed' : 'undirected'} graph is ${maxPossibleEdges}`
        );
    }

    const warnings = [];

    if (edges < minEdgesForConnected) {
        warnings.push(`Warning: With ${edges} edges, the graph cannot be connected (minimum ${minEdgesForConnected} needed)`);
    }

    if (nodes > 10 && isWeighted) {
        warnings.push('Warning: Large weighted graphs might be harder to visualize');
    }

    if (nodes === 1 && edges > 0) {
        throw new Error('A graph with 1 node cannot have any edges');
    }

    if (nodes === 2 && isDirected && edges > 2) {
        throw new Error('A directed graph with 2 nodes cannot have more than 2 edges');
    }

    if (nodes === 2 && !isDirected && edges > 1) {
        throw new Error('An undirected graph with 2 nodes cannot have more than 1 edge');
    }

    if (edges === maxPossibleEdges) {
        warnings.push(`This will generate a complete ${isDirected ? 'directed' : 'undirected'} graph`);
    }

    if (edges === minEdgesForConnected && !isDirected) {
        warnings.push('This might generate a tree-like structure (n-1 edges)');
    }

    return warnings;
};
