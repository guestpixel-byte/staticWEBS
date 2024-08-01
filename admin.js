document.addEventListener("DOMContentLoaded", () => {
    const editBtn = document.getElementById("edit-btn");
    const saveBtn = document.getElementById("save-btn");
    const content = document.getElementById("content");

    editBtn.addEventListener("click", () => {
        content.querySelectorAll("[contenteditable]").forEach(el => el.setAttribute("contenteditable", "true"));
        editBtn.classList.add("hidden");
        saveBtn.classList.remove("hidden");
        content.classList.add("edit-mode");
        console.log("Entered edit mode");
    });

    saveBtn.addEventListener("click", () => {
        content.querySelectorAll("[contenteditable]").forEach(el => el.setAttribute("contenteditable", "false"));
        editBtn.classList.remove("hidden");
        saveBtn.classList.add("hidden");
        content.classList.remove("edit-mode");

        // Collect content and prepare for GitHub commit
        const updatedContent = content.innerHTML;
        console.log("Collected updated content:", updatedContent);
        commitToGitHub(updatedContent);
    });
});

function commitToGitHub(updatedContent) {
    // GitHub API: Update file content
    const token = "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"; // User must provide a GitHub token
    const repo = "guestpixel-byte.github.io/staticWEBS";
    const filePath = "guestpixel-byte.github.io/staticWEBS/index.html";
    const apiUrl = `https://api.github.com/repos/${repo}/contents/${filePath}`;

    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `token ${token}`,
            'Accept': 'application/vnd.github.v3+json'
        }
    })
    .then(response => response.json())
    .then(fileData => {
        const base64Content = btoa(unescape(encodeURIComponent(updatedContent))); // Encode content to base64
        console.log("Retrieved file data:", fileData);

        return fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            },
            body: JSON.stringify({
                message: "Updated content",
                content: base64Content,
                sha: fileData.sha
            })
        });
    })
    .then(response => response.json())
    .then(data => {
        if (data.commit) {
            console.log('Commit successful:', data);
        } else {
            console.error('Commit failed:', data);
        }
    })
    .catch(error => console.error('Error:', error));
}
