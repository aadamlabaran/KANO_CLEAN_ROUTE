// --- FEATURE BAR INJECTION ---
function addFeatureButtons() {
    const panel = document.getElementById('job-actions-panel');
    if (!panel) return;
    
    let bar = document.getElementById('feature-bar');
    if (!bar) {
        bar = document.createElement('div');
        bar.id = 'feature-bar';
        bar.className = 'flex flex-wrap gap-2 mb-2 items-center';
        // These buttons trigger the functions defined below
        bar.innerHTML = `
            <button onclick="optimizeRoute()" class="bg-cyan-100 hover:bg-cyan-200 text-cyan-700 font-bold py-1 px-3 rounded text-xs">Optimize Route</button>
            <button onclick="addNavigationToJobCard()" class="bg-cyan-100 hover:bg-cyan-200 text-cyan-700 font-bold py-1 px-3 rounded text-xs">Navigation</button>
            <button onclick="showFullHistory()" class="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-bold py-1 px-3 rounded text-xs">History</button>
            <button onclick="showChatModal()" class="bg-cyan-100 hover:bg-cyan-200 text-cyan-700 font-bold py-1 px-3 rounded text-xs">Chat</button>
            <button onclick="showSafetyChecklist()" class="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-bold py-1 px-3 rounded text-xs">Safety</button>
            <button onclick="addPhotoUploadToReport()" class="bg-amber-100 hover:bg-amber-200 text-amber-700 font-bold py-1 px-3 rounded text-xs">Photo Upload</button>
            <button onclick="showPerformanceStats()" class="bg-cyan-100 hover:bg-cyan-200 text-cyan-700 font-bold py-1 px-3 rounded text-xs">Stats</button>
            <button onclick="toggleDarkMode()" class="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-1 px-3 rounded text-xs">Dark Mode</button>
            <button onclick="showHelpModal()" class="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 font-bold py-1 px-3 rounded text-xs">Help</button>
        `;
        // Insert the bar above the job action panel
        panel.parentNode.insertBefore(bar, panel);
    }
}

// --- 1. ROUTE OPTIMIZATION ---
function optimizeRoute() {
    // Demo logic: simple alphabetic sort by address
    driverRoute.sort((a, b) => a.address.localeCompare(b.address));
    
    // Reset current index to first pending job
    const nextPendingIndex = driverRoute.findIndex(j => j.status === 'Pending');
    currentJobIndex = nextPendingIndex !== -1 ? nextPendingIndex : driverRoute.length; // or 0 if all done
    
    // Update UI
    if (typeof updateMap === 'function') updateMap();
    if (typeof updateJobCard === 'function') updateJobCard();
    
    showToast('Route optimized (demo)', 'success');
}

// --- 2. NAVIGATION BUTTON ---
function addNavigationToJobCard() {
    const navBtnId = 'job-nav-btn';
    let navBtn = document.getElementById(navBtnId);
    
    // Only add if not already there
    if (!navBtn) {
        navBtn = document.createElement('a');
        navBtn.id = navBtnId;
        navBtn.className = 'bg-cyan-600 hover:bg-cyan-700 text-white cta-btn w-full block text-center mt-2';
        navBtn.target = '_blank';
        document.getElementById('stop-details').appendChild(navBtn);
    }
    
    const job = driverRoute[currentJobIndex];
    if (job) {
        navBtn.href = `https://www.google.com/maps/search/?api=1&query=$?q=${encodeURIComponent(job.address)}`;
        navBtn.innerText = 'Start Navigation';
    }
}

