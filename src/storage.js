// Mimic localStorage API with chrome.storage
const storage = {
    getAllItems: () => chrome.storage.local.get(null),
    getItem: async key => (await chrome.storage.local.get(key))[key],
    setItem: (key, val) => chrome.storage.local.set({
        [key]: val
    }),
    removeItems: keys => chrome.storage.local.remove(keys),
};