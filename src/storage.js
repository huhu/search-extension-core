// Mimic localStorage API with chrome.storage
const storage = {
    getAllItems: () => new Promise(resolve => {
        chrome.storage.local.get(null, (result) => {
            resolve(result);
        });
    }),
    getItem: key => new Promise(resolve => {
        chrome.storage.local.get(key, (result) => {
            if (result) {
                resolve(result[key]);
            } else {
                resolve(null);
            }
        });
    }),
    setItem: (key, val) => new Promise(resolve => {
        chrome.storage.local.set({
            [key]: val
        }, resolve)
    }),
    removeItems: keys => new Promise(resolve => {
        chrome.storage.local.remove(keys);
        resolve()
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