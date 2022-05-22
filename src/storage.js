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
        await storage.setItem(key, JSON.parse(value));
    }
}