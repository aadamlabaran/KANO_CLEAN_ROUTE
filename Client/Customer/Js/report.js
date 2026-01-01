// Client/Customer/js/report.js

function loadReportForm() {
    const container = document.getElementById('report');
    
    container.innerHTML = `
        <div class="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border-t-4 border-red-500">
            <h2 class="text-2xl font-bold text-gray-800 mb-2">Request Pickup / Report Issue</h2>
            <p class="text-gray-500 mb-6">Let us know if you have extra waste or a missed collection.</p>

            <form onsubmit="event.preventDefault(); submitReport();" class="space-y-4">
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-1">Request Type</label>
                    <select id="report-type" class="w-full border p-3 rounded-lg bg-white">
                        <option>Missed Collection</option>
                        <option>Special Pickup (Bulk Items)</option>
                        <option>Report Illegal Dumping</option>
                    </select>
                </div>
                
                <div>
                    <label class="block text-sm font-bold text-gray-700 mb-1">Details</label>
                    <textarea id="report-desc" rows="3" class="w-full border p-3 rounded-lg" placeholder="e.g., I have an old sofa to remove..."></textarea>
                </div>

                <button type="submit" class="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg shadow-md">
                    SUBMIT REQUEST
                </button>
            </form>
        </div>
    `;
}

function submitReport() {
    const type = document.getElementById('report-type').value;
    const desc = document.getElementById('report-desc').value;

    // Send signal to Driver
    const reqData = {
        address: "House #409, State Road",
        details: `${type}: ${desc}`,
        timestamp: new Date().toLocaleTimeString()
    };
    
    localStorage.setItem('ksc_pickup_signal', JSON.stringify(reqData));

    showGenericModal("Request Sent", "The nearest driver has been notified.");
    
    // Return to home after 2 seconds
    setTimeout(() => {
        hideModal('generic-modal');
        switchTab('home');
    }, 2000);
}