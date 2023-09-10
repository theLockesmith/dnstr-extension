console.log("Starting extenstion.")
// Regex for (http|https)://*.nostr/*
// Holding on to this one in case the other doesn't work for all instances.
// const dotNostrRegex = /([a-zA-Z0-9-]+\.)+nostr(\/[a-zA-Z0-9-]+)*$/

// Regex for *.nostr* in url search key
const dotNostrRegex = /\w+\.nostr\w*/

function redirectRequestHandler(details) {
    const url = new URL(details.url);

    // Check if the URL's hostname ends with ".nostr"
    console.log(`Testing url ${url.hostname}: ${dotNostrRegex.test(url.hostname)}`);
    if (dotNostrRegex.test(url.hostname)) {
        console.log(`Test passed. Redirecting...`)
        return {redirectUrl: "http://srv.coldforge.xyz" + url.pathname + url.search + url.hash };
    }

    return { cancel: false }
}

browser.webRequest.onBeforeRequest.addListener(
    redirectRequestHandler,
    {
        urls: ["<all_urls>"],
        types: ["main_frame"]
    },
    ["blocking"]
);

browser.webNavigation.onBeforeNavigate.addListener((details) => {
    const url = new URL(details.url);
    console.log(`Testing url: ${url}: ${dotNostrRegex.test(url)}`);
    console.log(url)
    if (url.search !== "") {
        if (dotNostrRegex.test(url.search)) {
            console.log(`Preventing search by altering url`);

            const matchString = url.search.match(dotNostrRegex)[0];
            const newUrl = `http://${matchString}`;
            browser.webNavigation.navigate({ url: newUrl });

            return { redirectUrl: url }
        }
    }
});