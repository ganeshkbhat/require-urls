
const urls = ['https://www.google.com', 'https://www.google.com/search?q=javascript', 'https://www.google.com/search?q=web+workers'];
fetchMultipleUrls(urls)
    .then((results) => {
        console.log(results);
    })
    .catch((error) => {
        console.error(error);
    });
