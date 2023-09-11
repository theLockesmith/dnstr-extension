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
};

function handleBeforeNavigate(details) {
    const url = new URL(details.url);

    if (url.search !== "") {
        if (dotNostrRegex.test(url.search)) {
            // Stop original navigation
            browser.webNavigation.onBeforeNavigate.removeListener(handleBeforeNavigate);

            // Get new URL with `http` prefix
            const matchString = url.search.match(dotNostrRegex)[0];
            const newUrl = `http://${matchString}`;
            
            // Get the active tab and update its URL
            browser.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                if (tabs && tabs[0]) {
                browser.tabs.update(tabs[0].id, { url: newUrl });
                }
            });
        }
    }
};

// Redirect .nostr traffic
browser.webRequest.onBeforeRequest.addListener(
    redirectRequestHandler,
    {
        urls: ["<all_urls>"],
        types: ["main_frame"]
    },
    ["blocking"]
);

// Any web address that is not prepended with `http` needs to be updated with it before navigation.
browser.webNavigation.onBeforeNavigate.addListener(
    handleBeforeNavigate
);
