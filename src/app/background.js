console.log("Starting extenstion.")


// Regex for *.nostr* in url search key
const dotNostrRegex = /\w+\.nostr\w*/;
const httpRegex = /https?:\/\//g;

function redirectRequestHandler(details) {
    const url = new URL(details.url);
    const hostname = url.hostname.match(dotNostrRegex)[0];
    const npub = hostname.replace(".nostr", "");

    console.log(`url npub found! ${npub}`);

    // Check if the URL's hostname ends with ".nostr"
    console.log(`Testing url ${url.hostname}: ${dotNostrRegex.test(url.hostname)}`);
    if (dotNostrRegex.test(url.hostname)) {
        console.log(`Test passed. Redirecting...`)
        return { redirectUrl: `http://primal.net/p/` + npub + url.search + url.hash };
    }

    return { cancel: false }
};

function handleBeforeNavigate(details) {
    const url = new URL(details.url);

    if (url.search !== "") {
        if (dotNostrRegex.test(url.search)) {
            // Stop original navigation
            chrome.webNavigation.onBeforeNavigate.removeListener(handleBeforeNavigate);

            // Get new URL with `http` prefix
            const matchString = url.search.match(dotNostrRegex)[0];
            const newUrl = `http://${matchString}`;
            
            // Get the active tab and update its URL
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                if (tabs && tabs[0]) {
                chrome.tabs.update(tabs[0].id, { url: newUrl });
                }
            });
        }
    }
};

// Redirect .nostr traffic
chrome.webRequest.onBeforeRequest.addListener(
    redirectRequestHandler,
    {
        urls: ["<all_urls>"],
        types: ["main_frame"]
    },
    ["blocking"]
);

// Any web address that is not prepended with `http` needs to be updated with it before navigation.
chrome.webNavigation.onBeforeNavigate.addListener(
    handleBeforeNavigate
);

// Load a `default` relay list if a list doesn't already exist in storage.
chrome.storage.local.get("relayList").then((result) => {
    console.log(result)
    const { relayList = [] } = result;
    console.log(`Relay list length: ${relayList.length}`);
    
    // List will initiate as an array of one empty string that needs to be removed.
    if (relayList.length === 1) {
        if (relayList[0] === "") {
            console.log("first element empty. Removing.");
            relayList.splice(0,1);
        }
        // If the user happens to have a relay list of exactly 1, don't do anything.
    }


    // Not sure how to tackle this just yet.
    /*
    if (relayList.length < 1) {
      console.log(`Relay list empty. Loading default list.`)
      const tempRelayList = fetch("https://api.nostr.watch/v1/online")
        .then(response => {
            if (!response.ok) {
                throw new Error("Unable to fetch relay list.");
            }
        return response.json();
        })
        .then(data => {
            console.log(data);
        })
        .catch(error => {
            console.error(`Error: ${error}`);
        })
      console.log(tempRelayList);
    } else {
        for (var i=0; i<relayList.length; i++) {
            console.log(`Relay ${i+1}: ${i}`);
        }
    }
    */
});