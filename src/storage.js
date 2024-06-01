let storage = null;

if (chrome && chrome.storage) {
    // Mimic localStorage API with chrome.storage.
    // See also: https://developer.chrome.com/docs/extensions/reference/storage/
    storage = {
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
} else {
    storage = {
        getAllItems: () => new Promise(resolve => {
            // chrome.storage.local.get(null, resolve);
        }),
        // Gets one or more items from storage.
        getItem: key => new Promise(resolve => {
            let val = localStorage.getItem(key);
            if (val) {
                try {
                    val = JSON.parse(val);
                } catch (e) {
                    // Ignore.
                }
            }
            resolve(val);
        }),
        // Set signle key-value pair item.
        setItem: (key, val) => new Promise(resolve => {
            if (val instanceof Object) {
                val = JSON.stringify(val);
            }
            localStorage.setItem(key, val);
            resolve();
        }),
        // Removes one or more items from storage.
        removeItem: key => new Promise(resolve => {
            // chrome.storage.local.remove(key, resolve);
            localStorage.removeItem(key);
            resolve();
        }),
    };
}

export default storage;