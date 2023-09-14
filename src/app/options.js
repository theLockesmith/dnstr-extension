"use strict";

if (typeof browser == "undefined") {
  // `browser` is not defined in Chrome, but Manifest V3 extensions in Chrome
  // also support promises in the `chrome` namespace, like Firefox. To easily
  // test the example without modifications, polyfill "browser" to "chrome".
  globalThis.browser = chrome;
}

function addRelayToList(relay) {
  browser.storage.local.get("relay-list").then((result) => {
    const { relayList = [] } = result;
    // Add relay to list
    relayList.push(relay);

    // Save updated list
    //browser.storage.local.set({ relayList });

    // Display updated list
    displayRelayList(relayList);
  })
}

function displayRelayList(list) {
  const relayList = document.getElementById("relay-list");
  relayList.innerHTML = '';
  list.forEach((relay) => {
    const listItem = document.createElement("div");
    listItem.textContent = relay;
    relayList.appendChild(listItem);
  });
}

function initializePrefHandlerForRelayList() {
  const newRelay = document.getElementById("new-relay-url");
  const addRelay = document.getElementById("add-new-relay");
  const relayList = document.getElementById("relay-list");
  const nipLogin = document.getElementById("nip-07-login");

  addRelay.onclick = async () => {
    /* Add relay to list*/
    addRelayToList(newRelay.value);
  };

  /*
  browser.storage.local.get("relayList").then((result) => {
    const { relayList = [] } = result;
    console.log(`Relay list: ${relayList}`);
    if (relayList.length < 1) {
      console.log(`Relay list empty. Loading default list.`)
      const tempRelayList = fetch("https://api.nostr.watch/v1/online");
      console.log(tempRelayList);
    }
    displayRelayList(relayList);
  })
  */
}

initializePrefHandlerForRelayList();







/*
function serializeRules(rules) {
  // The getDynamicRules and getSessionRules APIs returns the rules, including
  // optional keys. For readability, we strip all optional keys.
  // JSON.stringify will drop keys if the replacer function returns undefined.
  const replacer = (key, value) => value === null ? undefined : value;
  return JSON.stringify(rules, replacer, 2);
}

function initializePrefHandlerForDynamicDNR() {
  const textarea = document.getElementById("input-dynamic-rules");
  const statusOutput = document.getElementById("status-dynamic-rules");
  document.getElementById("save-dynamic-rules").onclick = async () => {

    try {
      let newRules = JSON.parse(textarea.value);
      let oldRules = await browser.declarativeNetRequest.getDynamicRules();
      await browser.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: oldRules.map(rule => rule.id),
        addRules: newRules,
      });
      statusOutput.value = `Saved ${newRules.length} rules`;
    } catch (e) {
      statusOutput.value = `Failed to save rules: ${e}`;
    }
  };

  browser.declarativeNetRequest.getDynamicRules().then(rules => {
    textarea.value = serializeRules(rules);
    console.log(serializeRules(rules));
  });
}

initializePrefHandlerForDynamicDNR();
*/