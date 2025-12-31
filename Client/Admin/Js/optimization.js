function calculateOptimization() {
    const route = document.getElementById('route-select')?.value || 'R-Central';
    const stops = 15; 
    const currentHours = stops * 0.35 + (route === 'R-Central' ? 1.0 : 0.5); 
    const optimizedHours = currentHours * 0.7;
    const currentDistance = stops * 3.5;
    const optimizedDistance = currentDistance * 0.75;
    const distanceReduced = currentDistance - optimizedDistance;
    const fuelSavings = distanceReduced * 120; 

    document.getElementById('current-time').innerText = `${currentHours.toFixed(1)} hrs`;
    document.getElementById('optimized-time').innerText = `${optimizedHours.toFixed(1)} hrs`;
    document.getElementById('reduced-time').innerText = `${(currentHours - optimizedHours).toFixed(1)} hrs`;
    document.getElementById('fuel-savings').innerText = `₦ ${fuelSavings.toFixed(0)}`;
    document.getElementById('distance-reduced').innerText = `${distanceReduced.toFixed(1)} km`;
}
