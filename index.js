#!/usr/bin/env node
const prompts = require('prompts')
const { Command, Option, Argument } = require('commander')
const fs = require('fs')
const path = require('path')
const packageJson = require('./package.json')
const config = require('./config.json')
const program = new Command()

program
  .command('config')
  .description('Set default configuration options')
  .addArgument(new Argument('<option>').choices(['codekit', 'language', 'route']))
  .argument('<value>')
  .action((option, value) => {
    config[option] = value
    fs.writeFileSync('./config.json', JSON.stringify(config), 'utf8')
    console.log('Configuration changed!', config)
    process.exit(1)
  })

program
  .name('mkrt')
  .usage('<directory-name>')
  .argument('<directory-name>', 'route to create')
  .description('Easily create SvelteKit route directories and files.')
  .version(packageJson.version)
  .option('-n, --named-layout <name>', 'use this named layout for the route')
  .option('-c, --codekit', 'add sensible starter code into files')
  .option('--no-codekit', 'do not use codekits in files')
  .option('-t, --typescript', 'use .ts files')
  .addOption(new Option('-j, --javascript', 'use .js files').conflicts('typescript'))
  .addOption(new Option('-p, --page', 'route is a +page.svelte file'))
  .addOption(new Option('-s, --server', 'route is a +server.[ts|js] file').conflicts('page'))
  .action(async (name, options) => {
    let files
    const dir = 'src/routes'
    const full_path = name === '.' ? dir : path.join(dir, name)
    const named_layout = options.namedLayout ? `@${options.namedLayout}` : ''
    const language = options.typescript ? 'ts' : options.javascript ? 'js' : config.language
    const route = options.server ? 'server' : options.page ? 'page' : config.route
    const codekit = options.codekit ?? config.codekit == "true"

    try {
      if (!fs.existsSync(dir)) {
        console.log(`Cannot find ${dir}. Are you in the correct directory?`)
        process.exit(1)
      }
    } catch (error) {
      console.log(error)
    }
    
    switch (route) {
      case 'server':
        files = [`+server.${language}`]
        break;
      case 'page':
        files = [`+page${named_layout}.svelte`, `+page.server.${language}`, `+page.${language}`]
        break;
    } 

    console.log('Checking path...')
    try {
      if (fs.existsSync(full_path)) {
        if (fs.readdirSync(full_path).length > 0) {
          const response = await prompts({
            type: 'confirm',
            name: 'value',
            message: 'Directory not empty. Continue?',
            initial: false
          })
    
          if (!response.value) {
            process.exit(1);
          }
        }
      } else {
        fs.mkdirSync(full_path, { recursive: true })
      }
    } catch (error) {
      console.log(error)
    }

    if (!codekit) {
      // create files with no content
      files.forEach(file => {
        try {
          fs.writeFileSync(`${full_path}/${file}`,'')
        } catch (error) {
          console.log(error)
        }
      })
    } else {
      files.forEach(dest => {
        let src = dest
        const parts = dest.split('@')
        if (parts.length > 1 ) {
          // filename has a named layout, adjusting src for filename copy
          const ext = parts[1].split('.')       
          src = `${parts[0]}.${ext.slice(1).join('.')}`
        }
        if ((dest.split('.')[1] === 'svelte') && (!dest.split('.')[2])) {
          // use .js or .ts +page.svelte file, for src filename copy
          src = `${src}.${language}`
        }

        try {
          fs.copyFileSync(path.join(__dirname, 'templates', src), path.join(full_path, dest))
        } catch (error) {
          console.log(error)
        }
      })
    }
    console.log('Route created!')
  })

program.parse()