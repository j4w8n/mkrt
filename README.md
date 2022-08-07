# MKRT

Create SvelteKit routes, fast

SvelteKit uses folder-based routes. See the [routing docs](https://kit.svelte.dev/docs/routing) and [migration guide](https://github.com/sveltejs/kit/discussions/5774). Backstory is on the [repo discussion](https://github.com/sveltejs/kit/discussions/5748)

## Features

- configuration file
- runtime options
- typescript support
- JSDoc support
- default & custom template routing files

## Installation

`[p]npm add -g mkrt` or `yarn global add mkrt`

### Configuration

You'll need a `mkrt.config.json` file in your project's root directory, to provide default options when creating new routes. If you don't create a file, mkrt will offer to do this for you.

`route` is the only required option in order to create routes; however, mkrt will set codekit to true if it creates the file.

`"codekit": "[ true | false ]"` adds commonly-used code to your files, whether it's from mkrt's default templates or your own.

`"route": [ page | server ]"` type of route to create

`"templates": "<path>"` absolute or relative path to your custom codekit template files. This option requires `"codekit": "true"`.

```json
// example mkrt.config.json
{
  "codekit": "true",
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

The following route files will be created:

- for page routes => +page.svelte, +page.server.ts, +page.ts. You may not need all of these files for each of your routes. We're working on an option to only create the files you want.

- for server routes => +server.ts

### CLI Options

#### Standalone

Create a page route, that references a named layout. Ex, +page@alternate.svelte
`-n, --named-layout <name>`

#### Overrides for default config

- `-p, --page` route is a +page.svelte file
- `-s, --server` route is a +server.[ts|js] file

### Examples

`mkrt .` - Adds a page route to your project's routes root (src/routes by default in SvelteKit).

`mkrt about` - creates a /about route

`mkrt api/auth -s` - creates an api/auth server route. This is assuming your default config is set for `page` routes, and you want to override it by creating a `server` route this time.

`mkrt company -n corp` - creates a page route with a named layout; so the svelte file will be `+page@corp.svelte`


## Custom Codekit Templates

If you like the idea of having some pre-populated code in your route files, but don't like mkrt's defaults, then you can use your own files for this. Create a folder anywhere on your computer, then configure `templates` in the mkrt.config.json file with the path to the folder. You can use absolute or relative paths.

Here are the available filenames that mkrt will recognize:

```
+page.js
+page.ts
+server.js
+server.ts
+page.server.js
+page.server.ts
+page.svelte.js
+page.svelte.ts
```

Note that the +page.svelte files have js or ts file extensions. This is because mkrt needs to be able to tell the difference of which file to use, depending on if you're using Typescript. When these svelte files get copied to your route folder, the .js or .ts will be removed.