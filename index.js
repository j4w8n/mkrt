#!/usr/bin/env node
import prompts from 'prompts'
import { Command, Option, Argument } from 'commander'
import fs from 'fs'
import path from 'path'
import { fileURLToPath, pathToFileURL } from 'url'
import { blue, green, red, yellow } from 'kleur/colors'
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
  .usage('<path> [options]')
  .argument('<path>', 'Directory path for route or layout. Use `.` for root.')
  .description('Create SvelteKit routes, fast')
  .version(packageJson.version)
  .option('-n, --named-layout <layout-name>', 'Layout to use for the route. Use `.` to reference the root layout.')
  .option('-p, --page', 'Is a +page.svelte file')
  .option('-l, --layout', 'Is a +layout.svelte file.')
  .addOption(new Option('-s, --server', 'Is a +server.[ts|js] file').conflicts('page').conflicts('layout').conflicts('namedLayout'))
  .addOption(new Option('--load', 'Creates a +page.[ts|js] file').conflicts('server'))
  .addOption(new Option('--sload', 'Creates a +page.server.[ts|js] file').conflicts('server'))
  .addOption(new Option('--all', 'Creates all three route files for page or layout routes').conflicts('load').conflicts('sload').conflicts('server'))
  .action(async (name, options) => {
    let files, language
    const root = route_source ?? 'src/routes'
    const dir_path = name === '.' ? root : path.join(root, name)
    const named_layout = options.namedLayout ? options.namedLayout === '.' ? '@' : `@${options.namedLayout}` : ''
    const cli_option = ['page','server','layout'].find((key) => options[key])
    const route = cli_option ?? config?.route ?? 'page'
    const codekit = config?.codekit ?? true
    const template_path = config?.templates ?? path.join(__dirname, 'templates')
    const load = options.load
    const sload = options.sload
    const all = options.all

    if (config?.templates) {
      if (typeof config?.templates !== 'string') {
        console.log(red(`Templates configuration is not valid. Expecting string, got ${typeof config.templates} Exiting...`))
        process.exit(1)
      }
    }
    if (config?.route) {
      if (config.route !== 'page' && config.route !== 'server') {
        console.log(red('Route configuration is not valid. Exiting...'))
        process.exit(1)
      }
    }
    if (config?.codekit) {
      if (config.codekit !== 'true' && config.codekit !== 'false') {
        console.log(red('Codekit configuration is not valid. Exiting...'))
        process.exit(1)
      }
    }

    try {
      language = fs.existsSync(path.join(process.cwd(), 'tsconfig.json')) ? 'ts' : 'js'
    } catch (error) {
      console.log(red(error))
    }

    if (codekit) {
      try {
        if (!fs.existsSync(template_path)) {
          console.log(red(`Cannot find ${template_path} directory. Exiting...`))
          process.exit(1)
        }
      } catch (error) {
        console.log(red(error))
      }
    }

    try {
      if (!fs.existsSync(root)) {
        console.log(red(`Cannot find ${root}. Exiting...`))
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
        if (all) {
          files.push(`+page.${language}`)
          files.push(`+page.server.${language}`)
        } else {
          if (load) files.push(`+page.${language}`)
          if (sload) files.push(`+page.server.${language}`)
        }
        break;
      case 'layout':
        files = [`+layout${named_layout}.svelte`]
        if (all) {
          files.push(`+layout.${language}`)
          files.push(`+layout.server.${language}`)
        } else {
          if (load) files.push(`+layout.${language}`)
          if (sload) files.push(`+layout.server.${language}`)
        }
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
        const ref_named_layout = files[i].split('@')
        if (ref_named_layout.length > 1) {
          // file references a named layout, adjusting template filename for copy
          const suffix = ref_named_layout[1].split('.')       
          template = `${ref_named_layout[0]}.${suffix.slice(1)}`
        }
        if (files[i].split('.')[1] === 'svelte') {
          // add .js or .ts to end of +page.svelte or +layout.svelte file, for template filename copy
          template = `${template}.${language}`
        }

        const src = path.join(template_path, template)
        const dst = path.join(dir_path, files[i])

        if (fs.existsSync(src)) {
          create_file(src, dst)
        } else {
          console.log(yellow(`Template file ${blue(src)} does not exist. Skipping...`))
        }
      }
    }
    console.log(green('Done!'))
  })

program.parse()