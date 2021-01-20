class QueryEvent {
    constructor({
                    onSearch, onFormat = undefined, onAppend = undefined,
                    prefix = undefined, regex = undefined,
                    defaultSearch = false, searchPriority = 0,
                }) {
        // The search function which should return a object array.
        this.onSearch = onSearch;
        // The format function which should return {content, description} object.
        this.onFormat = onFormat;
        this.onAppend = onAppend;
        this.prefix = prefix;
        this.regex = regex;
        this.defaultSearch = defaultSearch;
        this.searchPriority = searchPriority;

        // The search keyword the user inputted for searching.
        this.searchedInput = "";
    }

    performSearch(input) {
        this.searchedInput = input;
        let result = this.onSearch(input);
        return result.map(item => {
            // FIXME: item could be a non-object type, maybe we need Typescript to fix this...
            item['event'] = this;
            return item;
        });
    }

    // Format the result item.
    format(item, index) {
        if (this.onFormat) {
            item = this.onFormat(index, item, this.searchedInput);
        }
        return item;
    }
}