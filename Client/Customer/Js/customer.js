// ===== PAGE INITIALIZATION =====
document.addEventListener("DOMContentLoaded", () => {
    // Tab navigation
    const tabs = document.querySelectorAll("nav a");
    const sections = document.querySelectorAll("main > div");

    tabs.forEach(tab => {
        tab.addEventListener("click", (e) => {
            e.preventDefault();
            const target = tab.getAttribute("href").substring(1);
            sections.forEach(sec => {
                if (sec.id === target) sec.classList.remove("hidden");
                else sec.classList.add("hidden");
            });
        });
    });

    // Load dynamic content
    if (typeof loadSchedule === "function") loadSchedule();
    if (typeof loadGuide === "function") loadGuide();
});
