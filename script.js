// Global variables
let currentSection = 'dashboard';
let trackingMap = null;
let liveTrackingMap = null;
let movementChart = null;
let speciesChart = null;
let isOffline = false;
let offlineData = [];

// Initialize maps
function initializeMaps() {
    // Initialize tracking map
    trackingMap = L.map('trackingMap').setView([-1.2921, 36.8219], 6); // Centered on Kenya
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(trackingMap);

    // Initialize live tracking map
    liveTrackingMap = L.map('liveTrackingMap').setView([-1.2921, 36.8219], 6);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(liveTrackingMap);
}

// Initialize charts
function initializeCharts() {
    // Movement patterns chart
    const movementCtx = document.getElementById('movementChart').getContext('2d');
    movementChart = new Chart(movementCtx, {
        type: 'line',
        data: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [{
                label: 'Average Movement (km)',
                data: [12, 19, 15, 25, 22, 30],
                borderColor: '#2c3e50',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });

    // Species distribution chart
    const speciesCtx = document.getElementById('speciesChart').getContext('2d');
    speciesChart = new Chart(speciesCtx, {
        type: 'doughnut',
        data: {
            labels: ['Lions', 'Elephants', 'Rhinos', 'Giraffes'],
            datasets: [{
                data: [30, 40, 15, 15],
                backgroundColor: ['#e74c3c', '#2ecc71', '#3498db', '#f1c40f']
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false
        }
    });
}

// Show/hide sections
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.style.display = 'none';
    });
    
    // Show selected section
    document.getElementById(sectionId).style.display = 'block';
    
    // Update active nav link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    event.target.classList.add('active');
    
    currentSection = sectionId;
    
    // Load section-specific data
    loadSectionData(sectionId);
}

// Load data based on current section
function loadSectionData(sectionId) {
    switch(sectionId) {
        case 'dashboard':
            loadDashboardData();
            break;
        case 'live-tracking':
            loadLiveTrackingData();
            break;
        case 'community':
            loadCommunityReports();
            break;
        case 'analytics':
            loadAnalyticsData();
            break;
    }
}

// Load dashboard data
async function loadDashboardData() {
    try {
        const response = await fetch('/api/dashboard');
        const data = await response.json();
        
        document.getElementById('totalAnimals').textContent = data.totalAnimals;
        document.getElementById('activeAlerts').textContent = data.activeAlerts;
        document.getElementById('communityReports').textContent = data.communityReports;
        document.getElementById('offlineData').textContent = offlineData.length;
        
        updateTrackingMap(data.trackedAnimals);
        updateRecentAlerts(data.recentAlerts);
    } catch (error) {
        console.error('Error loading dashboard data:', error);
        handleOfflineMode();
    }
}

// Load live tracking data
async function loadLiveTrackingData() {
    try {
        const response = await fetch('/api/live-tracking');
        const data = await response.json();
        
        updateLiveTrackingMap(data.activeDevices);
        updateActiveDevicesList(data.activeDevices);
        updateMovementHistory(data.movementHistory);
    } catch (error) {
        console.error('Error loading live tracking data:', error);
        handleOfflineMode();
    }
}

// Load community reports
async function loadCommunityReports() {
    try {
        const response = await fetch('/api/community-reports');
        const data = await response.json();
        
        updateCommunityReportsList(data.reports);
    } catch (error) {
        console.error('Error loading community reports:', error);
        handleOfflineMode();
    }
}

// Load analytics data
async function loadAnalyticsData() {
    try {
        const response = await fetch('/api/analytics');
        const data = await response.json();
        
        updateCharts(data);
        updatePredictiveInsights(data.insights);
    } catch (error) {
        console.error('Error loading analytics data:', error);
        handleOfflineMode();
    }
}

// Handle image preview and AI analysis
document.getElementById('image').addEventListener('change', async function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const preview = document.getElementById('imagePreview');
            preview.innerHTML = `<img src="${e.target.result}" alt="Animal Preview">`;
            analyzeImage(file);
        }
        reader.readAsDataURL(file);
    }
});

// AI Image Analysis
async function analyzeImage(file) {
    try {
        // Load TensorFlow.js model
        const model = await tf.loadLayersModel('path/to/your/model.json');
        
        // Preprocess image
        const image = await loadImage(file);
        const tensor = tf.browser.fromPixels(image)
            .resizeNearestNeighbor([224, 224])
            .toFloat()
            .expandDims();
        
        // Get prediction
        const prediction = await model.predict(tensor).data();
        const species = getSpeciesFromPrediction(prediction);
        
        // Display results
        const aiResults = document.getElementById('aiResults');
        aiResults.innerHTML = `
            <p class="ai-confidence">AI Analysis Results:</p>
            <p>Species: ${species.name}</p>
            <p>Confidence: ${(species.confidence * 100).toFixed(2)}%</p>
        `;
    } catch (error) {
        console.error('Error analyzing image:', error);
        handleOfflineMode();
    }
}

// Handle tracking form submission
document.getElementById('trackingForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('name', document.getElementById('animalName').value);
    formData.append('species', document.getElementById('species').value);
    formData.append('trackingDevice', document.getElementById('trackingDevice').value);
    formData.append('location', document.getElementById('location').value);
    formData.append('image', document.getElementById('image').files[0]);
    
    try {
        const response = await fetch('/api/track-animal', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            alert('Animal tracking data submitted successfully!');
            this.reset();
            document.getElementById('imagePreview').innerHTML = '';
            document.getElementById('aiResults').innerHTML = '';
        } else {
            throw new Error('Failed to submit tracking data');
        }
    } catch (error) {
        console.error('Error submitting tracking data:', error);
        handleOfflineMode();
    }
});

// Handle community report submission
document.getElementById('sightingForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('location', document.getElementById('sightingLocation').value);
    formData.append('species', document.getElementById('sightingSpecies').value);
    formData.append('image', document.getElementById('sightingImage').files[0]);
    formData.append('description', document.getElementById('sightingDescription').value);
    
    try {
        const response = await fetch('/api/community-report', {
            method: 'POST',
            body: formData
        });
        
        if (response.ok) {
            alert('Report submitted successfully!');
            this.reset();
            loadCommunityReports();
        } else {
            throw new Error('Failed to submit report');
        }
    } catch (error) {
        console.error('Error submitting report:', error);
        handleOfflineMode();
    }
});

// Offline Mode Handling
function handleOfflineMode() {
    if (!isOffline) {
        isOffline = true;
        showOfflineIndicator();
    }
}

function showOfflineIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'offline-indicator';
    indicator.textContent = 'You are offline. Changes will sync when connection is restored.';
    document.body.appendChild(indicator);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeMaps();
    initializeCharts();
    showSection('dashboard');
    
    // Check for offline support
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful');
            })
            .catch(err => {
                console.log('ServiceWorker registration failed: ', err);
            });
    }
}); 