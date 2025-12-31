async function submitIssueReport() {
    const issueType = document.getElementById('issue-type').value;
    const notes = document.getElementById('report-notes').value;
    const location = document.getElementById('report-location').innerText;

    if (notes.length < 5) {
        alert("Please provide brief notes.");
        return;
    }
    
    try {
        const response = await fetch(API_URLS.REPORT_SUBMIT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                driverId: loggedInDriverInfo.id,
                truckId: loggedInDriverInfo.truck,
                issueType, notes, location
            })
        });

        if (!response.ok) throw new Error("Failed");
        const result = await response.json();
        
        alert(`Report submitted! Case ID: ${result.reportId}`);
        document.getElementById('report-notes').value = '';
        switchActionView('confirmation-view');

    } catch (error) {
        alert("Error submitting report.");
    }
}