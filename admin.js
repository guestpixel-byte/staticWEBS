function commitToGitHub(updatedContent) {
    const token = "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"; // Replace with a secure method for token storage
    const repo = "guestpixel-byte/staticWEBS";
    const filePath = "index.html"; // Path relative to the repository
    const apiUrl = `https://api.github.com/repos/${repo}/contents/${filePath}`;
    
    fetch(apiUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'X-GitHub-Api-Version': '2022-11-28' // Add API version header if necessary
        }
    })
    .then(response => response.json())
    .then(fileData => {
        const base64Content = btoa(unescape(encodeURIComponent(updatedContent))); // Encode to base64
        console.log("Retrieved file data:", fileData);
        
        return fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            },
            body: JSON.stringify({
                message: "Updated content",
                content: base64Content,
                sha: fileData.sha // Use the current file SHA
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
