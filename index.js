#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const Files = require('./lib/Files');
const Github = require('./lib/Github');
const Repo = require('./lib/Repo');

clear();
console.log(
  chalk.yellow(
    figlet.textSync('Ginit', { horizontalLayout: 'full'})
  )
);


if(Files.directoryExists('.git')) {
  console.log(chalk.red('Already a git repository'));
  process.exit();
};

const getGithubToken = async () => {
  let token = Github.getStoredGithubToken();
  if(token) {
    return token;
  };

  await Github.setGithubCredentials();

  token = await github.registerNewToken();
  return token;
}


const run = async () => {

  try {
    const token = await getGithubToken();
    Github.githubAuth(token);

    const url = await Repo.createRemoteRepo();

    await Repo.createGitignore();

    const done = await Repo.setupRepo(url);

    if(done) {
      console.log(chalk.green('All done'));
    }

  }catch(err) {
    if(err) {
      switch(err.code) {
        case 401:
          console.log(chalk.red('Couldn\'t log you in. Please provide correct credentials/token.'))
          break;
        case 422:
          console.log(chalk.red('There already exists a remote repository with the same name'));
          break;
        default:
          console.log(err);
      }
    }
  }
}


run();
