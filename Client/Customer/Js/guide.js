const wasteItems = [
    { name: "Plastic Bottle", icon: "♻️", tip: "Recycle" },
    { name: "Pizza Box", icon: "🍕", tip: "General Waste" }
];

function filterGuide() {
    const input = document.getElementById('guide-search').value.toLowerCase();
    const resultsDiv = document.getElementById('guide-results');
    const noRes = document.getElementById('no-results-message');
    resultsDiv.innerHTML = '';

    if (!input) { noRes.classList.add('hidden'); return; }

    const filtered = wasteItems.filter(i => i.name.toLowerCase().includes(input));
    
    if (filtered.length === 0) noRes.classList.remove('hidden');
    else {
        noRes.classList.add('hidden');
        filtered.forEach(item => {
            resultsDiv.innerHTML += `
                <div class="flex items-center p-3 border rounded hover:bg-gray-50">
                    <span class="text-2xl mr-3">${item.icon}</span>
                    <div><div class="font-bold">${item.name}</div><div class="text-sm text-gray-500">${item.tip}</div></div>
                </div>`;
        });
    }
}