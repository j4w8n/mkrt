#!/usr/bin/env node
import prompts from 'prompts'
import { Command, Option, Argument } from 'commander'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { blue, green, red } from 'kleur/colors'
import packageJson from './package.json' assert { type: "json" }
import config from './config.json' assert { type: "json" }

const program = new Command()
const __dirname = path.dirname(fileURLToPath(import.meta.url))

program
  .command('config')
  .description('Set default configuration options')
  .addArgument(new Argument('<option>').choices(['codekit', 'language', 'route']))
  .argument('<value>')
  .action((option, value) => {
    config[option] = value
    fs.writeFileSync('./config.json', JSON.stringify(config), 'utf8')
    console.log(blue('Configuration changed!'), config)
    process.exit(1)
  })

program
  .name('mkrt')
  .usage('<path>')
  .argument('<path>', 'route to create')
  .description('Create SvelteKit routes, fast')
  .version(packageJson.version)
  .option('-n, --named-layout <layout-name>', 'use this named layout for the route')
  .option('-c, --codekit', 'add sensible starter code into files')
  .option('--no-codekit', 'do not use codekits in files')
  .option('-t, --typescript', 'use .ts files')
  .addOption(new Option('-j, --javascript', 'use .js files').conflicts('typescript'))
  .addOption(new Option('-p, --page', 'route is a +page.svelte file'))
  .addOption(new Option('-s, --server', 'route is a +server.[ts|js] file').conflicts('page').conflicts('namedLayout'))
  .action(async (name, options) => {
    let files
    const root = 'src/routes'
    const dir_path = name === '.' ? root : path.join(root, name)
    const named_layout = options.namedLayout ? `@${options.namedLayout}` : ''
    const language = options.typescript ? 'ts' : options.javascript ? 'js' : config.language
    const route = options.server ? 'server' : options.page ? 'page' : config.route
    const codekit = options.codekit ?? config.codekit == "true"

    const create_file = (src, dest) => {
      try {
        fs.copyFileSync(src, dest)
      } catch (error) {
        console.log(red(error))
      }
    }

    try {
      if (!fs.existsSync(root)) {
        console.log(blue(`Cannot find ${root}. Are you in your project's root directory?`))
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
        files = [`+page${named_layout}.svelte`, `+page.server.${language}`, `+page.${language}`]
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

    fs.mkdirSync(dir_path, { recursive: true })

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

        const src = path.join(__dirname, 'templates', template)
        const dst = path.join(dir_path, files[i])

        create_file(src, dst)
      }
    }
    console.log(green('Done!'))
  })

program.parse()