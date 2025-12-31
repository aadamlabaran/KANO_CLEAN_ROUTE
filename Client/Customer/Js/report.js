const API_URL_SUBMIT_REPORT = 'http://127.0.0.1:3000/api/customer/submit-report';
window.currentReportIssue = null;

function getReportContent() {
    return `
        <div class="mb-6 max-w-3xl mx-auto">
            <h2 class="text-3xl font-bold text-gray-900 mb-2">Report a Service Issue</h2>
            <p class="text-gray-600">Use this form to notify us immediately about missed collections or illegal dumping.</p>
        </div>
        <div class="bg-white p-8 rounded-xl shadow-xl max-w-3xl mx-auto space-y-6">
            <div id="step-1">
                <h3 class="text-xl font-bold text-emerald-600 mb-4">Step 1: What is the Issue?</h3>
                <div class="grid grid-cols-2 gap-4">
                    <button onclick="selectIssue('Missed Pickup')" class="issue-btn border-2 border-gray-200 p-4 rounded-xl hover:bg-blue-50 transition-colors text-center">🚚 Missed Pickup</button>
                    <button onclick="selectIssue('Overflowing Bin')" class="issue-btn border-2 border-gray-200 p-4 rounded-xl hover:bg-blue-50 transition-colors text-center">🗑️ Overflowing Bin</button>
                    <button onclick="selectIssue('Illegal Dumping')" class="issue-btn border-2 border-gray-200 p-4 rounded-xl hover:bg-blue-50 transition-colors text-center">⚠️ Illegal Dumping</button>
                    <button onclick="selectIssue('Damaged Container')" class="issue-btn border-2 border-gray-200 p-4 rounded-xl hover:bg-blue-50 transition-colors text-center">🔨 Damaged Container</button>
                </div>
            </div>
            <div id="step-2" class="hidden">
                <h3 class="text-xl font-bold text-emerald-600 mb-4">Step 2: Location & Details</h3>
                <label for="report-address" class="block text-sm font-medium text-gray-700">Incident Address</label>
                <input type="text" id="report-address" placeholder="Address of incident" class="w-full border border-gray-300 rounded-lg p-3 mb-4" />
                <label for="report-details" class="block text-sm font-medium text-gray-700">Additional Details (Optional)</label>
                <textarea type="text" id="report-details" rows="3" placeholder="Time, description, etc." class="w-full border border-gray-300 rounded-lg p-3"></textarea>
                <button onclick="submitReport()" class="mt-6 w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-lg transition-colors shadow-lg">Submit Report (<span id="selected-issue-text"></span>)</button>
            </div>
            <div id="report-confirmation" class="hidden text-center p-6 bg-green-50 rounded-xl border border-green-300">
                <span class="text-4xl block mb-3">✅</span>
                <h3 class="text-xl font-bold text-emerald-700">Report Submitted!</h3>
                <p class="text-gray-700 mt-2">Thank you. Your report has been logged and assigned case number <strong>RPT-1582</strong>.</p>
            </div>
        </div>`;
}

function selectIssue(issue) {
    window.currentReportIssue = issue;
    document.getElementById('selected-issue-text').innerText = issue;
    
    document.querySelectorAll('.issue-btn').forEach(btn => {
        btn.classList.remove('border-4', 'border-emerald-600', 'bg-emerald-100');
    });
    event.currentTarget.classList.add('border-4', 'border-emerald-600', 'bg-emerald-100');
    
    document.getElementById('step-1').classList.add('hidden');
    document.getElementById('step-2').classList.remove('hidden');
}

async function submitReport() {
    const issue = window.currentReportIssue;
    const address = document.getElementById('report-address').value.trim();
    const details = document.getElementById('report-details').value.trim();

    if (address.length < 5 || !issue) {
        alert("Please enter the address and select an issue.");
        return;
    }

    try {
        const response = await fetch(API_URL_SUBMIT_REPORT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ issue: issue, address: address, details: details })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            document.getElementById('step-2').classList.add('hidden');
            document.getElementById('report-confirmation').classList.remove('hidden');
            document.querySelector('#report-confirmation p').innerHTML = `Thank you. Your report has been logged and assigned case number <strong>RPT-${result.reportId}</strong>.`;
            
            // Clear inputs
            document.getElementById('report-address').value = '';
            document.getElementById('report-details').value = '';
        } else {
            alert(result.message || 'Failed to submit report. Please check server logs.');
        }

    } catch (e) {
        console.error("Report Submission Error:", e);
        alert('Could not connect to the reporting service.');
    }
}

function resetReportForm() {
    window.currentReportIssue = null;
    const step1 = document.getElementById('step-1');
    if(!step1) return; // Guard if element not rendered yet

    step1.classList.remove('hidden');
    document.getElementById('step-2').classList.add('hidden');
    document.getElementById('report-confirmation').classList.add('hidden');
    document.querySelectorAll('.issue-btn').forEach(btn => {
        btn.classList.remove('border-4', 'border-emerald-600', 'bg-emerald-100');
    });
    const addr = document.getElementById('report-address');
    if(addr) addr.value = '';
    const det = document.getElementById('report-details');
    if(det) det.value = '';
}