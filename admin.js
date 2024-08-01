// Include Octokit.js using a CDN or install it in your project
const { Octokit } = require("@octokit/core");

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

async function commitToGitHub(updatedContent) {
    const token = "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"; // Replace with a secure token storage method
    const repoOwner = "guestpixel-byte"; // Replace with the repository owner's username
    const repoName = "staticWEBS"; // Replace with the repository name
    const filePath = "index.html"; // Path relative to the repository
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}`;

    const octokit = new Octokit({
        auth: token
    });

    try {
        const fileData = await octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
            owner: repoOwner,
            repo: repoName,
            path: filePath,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });

        const base64Content = btoa(unescape(encodeURIComponent(updatedContent))); // Encode content to base64
        console.log("Retrieved file data:", fileData);

        const response = await octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
            owner: repoOwner,
            repo: repoName,
            path: filePath,
            message: "Updated content",
            content: base64Content,
            sha: fileData.data.sha,
            headers: {
                'X-GitHub-Api-Version': '2022-11-28'
            }
        });

        if (response.data.commit) {
            console.log('Commit successful:', response);
        } else {
            console.error('Commit failed:', response);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
