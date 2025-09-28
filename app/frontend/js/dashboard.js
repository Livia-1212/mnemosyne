// dashboard.js

document.addEventListener("DOMContentLoaded", () => {
    const notesUl = document.getElementById("notesUl");
    const previewContent = document.getElementById("previewContent");
    const editBtn = document.getElementById("editNote");
    const resendBtn = document.getElementById("resendNote");
    const searchInput = document.getElementById("searchNotes");

    let notes = [];
    let selectedNote = null;

    // Fetch notes from backend
    async function fetchNotes() {
        try {
            const response = await fetch("/get_notes");
            if (!response.ok) throw new Error(`Server error: ${response.status}`);
            notes = await response.json();
            renderNotesList();
        } catch (err) {
            console.error(err);
            previewContent.innerHTML = "<p>Error loading notes.</p>";
        }
    }

    // Render notes list in left panel
    function renderNotesList(filter = "") {
        notesUl.innerHTML = "";
        const filteredNotes = notes.filter(note =>
            note.summary.toLowerCase().includes(filter.toLowerCase()) ||
            note.raw_text.toLowerCase().includes(filter.toLowerCase())
        );

        filteredNotes.forEach(note => {
            const li = document.createElement("li");
            li.textContent = note.summary.slice(0, 50) + (note.summary.length > 50 ? "..." : "");
            li.dataset.id = note.id;
            li.addEventListener("click", () => selectNote(note.id));
            notesUl.appendChild(li);
        });
    }

    // Display preview for selected note
    function selectNote(noteId) {
        selectedNote = notes.find(n => n.id === noteId);
        if (!selectedNote) return;

        previewContent.innerHTML = `
            <h3>Raw Text</h3>
            <p>${selectedNote.raw_text}</p>
            <h3>Summary</h3>
            <p>${selectedNote.summary}</p>
        `;
    }

    // Edit selected note
    editBtn.addEventListener("click", () => {
        if (!selectedNote) return alert("Select a note first.");
        // Store selected note in localStorage and redirect to summarize.html
        localStorage.setItem("rawText", selectedNote.raw_text);
        localStorage.setItem("aiSummary", selectedNote.summary);
        window.location.href = "summarize.html";
    });

    // Resend note to Notion
    resendBtn.addEventListener("click", async () => {
        if (!selectedNote) return alert("Select a note first.");
        try {
            const response = await fetch("/save_note", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    raw_text: selectedNote.raw_text,
                    summary: selectedNote.summary
                })
            });
            const data = await response.json();
            if (data.success) alert("Note resent to Notion!");
            else alert("Failed to resend note.");
        } catch (err) {
            console.error(err);
            alert("Error resending note.");
        }
    });

    // Search functionality
    searchInput.addEventListener("input", (e) => {
        renderNotesList(e.target.value);
    });

    // Initial fetch
    fetchNotes();
});
