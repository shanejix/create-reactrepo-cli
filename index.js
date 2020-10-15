#!/usr/bin/env node

const fs = require('fs')
const program = require('commander')
const chalk = require('chalk')
const downloadGitRepo = require('download-git-repo')
const inquirer = require('inquirer')
const ora = require('ora')
const logSymbols = require('log-symbols')
const handlebars = require('handlebars')

program
  .version(require('./package').version, '-v, --version')
  .command('init <name>')
  .action((name) => {
    if (!fs.existsSync(name)) {
      inquirer.prompt([
        {
          name: 'description',
          message: 'please enter a description:',
        },
        {
          name: 'author',
          message: 'please enter a author:',
        }
      ]).then((answers) => {
        console.log(answers)
        // start to download
        const spinner = ora('downloading template...')
        spinner.start()
        const downloadPath = `direct:https://github.com/shanejixx/react-repos-template.git`

        downloadGitRepo(
          downloadPath,
          name,
          { clone: true },
          (err) => {
            if (err) {
              spinner.fail()
              console.error(
                logSymbols.error,
                chalk.red(`${err} download template fail,please check your network connection and try again`)
              )
              process.exit(1)
            }
            spinner.succeed()
            const meta = {
              name,
              description: answers.description,
              author: answers.author,
            }
            const fileName = `${name}/package.json`
            const content = fs.readFileSync(fileName).toString()
            const result = handlebars.compile(content)(meta)
            fs.writeFileSync(fileName, result)
          })
      })
    } else {
      // repo is exist
      console.error(symbols.error, chalk.red('project had exist'))
    }
  }).on('--help', () => {
    console.log('Examples:')
    console.log('$ w init index')
    console.log()
  })

program.parse(process.argv)