const guideData = [
    { item: "Plastic Water Bottle", category: "Recyclable", instruction: "Empty and replace cap. Place directly in the blue bin.", allowed: true },
    { item: "Pizza Box", category: "Compostable/Trash", instruction: "If greasy or food-stained, must go in the trash bin. Clean parts can be recycled.", allowed: false },
    { item: "Aluminum Can", category: "Recyclable", instruction: "Rinse clean. Place directly in the blue bin.", allowed: true },
    { item: "Glass Jar (Food)", category: "Recyclable", instruction: "Rinse clean. Remove lids (trash or separate metal recycling).", allowed: true },
    { item: "Broken Plate/Ceramics", category: "Trash", instruction: "Wrap broken pieces in paper and place in the trash bin.", allowed: false },
    { item: "Used Cooking Oil", category: "Special Disposal", instruction: "Do NOT pour down the drain or place in bins. Take to a municipal drop-off location.", allowed: false },
    { item: "Newspaper/Magazines", category: "Recyclable", instruction: "Bundle and place in blue bin.", allowed: true },
    { item: "Light Bulbs (Standard)", category: "Trash", instruction: "Wrap securely and place in the trash.", allowed: false },
    { item: "Batteries (Alkaline)", category: "Special Disposal", instruction: "Take to a municipal drop-off location or a battery recycling center.", allowed: false },
    { item: "Styrofoam/Polystyrene", category: "Trash", instruction: "Not recyclable through our current program. Place in trash.", allowed: false },
];

function renderGuide(data = guideData) {
    const container = document.getElementById('guide-results');
    if(!container) return; // Guard clause
    container.innerHTML = '';
    
    if (data.length === 0) {
        document.getElementById('no-results-message').classList.remove('hidden');
        return;
    }

    document.getElementById('no-results-message').classList.add('hidden');

    data.forEach(item => {
        const card = document.createElement('div');
        const statusClass = item.allowed ? 'border-emerald-300 bg-emerald-50' : 'border-amber-300 bg-amber-50';
        const statusText = item.allowed ? '✅ YES' : '❌ NO';
        const statusColor = item.allowed ? 'text-emerald-700' : 'text-amber-700';

        card.className = `p-4 rounded-xl border-2 ${statusClass} shadow-sm flex justify-between items-center`;
        card.innerHTML = `
            <div>
                <h4 class="font-bold text-gray-800">${item.item} <span class="text-xs font-normal text-gray-500 ml-2">(${item.category})</span></h4>
                <p class="text-sm text-gray-600 mt-1">${item.instruction}</p>
            </div>
            <div class="flex-shrink-0">
                <span class="font-bold text-lg ${statusColor}">${statusText}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

function filterGuide() {
    const query = document.getElementById('guide-search').value.toLowerCase();
    const filtered = guideData.filter(item => 
        item.item.toLowerCase().includes(query) || 
        item.category.toLowerCase().includes(query)
    );
    renderGuide(filtered);
}

// Initial render
document.addEventListener('DOMContentLoaded', () => {
    renderGuide();
});