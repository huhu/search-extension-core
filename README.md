# Search Extension Core

[![license-mit](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE-MIT)
[![license-apache](https://img.shields.io/badge/license-Apache-yellow.svg)](LICENSE-APACHE)

This is the core source code repository for search extensions, written in vanilla Javascript.

## Overview

A list of search extensions based on this project:

- [Rust Search Extension](https://github.com/huhu/rust-search-extension)
- [Go Search Extension](https://github.com/huhu/go-search-extension)
- [C/C++ Search Extension](https://github.com/huhu/cpp-search-extension)
- [Kubernetes Search Extension](https://github.com/huhu/k8s-search-extension)
- [Js Search Extension](https://github.com/huhu/js-search-extension)
- [Python Search Extension](https://github.com/huhu/python-search-extension)
- More (Java, etc)...

Everyone can build their search extension with this project. Here are some awesome search extensions from the community:

- [AWS Search Extension](https://github.com/pitkley/aws-search-extension)
- [R Search Extension](https://github.com/ShixiangWang/r-search-extension)

## API

> **Warning**
> 
> The Manifest V2 will be sunset near soon, we should [migrate to Manifest V3](https://developer.chrome.com/docs/extensions/mv3/intro/mv3-migration).
>
>The `manifest_v3.jsonnet` is the latest manifest file for V3.
>
> Another big concern is that V3 doesn't support `localStorage`, the alternative is `chrome.storage.local` or `chrome.storage.sync`.

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

- **config**: The configuration object to bootstrap the Omnibox.
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

- **config.onSearch**: A hook function to perform the default search.
- **config.onFormat**: A hook function to format the search result.
- **config.onAppend**: A hook function append the custom item to the result list.
- **config.beforeNavigate**: A hook function to before URL navigate. You have the last chance to modify the url before it navigated.
- **config.afterNavigate**: A hook function to after URL navigated. You have the chance to record the history here.
- **config.onEmptyNavigate**: If the content is a Non-URL which would navigate failed, then fallback to this hook function.

The `onSearch`, `beforeNavigate`, `afterNavigated`, and `onEmptyNavigate` in `Omnibox::boostrap(config)` can be `async` function.

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
    // Whether enable the query as a default search.
    // Default search means user can perform search without any sigils.
    defaultSearch = false,
    // The hook method to enable default search dynamically.
    // This hook method is preferred over defaultSearch property.
    isDefaultSearch = undefined,
    // The default search priority. The smaller, the higher.
    searchPriority = 0
}
```

The `onSearch` can be `async` function.

### Command

An interface representing a command, you should extend this class to build a custom command.

**constructor(name, description)**

- **name**: The command name, for example `help`.
- **description**: The command description, for example `Show the help messages`.

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

- **HistoryCommand** - A command to record search histories.
- **SimpleCommand** - A simple command to quick setup a list item of [name, url, description] data search.
- **OpenCommand** - A command simply to quick open the specific url.

## License

Licensed under either of

 * Apache License, Version 2.0 ([LICENSE-APACHE](LICENSE-APACHE) or http://www.apache.org/licenses/LICENSE-2.0)
 * MIT license ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)

at your option.

## Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted
for inclusion in the work by you, as defined in the Apache-2.0 license, shall be
dual licensed as above, without any additional terms or conditions.
