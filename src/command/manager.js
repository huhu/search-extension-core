function CommandManager(...commands) {
    this.cmds = [];
    this.cmds.push(...commands);
}

CommandManager.prototype.execute = function (query) {
    query = query.replace(":", "").trim();
    let [name, arg] = query.split(" ");
    let command = this.cmds.find(cmd => cmd.name === name);
    if (command) {
        let result = command.onExecute(arg);
        if (!result || result.length < 1) {
            result = command.onBlankResult(arg);
        }
        return result;
    } else {
        let list = this.cmds
            .map(cmd => {
                return {
                    content: `:${cmd.name}`,
                    description: `${c.match(":" + cmd.name)} - ${c.dim(cmd.description)}`
                }
            });

        let result = list.filter((item) => name && item.content.indexOf(name) > -1);
        if (result.length > 0) {
            // Filter commands with prefix
            return [
                {content: "", description: `Found following commands, press Tab to select.`},
                ...result
            ];
        } else {
            return [
                {content: "", description: `Not command found ${c.match(":" + name)}, try following commands?`},
                ...list
            ];
        }
    }
};

CommandManager.prototype.handleCommandEnterEvent = function (content) {
    if (content) {
        content = content.replace(":", "").trim();
        let command = this.cmds.find(cmd => cmd.name === content);
        if (command) {
            command.onEnter(content);
        }
    }
}