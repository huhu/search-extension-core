const DISPOSITION_CURRENT_TAB = 'currentTab'; // enter (default)
const DISPOSITION_FOREGROUND_TAB = 'newForegroundTab'; // alt + enter
const DISPOSITION_BACKROUND_TAB = 'newBackgroundTab'; // meta + enter

class Render {
    constructor({ el, icon, placeholder }) {
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
        element.innerHTML = `<div class="omn-container">
            <textarea class="omn-input"
            autocapitalize="off" autocomplete="off" autocorrect="off" 
            maxlength="2048" role="combobox" rows="1" style="resize:none"
            spellcheck="false"></textarea></div>
        `;
        this.container = document.querySelector(".omn-container");
        this.inputBox = element.querySelector("textarea");
        if (placeholder) {
            this.inputBox.setAttribute("placeholder", placeholder);
        }
        this.icon = icon;
        this.onInputChanged = new OnInputChangedListener();
        this.onInputEntered = new OnInputEnteredListener();
        this.disposition = DISPOSITION_CURRENT_TAB;

        let suggestFn = this.suggest.bind(this);
        this.trigger = async (event) => {
            let inputValue = event.target.value;
            if (inputValue) {
                for (const listener of this.onInputChanged.listeners) {
                    await listener(inputValue, suggestFn);
                }
            } else {
                this.removeHint();
                this.clearDropdown();
            }
        };
        this.inputBox.oninput = this.trigger;
        this.inputBox.onfocus = this.trigger;
        this.inputBox.addEventListener("keydown", (event) => {
            if (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === "Enter") {
                // Prevent the default behavior of arrow up and arrow down keys
                event.preventDefault();
            }
        });
        document.addEventListener('click', (event) => {
            if (!event.composedPath().includes(element)) {
                // Click outside to clear dropdown
                this.resetSearchKeyword();
            }
        });
        document.addEventListener('keydown', async (event) => {
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
                        let newSelected = null;
                        if (selected.previousElementSibling) {
                            newSelected = selected.previousElementSibling;
                        } else {
                            // Already selected the fist item, but a arrow-up key pressed,
                            // select the last item.
                            newSelected = document.querySelector('.omn-dropdown-item:last-child');
                        }

                        if (newSelected) {
                            selected.classList.remove('omn-selected');
                            newSelected.classList.add('omn-selected')
                            this.inputBox.value = newSelected.getAttribute('data-value');
                        }
                    }
                    break;
                }
                case 'ArrowDown': {
                    let selected = document.querySelector('.omn-selected');
                    if (selected) {
                        let newSelected = null;
                        if (selected.nextElementSibling) {
                            newSelected = selected.nextElementSibling;
                        } else {
                            // Already selected the last item, but a arrow-up key pressed,
                            // select the fist item.
                            newSelected = document.querySelector('.omn-dropdown-item:first-child');
                        }

                        if (newSelected) {
                            selected.classList.remove('omn-selected');
                            newSelected.classList.add('omn-selected')
                            this.inputBox.value = newSelected.getAttribute('data-value');
                        }
                    }
                    break;
                }
                case 'Escape': {
                    this.resetSearchKeyword();
                    break;
                }
            }
        });
    }

    resetSearchKeyword() {
        // Reset the input box value to the search keyword
        let dropdown = document.querySelector('.omn-dropdown');
        if (dropdown) {
            let item = dropdown.querySelector(".omn-dropdown-item");
            if (item) {
                this.inputBox.value = item.getAttribute('data-value');
            }
        }

        this.clearDropdown();
    }

    clearDropdown() {
        this.container.classList.remove("omn-filled");

        let dropdown = document.querySelector('.omn-dropdown');
        if (dropdown) {
            dropdown.remove();
        }
    }

    setHint(hintText) {
        this.removeHint();
        let hintElement = document.createElement('div');
        hintElement.classList.add('omn-hint');
        hintElement.textContent = hintText;
        this.container.insertAdjacentHTML('afterbegin', `
        <div class="omn-hint">${hintText}<div class="omn-hint-gapline"></div></div>
        `);
    }

    removeHint() {
        let hint = document.querySelector('.omn-hint');
        if (hint) {
            hint.remove();
        }
    }

    suggest(suggestions) {
        this.clearDropdown();
        this.container.classList.add("omn-filled");

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
            if (index === 0) {
                // Always select the first item by default.
                li.classList.add('omn-selected');
                // Set the inputbox value as data-value, similar to chrome.omnibox API
                li.setAttribute("data-value", this.inputBox.value);
            } else {
                li.setAttribute("data-value", content);
            }
            li.innerHTML = `<div class="omn-dropdown-indicator"></div>
                            <a href="${content}">
                            ${this.icon ? `<img src=\"${this.icon}\"/>` : ""}
                            ${parseOmniboxDescription(description)}
                            </a>`;
            container.appendChild(li);
        }
        dropdown.appendChild(container);
        this.container.insertAdjacentElement('afterend', dropdown);
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

function parseOmniboxDescription(input) {
    return input.replaceAll("<match>", "<span class='omn-match'>")
        .replaceAll("</match>", "</span>")
        .replaceAll("<dim>", "<span class='omn-dim'>")
        .replaceAll("</dim>", "</span>");
}

export default Render;