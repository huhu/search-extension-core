// Mimic localStorage API with chrome.storage.
// See also: https://developer.chrome.com/docs/extensions/reference/storage/
const storage = {
    getAllItems: () => new Promise(resolve => {
        chrome.storage.local.get(null, resolve);
    }),
    // Gets one or more items from storage.
    getItem: key => new Promise(resolve => {
        chrome.storage.local.get(key, (result) => {
            if (result) {
                resolve(result[key]);
            } else {
                resolve(null);
            }
        });
    }),
    // Set signle key-value pair item.
    setItem: (key, val) => new Promise(resolve => {
        chrome.storage.local.set({
            [key]: val
        }, resolve)
    }),
    // Removes one or more items from storage.
    removeItem: key => new Promise(resolve => {
        chrome.storage.local.remove(key, resolve);
    }),
};

// A helper function to migrate localStorage to chrome.storage API.
async function migrateLocalStorage(key) {
    let value = localStorage.getItem(key);
    if (value) {
        try {
            // Some plain text isn't JSON parsable.
            value = JSON.parse(value);
        } catch (e) {
            console.log(`can't parse ${value} as JSON: ${e}`);
        }
        await storage.setItem(key, value);
    }
}