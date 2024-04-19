

const axios = require('axios');

// let c = requireurls("https://github.com/ganeshkbhat/requireurl/blob/a34a222d761bb70d51ff3267c8530f40918db53e/index.js");

function fetchURL(url) {
    let h = url.includes("http://") ? require("http") : require("https");
    
}

function genGitURL() {

}

function genGitLabURL() {

}

function genSVNURL() {

}

function genFTPURL() {

}

function genMercurialURL() {

}

function getFilesGit() {
    // https://docs.github.com/en/rest/git/trees?apiVersion=2022-11-28#get-a-tree
    // https://stackoverflow.com/questions/25022016/get-all-file-names-from-a-github-repo-through-the-github-api
    // https://docs.github.com/en/rest/git/trees?apiVersion=2022-11-28
}

async function getFilesGit(owner, repo, path = '', branch = 'master') {
    let fileList = [];
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
                    console.log(file.download_url);
                    fileList.push(file.download_url)
                } else if (file.type === 'dir') {
                    await getFilesGit(owner, repo, file.path, branch);
                }
            }
        } else {
            console.error(`Failed to fetch files. Status code: ${response.status}`);
        }
        return fileList;
    } catch (error) {
        console.error('Error fetching files:', error.message);
        return JSON.stringify(error);
    }
}

function getFilesFTP() {

}

function getFilesSVN() {

}

function getFilesMecurial() {

}

async function fetchMultipleUrls(urls) {
    const fetchUrl = async (url) => {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
        }
        return response.text();
    };

}

function fetchUrls(fetchObj = ['https://www.google.com', 'http://www.paytm.com']) {

    const requests = fetchObj.fetch.map(obj => {
        return new Promise((resolve, reject) => {
            const http = (obj.includes("http:")) ? require('http') : require("https");
            http.get(obj.url, res => {
                let data = '';
                res.on('data', chunk => {
                    data += chunk;
                });
                res.on('end', () => {
                    resolve(data);
                });
            }).on('error', err => {
                reject(err);
            });
        });
    });

}


function requireurls(url, options) {

}


