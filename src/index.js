const chalk = require('chalk');
const https = require('https');
const path = require('path');
const fs = require('fs');

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const aliases = require('./aliases.json');


let devMode = false;
let args = [];

if(process.argv[0] == 'gignore') {
  args = process.argv.splice(1);
} else {
  args = process.argv.splice(2);
}

if(args.length < 1) {
  console.log(chalk`{bold.red You have to provide 1 or 2 arguments!}`);
  process.exit(1);
}

let filename = '.gitignore';
let template = '';

template = args[0].toLowerCase();
if(Object.keys(aliases).includes(template)) {
  template = aliases[template];
}
template = capitalizeFirstLetter(template);
if(args.length == 2) {
  filename = args[1];
}

console.log(chalk`{bold.yellow Creating '${filename}' with template '${template}'...}`);
console.log(chalk`{bold.yellow Fetching from templates repo...}`);
let template_content = '';
let error = false;
https.get('https://raw.githubusercontent.com/github/gitignore/master/' + template + '.gitignore', (resp) => {
  let data = '';
  if(resp.statusCode == 404) {
    console.log(chalk`{bold.red Could not find gitignore template.}`);
    process.exit(1);
  }

  resp.on('data', (chunk) => {
    data += chunk;
  });

  resp.on('end', () => {
    console.log(chalk`{bold.yellow Writing '${filename}'...}`);
    fs.writeFileSync(filename, data, 'utf-8');
    console.log(chalk`{bold.green Done!}`);
  });
}).on("error", (err) => {
  error = true;
});
if(error) {
  console.log(chalk`{bold.red Could not fetch gitignore template.}`);
  process.exit(1);
}
