function updateMap() {
    const pathContainer = document.getElementById('route-path');
    if (!pathContainer) return;

    pathContainer.innerHTML = '';
    
    // Draw route line
    const line = document.createElement('div');
    line.className = 'absolute w-1 h-full bg-gray-500 opacity-50 left-1/2 transform -translate-x-1/2';
    pathContainer.appendChild(line);

    driverRoute.forEach((job, index) => {
        const marker = document.createElement('div'); 
        const isCurrent = index === currentJobIndex;
        const isComplete = job.status === 'Completed';
        let topPosition = `${20 + index * 15}%`; 

        marker.className = `route-marker absolute w-6 h-6 rounded-full text-white flex items-center justify-center text-xs font-bold transition-all duration-300`;
        marker.setAttribute('data-job-id', job.id);
        
        if (isComplete) {
            marker.style.backgroundColor = '#10b981'; /* Emerald */
            marker.innerHTML = '✓';
        } else if (isCurrent) {
            marker.style.backgroundColor = '#f59e0b'; /* Amber */
            marker.innerHTML = job.id;
        } else {
            marker.style.backgroundColor = '#64748b'; /* Slate */
            marker.innerHTML = job.id;
        }
        
        marker.style.top = topPosition;
        marker.style.left = index % 2 === 0 ? '50%' : '30%'; 

        pathContainer.appendChild(marker);
    });
}