// --- 3. FULL HISTORY MODAL ---
function showFullHistory() {
    let modal = document.getElementById('history-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'history-modal';
        modal.className = 'fixed inset-0 modal-overlay flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white p-6 rounded-xl shadow-2xl max-w-lg w-full relative space-y-4 text-left max-h-[90vh] overflow-y-auto">
                <button onclick="hideModal('history-modal')" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl">×</button>
                <h3 class="text-xl font-bold text-emerald-700 mb-2">Full Job & Pickup History</h3>
                <div id="full-history-content"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    let html = '<ul class="divide-y">';
    // Add Jobs
    jobHistory.forEach(item => {
        html += `<li class="py-2 flex justify-between"><span>Stop ${item.id}: ${item.address}</span><span class="text-xs text-emerald-600 font-semibold">${item.weight} TONS</span></li>`;
    });
    // Add Pickups
    if (pickupRequests && pickupRequests.length) {
        html += '<li class="pt-4 font-bold text-amber-700">Pickup Requests</li>';
        pickupRequests.filter(r => r.status === 'Completed').forEach(req => {
            html += `<li class="py-2 flex justify-between"><span>${req.address}</span><span class="text-xs text-green-600 font-semibold">Completed</span></li>`;
        });
    }
    html += '</ul>';
    
    document.getElementById('full-history-content').innerHTML = html;
    modal.classList.remove('hidden');
}

// --- 4. CHAT MODAL ---
function showChatModal() {
    let modal = document.getElementById('chat-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'chat-modal';
        modal.className = 'fixed inset-0 modal-overlay flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full relative space-y-4 text-left">
                <button onclick="hideModal('chat-modal')" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl">×</button>
                <h3 class="text-xl font-bold text-cyan-700 mb-2">Dispatch Chat</h3>
                <div id="chat-messages" class="bg-gray-100 rounded p-2 h-40 overflow-y-auto mb-2 text-sm"></div>
                <input id="chat-input" class="w-full border rounded p-2" placeholder="Type a message..." />
                <button onclick="sendChatMessage()" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg w-full mt-2">Send</button>
            </div>
        `;
        document.body.appendChild(modal);
    }
    document.getElementById('chat-messages').innerHTML = '<div class="text-gray-400">(Demo only: No backend)</div>';
    modal.classList.remove('hidden');
}

function sendChatMessage() {
    const input = document.getElementById('chat-input');
    if (input.value.trim() !== "") {
        showToast('Chat sent (demo only)', 'success');
        input.value = "";
    }
}

// --- 5. SAFETY CHECKLIST ---
function showSafetyChecklist() {
    let modal = document.getElementById('safety-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'safety-modal';
        modal.className = 'fixed inset-0 modal-overlay flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full relative space-y-4 text-left">
                <button onclick="hideModal('safety-modal')" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl">×</button>
                <h3 class="text-xl font-bold text-emerald-700 mb-2">Pre-Trip Safety Checklist</h3>
                <form id="safety-form" class="space-y-2">
                    <label class="flex items-center gap-2"><input type="checkbox" required /> Brakes checked</label>
                    <label class="flex items-center gap-2"><input type="checkbox" required /> Lights working</label>
                    <label class="flex items-center gap-2"><input type="checkbox" required /> Tires inspected</label>
                    <label class="flex items-center gap-2"><input type="checkbox" required /> Emergency kit present</label>
                    <button type="submit" class="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg w-full mt-2">Submit</button>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('safety-form').onsubmit = function(e) {
            e.preventDefault();
            hideModal('safety-modal');
            showToast('Safety checklist submitted!', 'success');
        };
    }
    modal.classList.remove('hidden');
}

// --- 6. PHOTO UPLOAD ---
function addPhotoUploadToReport() {
    let input = document.getElementById('photo-upload');
    if (!input) {
        input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.id = 'photo-upload';
        input.className = 'block mt-2 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100';
        
        // Ensure the report section is visible so the user can see the input
        if(typeof switchActionView === 'function') switchActionView('report-issue');
        
        document.getElementById('report-issue').appendChild(input);
        showToast('Photo upload field added to report.', 'success');
    }
}

// --- 7. PERFORMANCE STATS ---
function showPerformanceStats() {
    let modal = document.getElementById('stats-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'stats-modal';
        modal.className = 'fixed inset-0 modal-overlay flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full relative space-y-4 text-left">
                <button onclick="hideModal('stats-modal')" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl">×</button>
                <h3 class="text-xl font-bold text-cyan-700 mb-2">Performance Stats</h3>
                <div id="stats-content" class="space-y-2"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    // Calculate demo stats
    const completedPickups = pickupRequests ? pickupRequests.filter(r => r.status === 'Completed').length : 0;
    
    document.getElementById('stats-content').innerHTML = `
        <div class="flex justify-between border-b py-1"><span>Jobs Completed:</span> <span class="font-bold">${jobHistory.length}</span></div>
        <div class="flex justify-between border-b py-1"><span>Pickups Completed:</span> <span class="font-bold">${completedPickups}</span></div>
        <div class="flex justify-between border-b py-1"><span>Average Load:</span> <span class="font-bold">${truckLoadPercentage}%</span></div>
        <div class="flex justify-between border-b py-1"><span>Safety Score:</span> <span class="font-bold text-green-600">98/100</span></div>
    `;
    modal.classList.remove('hidden');
}

// --- 8. DARK MODE ---
function toggleDarkMode() {
    document.body.classList.toggle('dark');
    // Basic Dark Mode styles injection if not present in CSS
    if (!document.getElementById('dark-mode-style')) {
        const style = document.createElement('style');
        style.id = 'dark-mode-style';
        style.innerHTML = `
            body.dark { background-color: #111827; color: #f3f4f6; }
            body.dark .bg-white { background-color: #1f2937; color: white; }
            body.dark .text-gray-800 { color: #f3f4f6; }
            body.dark .text-gray-700 { color: #d1d5db; }
            body.dark .text-gray-600 { color: #9ca3af; }
            body.dark .bg-gray-100 { background-color: #374151; }
            body.dark .border-gray-200, body.dark .border-gray-300 { border-color: #4b5563; }
        `;
        document.head.appendChild(style);
    }
}

// --- 9. HELP MODAL ---
function showHelpModal() {
    let modal = document.getElementById('help-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'help-modal';
        modal.className = 'fixed inset-0 modal-overlay flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full relative space-y-4 text-left">
                <button onclick="hideModal('help-modal')" class="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl">×</button>
                <h3 class="text-xl font-bold text-emerald-700 mb-2">Help & Support</h3>
                <div class="text-sm">For urgent issues, call <span class="font-bold">0800-REMASAB</span> or email <span class="font-bold">support@cleanroute.ng</span>.<br/><br/>See FAQ in the driver handbook.</div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    modal.classList.remove('hidden');
}