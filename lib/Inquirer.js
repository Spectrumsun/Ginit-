const inquirer = require('inquirer');
const argv = require('minimist')(process.argv.slice(2));

const Files = require('./Files');


class Inquirer {
  static askGithubCredentials() {
  const questions = [
    {
      name: 'username',
      type: 'input',
      message: 'Enter your Github username or e-mail address:',
      validate: function(value) {
        if (value.length) {
          return true;
        } else {
          return 'Please enter your username or e-mail address';
        }
      }
    },
    {
      name: 'password',
      type: 'password',
      message: 'Enter your password',
      validate: function(value) {
        if (value.length) {
          return true;
        }else {
          return 'Please enter your password';
        }
      }
    }
  ];
  return inquirer.prompt(questions);
  };

  static askRepoDetails () {
    const questions = [
      {
        type: 'input',
        name: 'name',
        message: 'Enter a name for the repository:',
        default: argv._[0] || Files.getCurrentDirectoryBase(),
        validate: function (value) {
          if(value.length) {
            return true;
          } else {
            return 'Please enter a name for the repository'
          }
        }
      },
      {
        type: 'input',
        name: 'description',
        default: argv._[1] || null,
        message: 'Optionally enter a description of the repository:'
      },
      {
        type: 'list',
        name: 'visibility',
        message: 'Public or private:',
        choices: [ 'public', 'private' ],
        default: 'public'
      }
    ]
    return inquirer.prompt(questions);
  };

  static askIgnoreFiles(filelist) {
    const questions = [
      {
        type: 'checkbox',
        name: 'ignore',
        message: 'Select the files and/or folders you wish to ignore:',
        choices: filelist,
        default: ['node_modules', 'bower_components']
      }
    ]
    return inquirer.prompt(questions);
  };
}


module.exports = Inquirer;