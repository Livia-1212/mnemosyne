// settings.js

document.addEventListener("DOMContentLoaded", () => {
    const connectBtn = document.getElementById("connectNotion");
    const disconnectBtn = document.getElementById("disconnectNotion");
    const integrationStatus = document.getElementById("integrationStatus");

    const apiKeyInput = document.getElementById("apiKey");
    const saveApiKeyBtn = document.getElementById("saveApiKey");
    const apiStatus = document.getElementById("apiStatus");

    const themeToggle = document.getElementById("themeToggle");
    const logoutBtn = document.getElementById("logoutBtn");

    // --- Notion Integration ---
    connectBtn.addEventListener("click", async () => {
        try {
            const response = await fetch("/connect_notion");
            const data = await response.json();
            integrationStatus.textContent = data.success ? "Notion connected ✅" : "Failed to connect.";
        } catch (err) {
            console.error(err);
            integrationStatus.textContent = "Error connecting to Notion.";
        }
    });

    disconnectBtn.addEventListener("click", async () => {
        try {
            const response = await fetch("/disconnect_notion");
            const data = await response.json();
            integrationStatus.textContent = data.success ? "Notion disconnected ⚠️" : "Failed to disconnect.";
        } catch (err) {
            console.error(err);
            integrationStatus.textContent = "Error disconnecting Notion.";
        }
    });

    // --- API Key ---
    saveApiKeyBtn.addEventListener("click", async () => {
        const key = apiKeyInput.value.trim();
        if (!key) {
            apiStatus.textContent = "API key cannot be empty.";
            return;
        }
        try {
            const response = await fetch("/save_api_key", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ api_key: key })
            });
            const data = await response.json();
            apiStatus.textContent = data.success ? "API key saved ✅" : "Failed to save API key.";
        } catch (err) {
            console.error(err);
            apiStatus.textContent = "Error saving API key.";
        }
    });

    // --- Theme Toggle ---
    themeToggle.addEventListener("change", () => {
        document.body.classList.toggle("dark-mode", themeToggle.checked);
        localStorage.setItem("darkMode", themeToggle.checked);
    });

    // Load theme preference
    const darkMode = localStorage.getItem("darkMode") === "true";
    themeToggle.checked = darkMode;
    document.body.classList.toggle("dark-mode", darkMode);

    // --- Logout ---
    logoutBtn.addEventListener("click", async () => {
        try {
            const response = await fetch("/logout");
            if (response.ok) window.location.href = "uploadandOCR.html";
            else alert("Failed to log out.");
        } catch (err) {
            console.error(err);
            alert("Error logging out.");
        }
    });
});
