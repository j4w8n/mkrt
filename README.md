# MKRT

Create SvelteKit routes, fast

SvelteKit uses folder-based routes. See the [routing docs](https://kit.svelte.dev/docs/routing) and [migration guide](https://github.com/sveltejs/kit/discussions/5774). Backstory is on the [repo discussion](https://github.com/sveltejs/kit/discussions/5748)

## Features

- configuration file
- runtime options
- typescript support
- default & custom template routing files

## Installation

`[p]npm add -g mkrt` or `yarn global add mkrt`

### Configuration

You'll need a `mkrt.config.json` file in your project's root directory, to provide default options when creating new routes. If you don't create a file, mkrt will offer to do this for you.

`language`, and `route` are the only required options in order to create routes; however, mkrt will set codekit to true if it creates the file.

`"codekit": "[ true | false ]"` adds commonly-used code to your files, whether it's from mkrt's default templates or your own.

`"language": "[ ts | js ]"` file extension to use for relevant route files

`"route": [ page | server ]"` type of route to create

`"templates": "<path>"` absolute or relative path to your custom codekit template files

```json
// example mkrt.config.json
{
  "codekit": "true",
  "language": "ts",
  "route": "page",
  "templates": "/path/to/custom/codekit/files"
}
```

> Why 'codekit'?
>
> 'boilerplate' is a more understood term, but seems to give-off a negative vibe for devs these days; so I thought I'd come up with something else.
>
> A codekit's goal is to provide code which most people are going to need, most of the time.

## Usage

When using mkrt, you'll want to be in your project's root directory.

`mkrt <path> [options]`

Directories will be created, if they don't exist. If any of the to-be-created route files already exist in the directory, then you'll be prompted whether you want to overwrite them or not.

With default mkrt.config.json options:

- a page route will create three files => +page.svelte, +page.server.ts, +page.ts. You may not need all of these files for each of your routes, but we create all three and let you decide which to delete.

- a server route will create one file => +server.ts

### CLI Options

Most are overrides for your default config. `--named-layout` is stand-alone, and the only way to tell mkrt that a page route uses a named layout.

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

`mkrt api/auth -sj` - creates an api/auth server route with a .js file extension; overriding the default config - assuming it's set for `page` and `ts` respectively

`mkrt company -n corp` - creates a page route with a named layout; so the svelte file will be `+page@corp.svelte`
