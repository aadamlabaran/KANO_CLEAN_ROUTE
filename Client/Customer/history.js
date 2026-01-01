// Client/Customer/js/history.js

function loadHistory() {
    const list = document.getElementById('history-list');
    const db = JSON.parse(localStorage.getItem('kcr_service_history')) || [];

    if (db.length === 0) {
        list.innerHTML = '<p class="text-gray-400 text-center py-4">No completed pickups yet.</p>';
        return;
    }

    // Sort by newest first
    const sortedDB = db.reverse();

    list.innerHTML = sortedDB.map(job => `
        <div class="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row justify-between items-center hover:bg-gray-50 transition">
            <div class="mb-4 md:mb-0">
                <div class="flex items-center gap-2">
                    <span class="text-emerald-600 font-bold text-lg">✅ Completed</span>
                    <span class="text-xs text-gray-400">${job.date} at ${job.time}</span>
                </div>
                <p class="text-gray-700 font-medium">${job.address}</p>
                <p class="text-xs text-gray-500">Driver: ${job.driver} | Weight: ${job.weight}</p>
            </div>

            <div>
                ${job.rating 
                    ? `<span class="text-yellow-500 text-xl">★`.repeat(job.rating) + `</span>` 
                    : `<div class="flex gap-1" id="rate-box-${job.id}">
                        <p class="text-xs font-bold mr-2 mt-1">Rate:</p>
                        <button onclick="rateDriver(${job.id}, 1)" class="hover:scale-125 transition">⭐</button>
                        <button onclick="rateDriver(${job.id}, 2)" class="hover:scale-125 transition">⭐</button>
                        <button onclick="rateDriver(${job.id}, 3)" class="hover:scale-125 transition">⭐</button>
                        <button onclick="rateDriver(${job.id}, 4)" class="hover:scale-125 transition">⭐</button>
                        <button onclick="rateDriver(${job.id}, 5)" class="hover:scale-125 transition">⭐</button>
                       </div>`
                }
            </div>
        </div>
    `).join('');
}

function rateDriver(id, stars) {
    // 1. Update Database
    const db = JSON.parse(localStorage.getItem('kcr_service_history')) || [];
    const jobIndex = db.findIndex(j => j.id === id);
    
    if (jobIndex !== -1) {
        db[jobIndex].rating = stars;
        localStorage.setItem('kcr_service_history', JSON.stringify(db));
        
        // 2. Refresh UI
        loadHistory();
        alert(`Thank you! You rated the driver ${stars} stars.`);
    }
}