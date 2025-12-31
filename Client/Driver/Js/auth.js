async function handleLogin() {
    const driverId = document.getElementById('driver-id-input').value.trim();
    const vehicleNo = document.getElementById('vehicle-no-input').value.trim();
    const errorElement = document.getElementById('login-error');
    const loginButton = document.getElementById('login-button');

    errorElement.classList.add('hidden');
    loginButton.disabled = true;
    loginButton.innerText = "Connecting...";

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); 

    try {
        const response = await fetch(API_URLS.LOGIN, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ driverId, vehicleNo }),
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        const result = await response.json();

        if (response.ok) {
            loggedInDriverInfo = result.driverInfo;
            document.getElementById('header-driver-id').innerText = loggedInDriverInfo.id;
            
            document.getElementById('login-screen').classList.add('hidden');
            document.getElementById('driver-dashboard').classList.remove('hidden');

            initializeDashboard();
        } else {
            errorElement.innerText = result.message || 'Login failed.';
            errorElement.classList.remove('hidden');
        }
    } catch (e) {
        clearTimeout(timeoutId);
        errorElement.innerText = e.name === 'AbortError' ? 'Connection timed out.' : 'Server connection failed.';
        errorElement.classList.remove('hidden');
    } finally {
        loginButton.disabled = false;
        loginButton.innerText = "LOG IN";
    }
}

function renderProfileDropdown() {
    let dropdown = document.getElementById('profile-dropdown');
    if (!dropdown) {
        const header = document.querySelector('header .flex.justify-between div:last-child');
        const div = document.createElement('div');
        div.className = 'relative inline-block ml-2';
        div.innerHTML = `
            <button id="profile-btn" class="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold py-2 px-3 rounded-lg flex items-center gap-2 focus:outline-none text-xs sm:text-sm">
                <span>Profile</span> ▼
            </button>
            <div id="profile-dropdown" class="hidden absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <button onclick="logoutDriver()" class="block w-full text-left px-4 py-2 text-gray-700 hover:bg-emerald-50 text-sm">Logout</button>
            </div>
        `;
        header.appendChild(div);
        document.getElementById('profile-btn').onclick = function() {
            document.getElementById('profile-dropdown').classList.toggle('hidden');
        };
        document.body.addEventListener('click', function(e) {
            if (!e.target.closest('#profile-btn')) {
                document.getElementById('profile-dropdown').classList.add('hidden');
            }
        });
    }
}

function logoutDriver() {
    location.reload();
}

let sessionTimeout;
function resetSessionTimeout() {
    clearTimeout(sessionTimeout);
    sessionTimeout = setTimeout(() => {
        showToast('Session expired. Logging out...', 'error');
        setTimeout(() => location.reload(), 2000);
    }, 1000 * 60 * 30); // 30 min
}
document.body.addEventListener('mousemove', resetSessionTimeout);
document.body.addEventListener('keydown', resetSessionTimeout);