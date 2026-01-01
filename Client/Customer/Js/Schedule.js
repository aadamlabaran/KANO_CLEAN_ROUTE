// Client/Customer/js/schedule.js

function loadSchedule() {
    const container = document.getElementById('schedule');
    
    // Inject the HTML
    container.innerHTML = `
        <div class="bg-white p-8 rounded-xl shadow-lg border-l-4 border-emerald-500">
            <h2 class="text-2xl font-bold text-gray-800 mb-2">Weekly Collection Schedule</h2>
            <p class="text-gray-500 mb-6">Zone: Kano Municipal (Route A)</p>
            
            <div class="space-y-4">
                <div class="flex items-center p-4 bg-blue-50 rounded-lg">
                    <span class="text-2xl mr-4">🗑️</span>
                    <div>
                        <h4 class="font-bold text-blue-900">General Waste</h4>
                        <p class="text-sm text-blue-700">Tuesdays & Fridays • 6:00 AM</p>
                    </div>
                </div>

                <div class="flex items-center p-4 bg-emerald-50 rounded-lg">
                    <span class="text-2xl mr-4">♻️</span>
                    <div>
                        <h4 class="font-bold text-emerald-900">Recyclables</h4>
                        <p class="text-sm text-emerald-700">Wednesdays • 7:00 AM</p>
                    </div>
                </div>
            </div>
            
            <div class="mt-6 text-xs text-gray-400">
                * Please place bins outside by 5:30 AM.
            </div>
        </div>
    `;
}