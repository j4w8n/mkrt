# MKRT

Create SvelteKit routes, fast

SvelteKit uses folder-based routes. See the [routing docs](https://kit.svelte.dev/docs/routing) and [migration guide](https://github.com/sveltejs/kit/discussions/5774). Backstory is on the [repo discussion](https://github.com/sveltejs/kit/discussions/5748)

## Features

- config file, for project defaults
- runtime options
- typescript support
- starter code for created files

## Installation

`[p]npm add -g mkrt` or `yarn global add mkrt`

## Usage

You must be in your project's root directory, to use mkrt

`mkrt <path> <options>`

Directories will be created, if they don't exist. If any route files, that you've just asked mkrt to create, already exist in the directory then you'll be prompted to overwrite them or not.

By default, a typical page route will create three files => +page.svelte, +page.server.ts, +page.ts

By default, a typcial server route will create one file => +server.ts

### Configuration

After installing mkrt, you'll need a `mkrt.config.json` file in your project's root directory. If you don't create one, mkrt can create it for you when you first run mkrt.

```json
// example mkrt.config.json
{
  "codekit": "true",
  "language": "ts",
  "route": "page"
}
```

`codekit <[ true | false ]>` adds commonly-used code to your files

`language <[ ts | js ]>` file extension to use for relevant files

`route <[ page | server ]>` type of route to create


> Why 'codekit'?
>
> 'boilerplate' is a more understood term, but seems to give-off a negative vibe for devs these days
>
> Think of codekit like a first-aid kit, which has things you'd typically need for an everyday injury. A codekit's aim is to have code which most people are going to need, most of the time.

### Options

Some are overrides for your config, others are stand-alone.

- `-n, --named-layout <name>` adds `@<name>` to .svelte files (ex, +page@alternate.svelte)
- `-c, --codekit` adds sensible starter code to files
- `--no-codekit` don't add starter code to files
- `-t, --typescript` use .ts file extensions
- `-j, --javascript` use .js file extensions
- `-p, --page` route is a +page.svelte file
- `-s, --server` route is a +server.[ts|js] file

### Examples

`mkrt .` - Adds a page route to your project's routes directory (src/routes by default in SvelteKit)

`mkrt about` - creates a /about route

`mkrt api/auth -sj` - overrides the default config, if needed, and creates a server route with a .js file extension

`mkrt company -n corp` - creates a page route with a named layout; so the svelte file will be `+page@corp.svelte`
