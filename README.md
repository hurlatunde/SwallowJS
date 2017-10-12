
<p align="center">
<a href="https://docs-swallowjs.github.io/" target="_blank">
<img width="220"src="https://raw.githubusercontent.com/hurlatunde/swallow.js/master/app/swallow/utility/css/img/logo_tech.svg">
</a>
</p>

<p align="center">
  <img src="https://img.shields.io/npm/l/vue.svg" alt="License">
</p>

A lightweight framework to help kick start your <b>Firebase</b> project to build interactive web interfaces. It's so <strong>Ridiculously Fast & Easy-To-Use</strong> You’ll think it’s magic
- Easy Firebase Integration
- Fast & Easy-To-Use
- Flexible
- Fast without the need for compiling / optimization
- "Logic-less-view" because there are no if statements, else clauses, or for loops. Instead there are only tags.

The most important parts of the SwallowJs Framework are the simple included set of different functions. It's build mainly mainly on PathJs for routing, MustacheJs for view and depend more on Firebase for data-source. It that simply
<br>
<br>
<img src="https://raw.githubusercontent.com/hurlatunde/swallow.js/master/app/swallow/utility/css/img/swallow.png" />
<br>
<br>

## Install the Firebase CLI <small>(if you have this in your system already you can just skip to the next step)</small>

The Firebase CLI (Command Line Interface) requires Node.js and npm, which can both be installed by following the instructions on https://nodejs.org/. Installing Node.js also installs npm.

Once you have Node.js and npm installed, you can install the Firebase CLI via npm:


#### Step by step explanation of how to get firebase up and running : author Abolaji Sulaiman B / @abolaji_dev

```bash
step1. install nodejs with npm and firebase-cli, then head to your firebase console and create a project
step2. clone project into [project-folder]
step3. cd into [project-folder] and run the command `firebse login` to login
step4. run `firabse init` initialize your firebase project
step5. using arrow keys to move, select preferred options using space(i'd advice you select all) and press enter when you are done
step6. in the next option, select the project you want to use from the list of projects
step7. press enter to use database.rules.json for databse rules
step8. if you selected the Functions option in step5 you'd be asked if you want to install the dependencies to your functions directory press enter or type `y` to install or cd into funtions folder and run `npm install` after the setup.
step9. you'd be asked what directory to use as your public directory, type `app` and press enter.
step10. next is to choose whether to configure the project as a single-app or not, type `y` and press enter.
step11. type `n` and press in the next step in other to use the existing index.html. (this step is important).
step12. You're done run the command `firebase serve` to start your swallow app.
```

```bash
$ npm install -g firebase-tools
```

More help here: [https://firebase.google.com/docs/hosting/quickstart](https://firebase.google.com/docs/hosting/quickstart)

## Getting started

Go into the folder in which want your project, then:

```bash
$ git clone git://github.com/hurlatunde/swallow.js.git your-project-folder
```

```bash
$ cd your-project-folder
```

Then, you need to get the firebase.json file

```bash
$ firebase init
```
The firebase init command creates a firebase.json configuration file in the root of your project's directory. Your default firebase.json Hosting configuration will look like this:

```json
{
    "hosting": {
        "public": "app",
        "ignore": [
            "firebase.json",
            "**/.*",
            "**/node_modules/**"
        ]
    }
}
```

Once finished, your directory setup should look something like the following:

```html
/your-project-folder
   /app
      /assets
      /swallow
      /views
      config.js
      favicon.ico
      index.html
      route.js
   LICENSE
   README.md
   .gitignore
   firebase.json
```

The public setting tells the firebase command which directory to upload to Firebase Hosting. This directory must be inside the project directory and must exist. The default key is a directory named "public" in your project directory.

```bash
$ firebase serve
```
It’s our aim to increase productivity and make coding more enjoyable. we hope you see that important Firebase with SwallowJs is at easy as it could be.

## Documentation

To check out live examples and docs, visit [docs-swallowjs.github.io](https://docs-swallowjs.github.io/).

## Questions

For questions and support please use the [community chat](https://chat.vuejs.org/).

## Stay In Touch

For the latest releases and announcements, follow on Twitter: [@hurlatunde](https://twitter.com/hurlatunde)

## Supporting swallow.js

SwallowJs wouldn't kick ass if it weren't for these great souls:

<ul>
<li> Femi TAIWO / @dftaiwo </li>
<li> Sunday AKINSETE / @akindroid </li>
<li> Abolaji Sulaiman B / @abolaji_dev </li>
</ul>