// Client/js/auth.js
document.addEventListener('DOMContentLoaded', () => {
    
    const loginForm = document.getElementById('loginForm');
    const errorMsg = document.getElementById('error-msg');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault(); 

            // Visual Feedback
            const btn = loginForm.querySelector('button');
            const originalText = btn.innerText;
            btn.innerText = "VERIFYING...";
            btn.disabled = true;

            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (data.success) {
                    console.log("✅ Login Success! Role:", data.role);
                    
                    if (data.role === 'admin') {
                        window.location.href = '/Admin/dashboard.html';
                    } 
                    else if (data.role === 'driver') {
                        // 👇 THIS IS WHERE YOU WERE GOING
                        window.location.href = '/Driver/driver-dashboard.html'; 
                    } // 👈 YOU WERE MISSING THIS CLOSING BRACE!
                    else if (data.role === 'resident' || data.role === 'customer') {
                        window.location.href = '/Customer/dashboard.html';
                    }

                } else {
                    // Wrong Password
                    if(errorMsg) {
                        errorMsg.style.display = 'block';
                        errorMsg.innerText = "❌ " + (data.message || "Invalid Credentials");
                    } else {
                        alert("❌ " + (data.message || "Invalid Credentials"));
                    }
                    btn.innerText = originalText;
                    btn.disabled = false;
                }

            } catch (err) {
                console.error(err);
                alert("Server Connection Error.");
                btn.innerText = originalText;
                btn.disabled = false;
            }
        });
    }
});