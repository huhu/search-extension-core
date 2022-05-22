// Mimic localStorage API with chrome.storage
const storage = {
    getAllItems: () => storageGet(null),
    getItem: async key => (await storageGet(key))[key],
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

function storageGet(key) {
    return new Promise(resolve => {
        chrome.storage.local.get(key, (result) => {
            resolve(result[key]);
        });
    });
}

// A helper function to migrate localStorage to chrome.storage API.
async function migrateLocalStorage(key) {
    let value = localStorage.getItem(key);
    if (value) {
        await storage.setItem(key, JSON.parse(value));
    }
}