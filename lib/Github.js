const octokit = require('@octokit/rest')();
const Configstore = require('configstore');
const pkg         = require('../package.json');
const _           = require('lodash');
const CLI         = require('clui');
const Spinner     = CLI.Spinner;
const chalk       = require('chalk');

const Inquirer    = require('./Inquirer');

const conf = new Configstore('ginit');


class Github {
 static getInstance (){
    return octokit;
  };

  static getStoredGithubToken(){
    return conf.get('github.token');
  }

  static async etGithubCredentials() {
    const credentials = await Inquirer.askGithubCredentials();
    octokit.authenticate(
      _.extend(
        {
          type: 'basic',
        },
        credentials
      )
    )
  };

  static async registerNewToke () {
    const status = new Spinner('Authenticating you, please wait...');
    status.start();
    try {
      const response = await octokit.authorization.create({
        scopes: ['user', 'public_repo', 'repo', 'repo:status'],
        note: 'ginits, the command-line tool for initalizing Git repos'
      });

      const token = response.data.token;

      if(token) {
        conf.set('github.token', token);
        return token;
      }else {
        throw new Error('Missing Token', 'Github token was not found in the response');
      }
    }catch (err) {
      throw err;
    } finally {
      status.stop();
    }
  };
  
  static githubAuth(token){
    octokit.authenticate({
      type: 'oauth',
      token: token
    });
  };

  static getStoredGithubToken() {
    return conf.get('github.token');
  };
}


module.exports = Github ;