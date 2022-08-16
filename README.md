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

`"codekit": "[ true | false ]"` adds commonly-used code to your files, whether it's from mkrt's default templates or your own. Default is `true`.

`"route": [ page | server ]"` type of route to create. Default is `page`. If 'page', then only the +page.svelte file is created.

`"templates": "<path>"` absolute or relative path to your custom codekit template files. This option requires `"codekit": "true"` - which is the default, so there's no need to explicitly configure codekit to be true.

> Why 'codekit'?
>
> 'boilerplate' is a more understood term, but seems to give-off a negative vibe for devs these days; so I thought I'd come up with something else.
>
> A codekit's goal is to provide code which most people are going to need, most of the time.

## Usage

When using mkrt, you'll want to be in your project's root directory.

`mkrt <path> [options]`

Directories will be created, if they don't exist. If any of the to-be-created route files already exist in the directory, then you'll be prompted whether you want to overwrite them or not.

The following route files will be created by default. Use cli options to have additional page route and layout files created.

- page routes => +page.svelte
- layout routes => +layout.svelte
- server routes => +server.ts

### CLI Options

#### Standalone

- `-n, --named-layout <name>` Create a page route, or layout, that references a named layout. Ex, +page@alternate.svelte or +layout@default.svelte
- `--load` Create a +[page|layout].[ts|js] file with the route.
- `--sload` Create a +[page|layout].server.[ts|js] file with the route.
- `--all` Convenience method for using `--load` and `--sload` at the same time.

Options `--load`, `--sload`, `--all` have no effect if a server route is being created.

> For more information about using -n with layout files, checkout [Named Layouts](https://kit.svelte.dev/docs/layouts#named-layouts) in the docs.

#### Overrides for default config

- `-p, --page` route is a +page.svelte file
- `-s, --server` route is a +server.[ts|js] file
- `-l, --layout [name]` Create a +layout.svelte file, with optional name parameter to create a named layout

### Examples

`mkrt .` - Adds a page route to your project's routes root (src/routes by default in SvelteKit).

`mkrt about` - creates an /about page route, unless you've specified otherwise in your config.

`mkrt about --load` - creates an /about page route, with a `+page.[ts|js]` file.

`mkrt about -l --sload` - creates a layout in /about, with a `+layout.server.[ts|js]` file.

`mkrt about -l hello` - creates a named layout in /about.

`mkrt api/auth -s` - creates an api/auth server route. This is assuming your default config is set for `page` routes, and you want to override it by creating a `server` route this time.

`mkrt company -n corp` - creates a page route with a named layout; so the svelte file will be `+page@corp.svelte`.


## Custom Codekit Templates

If you like the idea of having some pre-populated code in your route files, but don't like mkrt's defaults, then you can use your own files for this. Create a folder anywhere on your computer, then configure `templates` in the mkrt.config.json file with the path to the folder. You can use absolute or relative paths.

Here are the available filenames that mkrt will recognize:

```
+page.js
+page.ts
+server.js
+server.ts
+layout.js
+layout.ts
+page.server.js
+page.server.ts
+layout.server.js
+layout.server.ts
+page.svelte.js
+page.svelte.ts
+layout.svelte.js
+layout.svelte.ts
```

> Note that the +page.svelte and +layout.svelte files have js or ts file extensions. This is because mkrt needs to be able to tell the difference of which file to use, depending on if you're using Typescript. When these svelte files get copied to your route folder, the .js or .ts will be removed.