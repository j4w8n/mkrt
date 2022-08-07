#!/usr/bin/env node
import prompts from 'prompts'
import { Command, Option, Argument } from 'commander'
import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { blue, green, red } from 'kleur/colors'
import packageJson from './package.json' assert { type: "json" }

const create_file = (src, dest) => {
  try {
    fs.copyFileSync(src, dest)
  } catch (error) {
    console.log(red(error))
  }
}

const program = new Command()
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const config_file = path.join(process.cwd(), 'mkrt.config.json')
const svelte_config_file = path.join(process.cwd(), 'svelte.config.js')
const { default: sk_config } = await import(`${pathToFileURL(svelte_config_file).href}`)
const route_source = sk_config.kit.files?.routes || null

if (fs.existsSync(config_file)) {
  fs.stat(config_file, (err, stats) => {
    if (stats.size === 0) {
      console.log(red('Config file is empty.'))
      process.exit(1)
    }
  })
  
  var { default: config } = await import(`${pathToFileURL(config_file).href}`, {
    assert: { type: "json" }
  })
  
  if (Object.entries(config).length === 0) {
    console.log(red('Config file is empty.'))
    process.exit(1)
  }
}

program
  .name('mkrt')
  .usage('<path>')
  .argument('<path>', 'route to create')
  .description('Create SvelteKit routes, fast')
  .version(packageJson.version)
  .option('-n, --named-layout <layout-name>', 'use this named layout for the route')
  .addOption(new Option('-p, --page', 'route is a +page.svelte file'))
  .addOption(new Option('-s, --server', 'route is a +server.[ts|js] file').conflicts('page').conflicts('namedLayout'))
  .addOption(new Option('--load', 'creates a +page.[ts|js] file').conflicts('server'))
  .addOption(new Option('--data', 'creates a +page.server.[ts|js] file').conflicts('server'))
  .action(async (name, options) => {
    let files, language

    const root = route_source ?? 'src/routes'
    const dir_path = name === '.' ? root : path.join(root, name)
    const named_layout = options.namedLayout ? `@${options.namedLayout}` : ''
    const route = options.page ? 'page' : options.server ? 'server' : config?.route ?? 'page'
    const codekit = config?.codekit ?? true
    const template_path = config?.templates ?? path.join(__dirname, 'templates')
    const load = options.load
    const data = options.data

    try {
      language = fs.existsSync(path.join(process.cwd(), 'tsconfig.json')) ? 'ts' : 'js'
    } catch (error) {
      console.log(red(error))
    }

    if (codekit) {
      try {
        if (!fs.existsSync(template_path)) {
          console.log(blue(`Cannot find ${template_path}. Exiting...`))
          process.exit(1)
        }
      } catch (error) {
        console.log(red(error))
      }
    }

    if (route !== 'page' && route !== 'server') {
      console.log(red('Route configuration is not valid. Exiting...'))
      process.exit(1)
    }

    try {
      if (!fs.existsSync(root)) {
        console.log(blue(`Cannot find ${root}. Exiting...`))
        process.exit(1)
      }
    } catch (error) {
      console.log(red(error))
    }
    
    switch (route) {
      case 'server':
        files = [`+server.${language}`]
        break;
      case 'page':
        files = [`+page${named_layout}.svelte`]
        if (load) files.push(`+page.${language}`)
        if (data) files.push(`+page.server.${language}`)
        break;
    } 

    const any_exist = files.some(file => fs.existsSync(path.join(dir_path, file)))
    if (any_exist) {
      let response = await prompts({
        type: 'confirm',
        name: 'value',
        message: `One or more route files exist in ${dir_path}! Overwrite?`,
        initial: false
      })

      if (!response.value) {
        process.exit(1);
      }
    }

    try {
      fs.mkdirSync(dir_path, { recursive: true })
    } catch (error) {
      console.log(red(error))
    }

    if (!codekit) {
      // create files with no content
      files.forEach(file => {
        try {
          fs.writeFileSync(path.join(dir_path, file),'')
        } catch (error) {
          console.log(red(error))
        }
      })
    } else {
      console.log(blue(`Creating route ${dir_path}...`))
      for (let i = 0; i < files.length; i++) {
        let template = files[i]
        const parts = files[i].split('@')
        if (parts.length > 1 ) {
          // file has a named layout, adjusting template filename for copy
          const suffix = parts[1].split('.')       
          template = `${parts[0]}.${suffix.slice(1).join('.')}`
        }
        if (files[i].split('.')[1] === 'svelte') {
          // add .js or .ts to end of +page.svelte file, for template filename copy
          template = `${template}.${language}`
        }

        const src = path.join(template_path, template)
        const dst = path.join(dir_path, files[i])

        create_file(src, dst)
      }
    }
    console.log(green('Done!'))
  })

program.parse()