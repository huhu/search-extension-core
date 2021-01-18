class QueryEvent {
    constructor({
                    prefix = undefined, regex = undefined,
                    defaultSearch = false, searchPriority = 0,
                }) {
        this.prefix = prefix;
        this.regex = regex;
        this.defaultSearch = defaultSearch;
        this.searchPriority = searchPriority;

        // The search keyword the user inputted for searching.
        this.searchedInput = "";
    }

    /**
     * The search function which should return a object array.
     */
    onSearch(query);

    /**
     * The format function which should return {content, description} object.
     */
    onFormat(index, item, query);

    onAppend(query);

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