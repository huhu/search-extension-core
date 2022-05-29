/**
 * A simple command to quick setup a list item of [name, url, description] data search.
 */
class SimpleCommand extends Command {
    constructor(name, description, index) {
        super(name, description);
        this.setIndex(index);
    }

    async onExecute(arg) {
        return this.index
            .filter(item => !arg || item[0].toLowerCase().indexOf(arg) > -1)
            .map(([name, url, description]) => {
                if (description) {
                    description = `${c.match(name)} - ${c.dim(c.escape(description))}`;
                } else {
                    description = `${c.match(name)} - ${c.dim(url)}`;
                }
                return {
                    content: url,
                    description,
                }
            });
    }

    setIndex(index) {
        this.index = index;
    }
}