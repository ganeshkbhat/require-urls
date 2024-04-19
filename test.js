const axios = require('axios');

async function fetchFilesFromGithub(owner, repo, path = '', branch = 'master') {
    let filesList = [];
    try {
        const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
        const response = await axios.get(url, {
            headers: {
                Accept: 'application/vnd.github.v3+json',
            }
        });

        if (response.status === 200) {
            const files = response.data;
            for (const file of files) {
                if (file.type === 'file') {
                    // console.log(file);
                    filesList.push({ content: ((await axios.get(file.git_url)).content).toString("base64"), url: file.download_url });
                } else if (file.type === 'dir') {
                    await fetchFilesFromGithub(owner, repo, file.path, branch);
                }
            }
            return filesList;
        } else {
            console.error(`Failed to fetch files. Status code: ${response.status}`);
        }
    } catch (error) {
        console.error('Error fetching files:', error.message);
    }
}

// Example usage:
const owner = 'ganeshkbhat';
const repo = 'require-urls';
const branch = 'master';
fetchFilesFromGithub(owner, repo, '', branch);
