const DISPOSITION_CURRENT_TAB = 'currentTab'; // enter (default)
const DISPOSITION_FOREGROUND_TAB = 'newForegroundTab'; // alt + enter
const DISPOSITION_BACKROUND_TAB = 'newBackgroundTab'; // meta + enter

class Render {
    constructor({ el, icon }) {
        let element = document.querySelector(el);
        if (!element) {
            throw new Error(`not element found: ${el}`);
        }

        if (element.tagName !== "DIV") {
            throw new Error("The `el` can only be `div` tag");
        }

        if (element.childNodes.length > 0) {
            throw new Error("The `el` element should have no child nodes");
        }
        element.style.position = "relative";
        element.innerHTML = `<textarea class="omn-input"
            autocapitalize="off" autocomplete="off" autocorrect="off" 
            maxlength="2048" role="combobox" rows="1" style="resize:none"
            spellcheck="false"></textarea>
        `;
        this.inputBox = element.querySelector("textarea");
        this.icon = icon;
        this.onInputChanged = new OnInputChangedListener();
        this.onInputEntered = new OnInputEnteredListener();
        this.disposition = DISPOSITION_CURRENT_TAB;

        let suggestFn = this.suggest.bind(this);
        this.inputBox.addEventListener("input", async (event) => {
            this.clearDropdown();
            this.inputBox.classList.add("omn-filled");

            let inputValue = event.target.value;
            console.log(inputValue);
            if (inputValue) {
                for (const listener of this.onInputChanged.listeners) {
                    await listener(inputValue, suggestFn);
                }
            } else {
                this.inputBox.classList.remove("omn-filled");
            }
        });
        this.inputBox.addEventListener("keydown", (event) => {
            if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === "Enter") {
                // Prevent the default behavior of arrow up and arrow down keys
                event.preventDefault();
            }
        });

        document.addEventListener('keyup', async (event) => {
            console.log('keyup:', event);
            switch (event.code) {
                case 'Enter': {
                    let selected = document.querySelector('.omn-selected');
                    if (selected) {
                        if (event.metaKey) {
                            this.disposition = DISPOSITION_BACKROUND_TAB;
                        } else if (event.altKey) {
                            this.disposition = DISPOSITION_FOREGROUND_TAB;
                        } else {
                            this.disposition = DISPOSITION_CURRENT_TAB;
                        }

                        let content = selected.getAttribute('data-content');
                        for (const listener of this.onInputEntered.listeners) {
                            await listener(content, this.disposition);
                        }
                    }
                    break;
                }
                case 'ArrowUp': {
                    let selected = document.querySelector('.omn-selected');
                    if (selected) {
                        if (selected.previousElementSibling) {
                            selected.previousElementSibling.classList.add('omn-selected');
                        } else {
                            // Already selected the fist item, but a arrow-up key pressed,
                            // select the last item.
                            let lastChild = document.querySelector('.omn-dropdown-item:last-child');
                            if (lastChild) {
                                lastChild.classList.add('omn-selected');
                            }
                        }

                        selected.classList.remove('omn-selected');
                    }
                    break;
                }
                case 'ArrowDown': {
                    let selected = document.querySelector('.omn-selected');
                    if (selected) {
                        if (selected.nextElementSibling) {
                            selected.nextElementSibling.classList.add('omn-selected');
                        } else {
                            // Already selected the last item, but a arrow-up key pressed,
                            // select the fist item.
                            let firstChild = document.querySelector('.omn-dropdown-item:first-child');
                            if (firstChild) {
                                firstChild.classList.add('omn-selected');
                            }
                        }
                        selected.classList.remove('omn-selected');
                    }
                    break;
                }
                case 'Escape': {
                    this.clearDropdown();
                    this.inputBox.classList.remove("omn-filled");
                    break;
                }
            }
        });
    }

    clearDropdown() {
        let dropdown = document.querySelector('.omn-dropdown');
        if (dropdown) {
            dropdown.remove();
        }
    }

    suggest(suggestions) {
        let dropdown = document.createElement('div');
        dropdown.classList.add('omn-dropdown');

        let gapline = document.createElement("div");
        gapline.classList.add("omn-gapline");
        dropdown.appendChild(gapline);

        let container = document.createElement("div");
        for (let [index, { content, description }] of suggestions.entries()) {
            let li = document.createElement("div");
            li.classList.add("omn-dropdown-item");
            li.style.position = "relative";
            li.setAttribute("data-content", content);
            li.innerHTML = `<div class="omn-dropdown-indicator"></div>
                            <div>
                            <a href="${content}">
                            ${this.icon ? `<img src=\"${this.icon}\"/>` : ""}
                            ${parseOmniboxDescription(description)}
                            </a></div>`;
            if (index === 0) {
                // Always select the first item by default.
                li.classList.add('omn-selected');
            }
            container.appendChild(li);
        }
        dropdown.appendChild(container);
        this.inputBox.insertAdjacentElement('afterend', dropdown);
    }
}

class OnInputChangedListener {
    constructor() {
        this.listeners = [];
    }

    addListener(listener) {
        if (listener) {
            this.listeners.push(listener);
        }
    }
}

class OnInputEnteredListener {
    constructor() {
        this.listeners = [];
    }

    addListener(listener) {
        if (listener) {
            this.listeners.push(listener);
        }
    }
}

// Remove invalid characters from text.
function sanitizeString(text, shouldTrim) {
    // NOTE: This logic mirrors |AutocompleteMatch::SanitizeString()|.
    // 0x2028 = line separator; 0x2029 = paragraph separator.
    let removeChars = /(\r|\n|\t|\u2028|\u2029)/gm;
    if (shouldTrim)
        text = text.trimLeft();
    return text.replace(removeChars, '');
}

function parseOmniboxDescription(input) {
    let domParser = new DOMParser();

    // The XML parser requires a single top-level element, but we want to
    // support things like 'hello, <match>world</match>!'. So we wrap the
    // provided text in generated root level element.
    let root = domParser.parseFromString(
        '<fragment>' + input + '</fragment>', 'text/xml');

    // DOMParser has a terrible error reporting facility. Errors come out nested
    // inside the returned document.
    let error = root.querySelector('parsererror div');
    if (error) {
        throw new Error(error.textContent);
    }

    // Otherwise, it's valid, so build up the description result.
    let description = '';

    // Recursively walk the tree.
    function walk(node) {
        for (let i = 0, child; child = node.childNodes[i]; i++) {
            // Append text nodes to our description.
            if (child.nodeType === Node.TEXT_NODE) {
                let shouldTrim = description.length === 0;
                description += sanitizeString(child.nodeValue, shouldTrim);
                continue;
            }

            // Process and descend into a subset of recognized tags.
            if (child.nodeType === Node.ELEMENT_NODE &&
                (child.nodeName === 'dim' || child.nodeName === 'match' ||
                    child.nodeName === 'url')) {
                description += `<span class="omn-${child.nodeName}">`;
                walk(child);
                description += "</span>";
                continue;
            }

            // Descend into all other nodes, even if they are unrecognized, for
            // forward compat.
            walk(child);
        }
    };
    walk(root);

    return description;
}

export default Render;