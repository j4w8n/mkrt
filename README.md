# MKRT

Create SvelteKit routes, fast

See the [routing docs](https://kit.svelte.dev/docs/routing) and [migration guide](https://github.com/sveltejs/kit/discussions/5774). Backstory is on the [repo discussion](https://github.com/sveltejs/kit/discussions/5748)

## Features

- configuration file
- runtime options
- typescript support
- JSDoc support
- default & custom template routing files

## Installation

`npm install -g mrkt`, `pnpm add -g mkrt` or `yarn global add mkrt`

### Configuration File

An optional `mkrt.config.json` config file can be created, to set your project's defaults. Place this file in the root of your project folder. Defaults can be overridden with [CLI Options](#cli-options)

`"codekit": "[ true | false ]"` adds commonly-used code to your files, whether it's from mkrt's default templates or your own. Default is `true`.

`"route": [ page | server ]"` type of route to create. Default is `page`.

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

> Use `.` to create a route in your project's root route directory ('src/routes' by default in SvelteKit)

Depending on which type of route you create, these files are created by default.

- page routes => +page.svelte
- layout routes => +layout.svelte
- server routes => +server.ts

If you choose to use mkrt for creating (group) directories, you'll need to escape the parenthesis. `mkrt \(app\) -l`

### CLI Options

#### Standalone

- `-n, --named-layout <name>` Create a page route or layout, that references another layout in the heirarchy. This can be used for regular layouts or (group) layouts. Use `.` to reference the root layout.
- `--load` Create a +[page|layout].[ts|js] file with the route.
- `--sload` Create a +[page|layout].server.[ts|js] file with the route.
- `--all` Convenience method for using `--load` and `--sload` at the same time.

Options `--load`, `--sload`, `--all` have no effect if a server route is being created.

> For more information about using -n to reference layouts, checkout [Advanced Layouts](https://kit.svelte.dev/docs/advanced-routing#advanced-layouts) in the docs.

#### Overrides for defaults and config file

- `-p, --page` route is a +page.svelte file
- `-s, --server` route is a +server.ts file
- `-l, --layout` Create a +layout.svelte file, either for a route or a (group) layout

### Examples

All examples assume the default configuration.

`mkrt .` - creates `+page.svelte` in your project's routes root (src/routes by default in SvelteKit).

`mkrt about` - creates `about/+page.svelte`

`mkrt about --load` - creates `about/+page.svelte` and `about/+page.ts`

`mkrt about -l --sload` - creates `about/+layout.svelte` and `about/+layout.server.ts`

`mkrt api/auth -s` - creates `api/auth/+server.ts`

`mkrt \(app\) -l` - creates `(app)/+layout.svelte`

`mkrt company -n \(app\)` - creates `company/+page@(app).svelte`

`mkrt company -n .` - creates `company/+page@.svelte`


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