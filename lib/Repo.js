const _ = require("lodash");
const fs = require("fs");
const git = require("simple-git")();
const CLI = require("clui");
const Spinner = CLI.Spinner;
const touch = require("touch");

const Inquirer = require("./Inquirer");
const Gh = require("./Github");

class Repo {
  static async createRemoteRepo() {
    const github = Gh.getInstance();
    const answers = await Inquirer.askRepoDetails();

    const data = {
      name: answers.name,
      description: answers.description,
      private: answers.visibility === "private"
    };

    const status = new Spinner("Creating remote repository...");
    status.start();

    try {
      const response = await github.repos.create(data);
      return response.data.ssh_url;
    } catch (err) {
      throw err;
    } finally {
      status.stop();
    }
  }

  static async createGitignore() {
    const filelist = _.without(fs.readdirSync("."), ".git", ".gitignore");

    if (filelist.length) {
      const answers = await Inquirer.askIgnoreFiles(filelist);
      if (answers.ignore.length) {
        fs.writeFileSync(".gitignore", answers.ignore.join("\n"));
      } else {
        touch(".gitignore");
      }
    } else {
      touch(".gitignore");
    }
  }

  static async setupRepo(url) {
    const status = new Spinner(
      "Initializing local repository and pushing to remote..."
    );
    status.start();

    try {
      await git
        .init()
        .add(".gitignore")
        .add("./*")
        .commit("Initial commit")
        .addRemote("origin", url)
        .push("origin", "master");
      return true;
    } catch (err) {
      throw err;
    } finally {
      status.stop();
    }
  }
}

module.exports = Repo;
