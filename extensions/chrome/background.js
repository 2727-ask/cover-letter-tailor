chrome.runtime.onInstalled.addListener(() => {
    // Create a context menu item for text selection
    chrome.contextMenus.create({
        id: "setCompany",
        title: "Company Name",
        contexts: ["selection"]
    });

    chrome.contextMenus.create({
        id: "setJobTitle",
        title: "Job Title",
        contexts: ["selection"]
    });

    chrome.contextMenus.create({
        id: "setJobDescription",
        title: "Job Description",
        contexts: ["selection"]
    });
});

// Handle the menu item click
chrome.contextMenus.onClicked.addListener((info, tab) => {

    if (info.menuItemId === "setJobTitle" && info.selectionText) {
        // Inject a script to handle the selected text
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: setJobTitle,
            args: [info.selectionText]
        });
    }

    if (info.menuItemId === "setJobDescription" && info.selectionText) {
        // Inject a script to handle the selected text
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: setJobDescription,
            args: [info.selectionText]
        });
    }

    if (info.menuItemId === "setCompany" && info.selectionText) {
        // Inject a script to handle the selected text
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: setCompany,
            args: [info.selectionText]
        });
    }
});

// The function to be executed in the page context
function setJobTitle(selectedText) {
    console.log("Job Title set to:", selectedText);
    chrome.storage.local.set({ jobTitle: selectedText });
}

function setJobDescription(selectedText) {
    console.log("Job Description set to:", selectedText);
    chrome.storage.local.set({ jobDescription: selectedText });
}

function setCompany(selectedText) {
    console.log("Company Name set to:", selectedText);
    chrome.storage.local.set({ companyName: selectedText });
}
