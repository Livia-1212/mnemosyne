// summary.js

document.addEventListener("DOMContentLoaded", () => {
    const rawTextArea = document.getElementById("rawText");
    const aiSummaryArea = document.getElementById("aiSummary");
    const saveBtn = document.getElementById("saveNote");
    const discardBtn = document.getElementById("discardNote");
    const statusDiv = document.getElementById("status");

    // Load data from localStorage
    const rawText = localStorage.getItem("rawText") || "";
    const aiSummary = localStorage.getItem("aiSummary") || "";

    rawTextArea.value = rawText;
    aiSummaryArea.value = aiSummary;

    // Save to Notion
  // Save to Notion
saveBtn.addEventListener("click", async () => {
    const summaryToSave = aiSummaryArea.value.trim();
    const rawTextToSave = rawTextArea.value.trim();
    const title = rawTextToSave.split("\n")[0] || "Untitled Note"; // Use first line as title

    if (summaryToSave === "") {
        statusDiv.textContent = "Summary cannot be empty.";
        return;
    }

    statusDiv.textContent = "Saving to Notion...";

    try {
        const response = await fetch("http://localhost:8000/export", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                raw_text: rawTextToSave,
                summary: summaryToSave
            })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();

        if (data.status === "success") {
            statusDiv.textContent = "Note saved successfully!";
            // Optionally redirect to dashboard
            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 1000);
        } else {
            statusDiv.textContent = "Failed to save note: " + (data.message || "Try again.");
        }

    } catch (err) {
        console.error(err);
        statusDiv.textContent = "Error saving note. Please try again.";
    }
});

    // Discard note
    discardBtn.addEventListener("click", () => {
        localStorage.removeItem("rawText");
        localStorage.removeItem("aiSummary");
        window.location.href = "uploadandOCR.html";
    });
});
