// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('connect-wallet-button').addEventListener('click', connectWallet);
});

// Connect Wallet and Register User
async function connectWallet() {
    if (typeof window.ethereum === 'undefined') {
        alert('Please install MetaMask to use this feature.');
        return;
    }

    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const walletAddress = accounts[0];
        document.getElementById('wallet-status').textContent = `Wallet Connected: ${walletAddress}`;

        // Register the user in the database
        await registerUser(walletAddress);
        await fetchUser(walletAddress);
    } catch (error) {
        console.error('Error connecting to wallet:', error);
        alert('Failed to connect to MetaMask.');
    }
}

// Register User with Backend
async function registerUser(walletAddress) {
    try {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ walletAddress }),
        });

        if (response.status === 201) {
            console.log('User registered successfully');
        } else if (response.status === 409) {
            console.log('User already exists');
        } else {
            console.error('Failed to register user');
        }
    } catch (error) {
        console.error('Error registering user:', error);
    }
}

// Fetch User Data from Backend
async function fetchUser(walletAddress) {
    try {
        const response = await fetch(`/api/users/${walletAddress}`);
        const user = await response.json();
        document.getElementById('wallet-balance').textContent = `Balance: ${user.balance} ETH`;
    } catch (error) {
        console.error('Error fetching user:', error);
    }
}