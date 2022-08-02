# MKRT

Create SvelteKit routes, fast

SvelteKit uses folder-based routes. See the [routing docs](https://kit.svelte.dev/docs/routing) and [migration guide](https://github.com/sveltejs/kit/discussions/5774). Backstory is on the [repo discussion](https://github.com/sveltejs/kit/discussions/5748)

## Features

- config file, for global defaults
- runtime options
- typescript support
- starter code for created files

## Installation

`[p]npm add -g mkrt` or `yarn global add mkrt`

## Usage

You must be in your project's root directory, to use mkrt

`mkrt <directory-path> <options>`

Directories will be created, if they don't exist.
If a directory does exist and isn't empty, you'll be prompted to continue.

### Commands

`mkrt config <option> <value>` set default configuration options

Arguments for `config`. Defaults are listed first.

- `codekit <[ true | false ]>` adds commonly-used code to your files
- `language <[ ts | js ]>` file extension to use
- `route <[ page | server ]>` type of route to create

> Why 'codekit'?
>
> 'boilerplate' is a more understood term, but seems to give-off a negative vibe for devs these days
>
> Think of codekit like a first-aid kit, which has things you'd typically need for an everyday injury. A codekit's aim is to have code which most people are going to need, most of the time.

### Options

Some are overrides for the default config, others are stand-alone.

`-n, --named-layout <name>` adds `@<name>` to .svelte files (ex, +page@alternate.svelte)
`-c, --codekit` adds sensible starter code to files
`--no-codekit` don't add starter code to files
`-t, --typescript` use .ts file extensions
`-j, --javascript` use .js file extensions
`-p, --page` route is a +page.svelte file
`-s, --server` route is a +server.[ts|js] file

### Examples

`mkrt about`

`mkrt api/auth -sj`

`mkrt company -n corp`

`mkrt config language js`
