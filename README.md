# Search Extension Core

[![license-mit](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE-MIT)
[![license-apache](https://img.shields.io/badge/license-Apache-yellow.svg)](LICENSE-APACHE)

This is the core source code repository for search extensions, written in vanilla Javascript.

## Overview

A list of search extensions based on this project:

- [Rust Search Extension](https://github.com/huhu/rust-search-extension)
- [Go Search Extension](https://github.com/huhu/go-search-extension)
- [C/C++ Search Extension](https://github.com/huhu/cpp-search-extension)
- [Js Search Extension](https://github.com/huhu/js-search-extension)
- More (Java, etc)...

Everyone can build your own search extension with this project.

## API

### Omnibox

**constructor(defaultSuggestion, maxSuggestionSize)**

```js
let omnibox = new Omnibox(
    // The default suggestion title.
    defaultSuggestion="A handy search extension.",
    // Max suggestion size for per page.
    maxSuggestionSize=8,
);
```

**bootstrap(config)**

Bootstrap the omnibox.

```js
{
    // The default global search function
    onSearch: function(query){},
    onFormat: function(index, item){},
    onAppend: function(query){},
    onEmptyNavigate: function(content, disposition) {},
    beforeNavigate: function(content) {},
    afterNavigated: function(query, result) {},
}
```

**addPrefixQueryEvent(prefix, event)**

Add prefix query event.

**addRegexQueryEvent(regex, event)**

Add regex query event.

**addNoCacheQueries(...queries)**

Add query keyword to prevent cache result.

### QueryEvent

```js
{
    onSearch,
    onFormat = undefined,
    onAppend = undefined,
    prefix = undefined,
    regex = undefined,
    defaultSearch = false,
    searchPriority = 0
}
```

### Command

An interface representing a command, you should extend this class to build a custom command.

**constructor(name, description)**

- name: The command name, for example `help`.
- description: The command description, for example `Show the help messages`.

**onExecute(arg)**

A hook method the subclass should implement to execute the command with the `arg`.

**onBlankResult(arg)**

A hook method when the command result is empty.

**onEnter(content, disposition)**

A hook method called when press enter on command directly.

### CommandManager

**constructor([prefix, ]commands)**

Construct the `CommandManager` with default `commands`. The prefix for commands is configurable through `prefix`, which if not provided defaults to `:`.

**execute(query)**

Execute command according matched query.

**handleCommandEnterEvent(content, disposition)**

Handle command `enter` event.

## Builtin commands

- HistoryCommand - A command to record search histories.
- SimpleCommand - A simple command to quick setup a list item of [name, url, description] data search.
- OpenCommand - A command simply to quick open the specific url.

## License

Licensed under either of

 * Apache License, Version 2.0 ([LICENSE-APACHE](LICENSE-APACHE) or http://www.apache.org/licenses/LICENSE-2.0)
 * MIT license ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)

at your option.

## Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted
for inclusion in the work by you, as defined in the Apache-2.0 license, shall be
dual licensed as above, without any additional terms or conditions.