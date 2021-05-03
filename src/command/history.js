class HistoryCommand extends Command {
    constructor() {
        super("history", "Show your local search history.", false);
    }

    onExecute(arg) {
        let history = JSON.parse(localStorage.getItem("history")) || [];
        return history
            .filter(item => !arg || item.query.toLowerCase().indexOf(arg) > -1)
            .sort((a, b) => b.time - a.time)
            .map(item => {
                return {
                    content: item.content,
                    description: `${item.query} - ${item.description}`
                }
            });
    }

    onBlankResult(arg) {
        return [{
            content: "no history",
            description: "No history right now, let's search something!"
        }];
    }

    /**
     * Record the search history and reture the history item.
     * @returns the historyItem.
     */
    static record(query, result) {
        if (!query || !result) return;

        let { content, description } = result;
        description = c.eliminateTags(description);
        let history = JSON.parse(localStorage.getItem("history")) || [];
        let historyItem = { query, content, description, time: Date.now() };
        history.push(historyItem);
        localStorage.setItem("history", JSON.stringify(history));
        return historyItem;
    }
}