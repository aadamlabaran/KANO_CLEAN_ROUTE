// --- API CONFIG ---
const API_URL_ADMIN_LOGIN = 'http://127.0.0.1:3000/api/admin/login';
const API_URL_DASHBOARD_DATA = 'http://127.0.0.1:3000/api/admin/dashboard-data';
const API_URL_COMPLIANCE_LOGS = 'http://127.0.0.1:3000/api/admin/compliance-logs';

// --- STATE ---
let isAdminLoggedIn = false;
let loggedInAdminInfo = null;
let fleetData = [];
let alertsData = [];
let complianceData = [];
let charts = {}; 

// --- AUTHENTICATION ---
async function handleAdminLogin() {
    const adminId = document.getElementById('admin-id-input').value.trim();
    const uniqueNo = document.getElementById('unique-no-input').value.trim();
    const errorElement = document.getElementById('admin-login-error');
    const loginButton = document.getElementById('login-button');

    errorElement.classList.add('hidden');
    loginButton.disabled = true;
    loginButton.innerText = "Authenticating...";
    
    try {
        const response = await fetch(API_URL_ADMIN_LOGIN, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ adminId, uniqueNo })
        });

        const result = await response.json();

        if (response.ok) {
            isAdminLoggedIn = true;
            loggedInAdminInfo = result.adminInfo;
            
            document.getElementById('admin-user-info').innerText = `Admin User: Dispatch-KNO-${loggedInAdminInfo.id}`;
            document.getElementById('login-screen').classList.add('hidden');
            document.getElementById('admin-portal').classList.remove('hidden');

            initializeDashboard();
        } else {
            errorElement.innerText = result.message || 'Login failed. Check credentials.';
            errorElement.classList.remove('hidden');
        }
    } catch (e) {
        console.error("Network Error:", e);
        errorElement.innerText = 'Could not connect to the backend server (Is server.js running on port 3000?).';
        errorElement.classList.remove('hidden');
    } finally {
        loginButton.disabled = false;
        loginButton.innerText = "ACCESS DASHBOARD";
    }
}

function handleAdminLogout() {
    isAdminLoggedIn = false;
    loggedInAdminInfo = null;
    document.getElementById('admin-portal').classList.add('hidden');
    document.getElementById('login-screen').classList.remove('hidden');
    document.getElementById('admin-login-error').classList.add('hidden'); 
    document.getElementById('admin-id-input').value = '101'; 
    document.getElementById('unique-no-input').value = 'KNO-DISPATCH';
}

// --- INIT ---
async function initializeDashboard() {
    try {
        // Fetch dashboard metrics
        const dataResponse = await fetch(API_URL_DASHBOARD_DATA);
        const data = await dataResponse.json();

        if (!dataResponse.ok || !data.success) {
            throw new Error(data.message || "Failed to load dashboard data.");
        }

        // Fetch logs
        const logResponse = await fetch(API_URL_COMPLIANCE_LOGS);
        const logData = await logResponse.json();
        if (!logResponse.ok || !logData.success) {
            console.error("Failed to fetch compliance logs, using empty array.");
            logData.logs = []; 
        }

        // Update State
        fleetData = data.fleetStatusData;
        alertsData = data.alertsData;
        complianceData = logData.logs;

        // Render UI
        updateKPIs(data.kpis);
        initCharts(data.kpis.totalVolume);
        renderAlerts();
        renderFleetTable();
        renderComplianceTable();
        calculateOptimization(); 

        switchTab('dashboard');

    } catch (e) {
        console.error("Dashboard Initialization Error:", e);
        document.getElementById('admin-user-info').innerText = `Error: ${e.message}`;
    }
}

window.onload = function() {
    document.getElementById('admin-portal').classList.add('hidden');
}