// upload.js

document.addEventListener("DOMContentLoaded", () => {
    const uploadForm = document.getElementById("uploadForm");
    const screenshotInput = document.getElementById("screenshot");
    const pasteText = document.getElementById("pasteText");
    const statusDiv = document.getElementById("status");

    uploadForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        statusDiv.textContent = "Processing...";

        // Prepare form data
        const formData = new FormData();

        if (screenshotInput.files.length > 0) {
            formData.append("screenshot", screenshotInput.files[0]);
        } else if (pasteText.value.trim() !== "") {
            formData.append("text", pasteText.value.trim());
        } else {
            statusDiv.textContent = "Please upload a file or paste text.";
            return;
        }

        try {
            // Send data to backend (Python endpoint)
            const response = await fetch("/process_upload", {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();

            // Example: store extracted text in localStorage to pass to summarize.html
            localStorage.setItem("rawText", data.raw_text);
            localStorage.setItem("aiSummary", data.summary);

            // Redirect to summarize page
            window.location.href = "summarize.html";

        } catch (err) {
            console.error(err);
            statusDiv.textContent = "Error processing the file. Please try again.";
        }
    });
});
