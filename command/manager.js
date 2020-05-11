function CommandManager(commands) {
    this.cmds = {};
    [new HistoryCommand(), ...commands].forEach(cmd => this.addCommand(cmd));
}

CommandManager.prototype.execute = function(query) {
    query = query.replace(":", "").trim();
    let [cmd, arg] = query.split(" ");
    if (cmd in this.cmds) {
        return this[cmd](arg);
    } else {
        let list = Object.entries(this.cmds)
            .map(([name, description]) => {
                return {
                    content: `:${name}`,
                    description: `${c.match(":" + name)} - ${c.dim(description)}`
                }
            });

        let result = list.filter((item) => cmd && item.content.indexOf(cmd) > -1);
        if (result.length > 0) {
            // Filter commands with prefix
            return [
                {content: "", description: `Found following commands, press Tab to select.`},
                ...result
            ];
        } else {
            return [
                {content: "", description: `Not command found ${c.match(":" + cmd)}, try following commands?`},
                ...list
            ];
        }
    }
};

CommandManager.prototype.addCommand = function(command) {
    if (command.name in this.cmds) {
        return false;
    }

    this.cmds[command.name] = command.description;
    Object.defineProperty(CommandManager.prototype, command.name, {
        value: (arg) => {
            let result = command.onExecute(arg);
            if (!result || result.length < 1) {
                result = command.onBlankResult(arg);
            }

            return result;
        }
    });
};