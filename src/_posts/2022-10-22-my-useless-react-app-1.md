---
layout: post
title: "My useless React App, Part 1"
date: "2022-10-22 23:00:00 +0100"
level: 'beginner'
expiration: 'none'
illustration: 'react.jpg'
illustrationCaption: 'Image by <a target="_blank" rel="noopener" href="https://pixabay.com/users/geralt-9301/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=598820">Gerd Altmann</a> from <a rel="noopener" target="_blank" href="https://pixabay.com//?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=598820">Pixabay</a>'
illustration_share: 'react_600x600.jpg'
category: 'frontend'
categoryLabel: 'Frontend'
tags:   [react,js,webpack,typescript,chakra]
tagLabels: ['React', 'JS', 'Webpack', 'Typescript', 'Chakra']
excerpt: "A developer needs to develop. Not only as an everyday job, but also in knowledge. And since I am not really interested in the DevOps way, I looked at my other beloved part, the Frontend. So I said “<em>It's better later than never</em>” and started to learn React."
keywords: "React, Webpack, JavaScript, Typescript, Chakra"
review: true
published: true
---

### The glorious plans

I thought I know JavaScript enough that to understand React will be a piece of cake. I thought I will adopt the knowledge in no time and
also mastering the TypeScript to be able to write super strict typed clean code. Well, more or less I was right. I was right that I have some
knowledge in JavaScript. And basically that's all.

But that was not enough. As soon as I realized that I started to look for articles "_for dummies_" to understand what part of the 
ECMAScript 6, 7, 8, ... 2022 or ES.Next I didn't know about... well, it was a huge list. Some of them was familiar but didn't really use, 
while some of them (like the arrow function) was earned my hate, and I refused to use it any time. What a bad behavior, isn't it? 
And of course there were many small but important thing I didn't know about. So I had to learn them.

So first I had to reset my bad attitude, and accept the knowledge I refused. Now me and the arrow functions are like Jack Lemon and Walter Matthau
in the legendary movie, *The Odd Couple*. 

### The reachable goals

First of all, I had to set up some goals to reach. These were:
* Use the main _React.JS_ and alternative solutions like, Angular, Vue or Preact etc.
* Use _Typescript_, to be as strict in typing as possible, and do whatever is necessary to avoid the `any`.
* Use _SCSS_, because it's a minimum effort to use it in a project like this, and also a logical decision.
* Use an external library for the UIX, but I also should be able to override the behaviour when necessary.
* Use _Webpack_ to hold it all together.

### TL;DR

If you don't want to waste your time reading this tutorial, and you only need a working code sample, please check the source code on
<a href="https://github.com/Gixx/worstpractice-react" target="_blank" rel="noopener">GitHub</a>.

### Too long to be in one article

Honestly I started writing this article already in April, but I was too busy to finish. Meanwhile, I could improve the code a lot.
For example, the Typescript support and the <a href="https://chakra-ui.com/" target="_blank" rel="noopener">Chakra UI</a> added only
in the recent days. That's why now I decided to split up the topic into multiple smaller articles, so I can get better into the
details and not just throw in some chunks.

### Part 1. 

#### The application

Many people would probably create a market ready product to demonstrate their knowledge. But not me. I create an application
that is completely useless. It's purpose to have some common features and use cases work together that are easy to copy and
paste to a real product later. It will be a kind of proof of concept. So what I want to have here:
* I want a form encapsulated into the React application. For now, it won't post anywhere.
* I need a select box that loads its option values from an endpoint (in this case from a json file)
* I need a text box which content changes depending on the selected dropdown value
* I need a button that changes its style depending on the selected dropdown value
* I need a checkbox that can block the button to change its style
* I need an alert box to comment some events

This all looks stupid for the first sight, and for the second too, but if you think about it, these use cases are very common.

#### The folder structure

Okay, now we know what we want, so let's start working. In the first step we create some folders and files:

<figure class="a-illustration">
    <img class="a-illustration__image" src="/assets/img/post-illustration-placeholder.png" data-src="/assets/img/blog/2022/frontend/my-useless-react-app-1/tree.png" width="252">
    <figcaption class="a-illustration__caption">Basic folder structure. Icons by <a target="_blank" rel="noopener" href="https://icons8.com">Icons8</a>, generated with <a target="_blank" rel="noopener" href="https://www.jstree.com/">JsTree</a></figcaption>
</figure>

I think I don't have to describe the files and folders, those few who may read this blog probably already know the basics. 
If not, I can highly recommend the <a href="https://scrimba.com/allcourses?topic=react" target="_blank" rel="noopener">Scrimba</a> website
where you can find many great courses. There's even a free course about React that I also used to learn the basics.

#### The start

I started this journey already in 2020 during the first wave of the Covid pandemic in Europe. That time the plan was only
Webpack + React. Unfortunately I didn't document my work, and now I can't remember how it started, and what were the tops and 
flops during the learning process. The first version of the application was so lame and simple, I didn't feel good enough
to publish it. 

I needed Webpack + React. So I looked for a working solution on the internet. Webinars, blogs and
<a href="https://www.stackoverflow.com" target="_blank" rel="noopener">Stackoverflow</a> topics helped a lot. Copied the
most promising ones, made them work and the job was done. This was basically my starting point, and I assume everybody, who
used Webpack and React earlier will know how it looks like more or less: Webpack, Babel, React, Sass etc.

#### Adding the Typescript
 
On the summer of 2022 I get back to this blogpost. I decided I pimp the application up a bit, and follow the rules
of the nature by rewrite the whole thing in Typescript.

##### package.json

So the problem for me was that I had to add also the `Typescript` to the configuration, and make it work
together with the React and Webpack. With a fast search I could find the packages I have to add to the `package.json`: 
```json
{
  "devDependencies": {
    "@types/fork-ts-checker-webpack-plugin": "~0.4.5",
    "@typescript-eslint/eslint-plugin": "~5.40.1",
    "@typescript-eslint/parser": "~5.40.1",
    "fork-ts-checker-webpack-plugin": "~7.2.13",
    "prop-types": "~15.8.1",
    "ts-node": "~10.9.1",
    "typescript": "~4.8.4"
  }
}
```

##### webpack.config.ts

For the Webpack, I had to change the extension of the webpack configuration from `.js` to `.ts` and 
add/change some settings inside. Not sure, but maybe changing the file extension is optional.

The `entry` option changed from `.jsx` to the Typescript equivalent `.tsx`:
```typescript
entry: pathSrc + '/scripts/app.tsx',
```

Then the module rules needed some Typescript support (both `.ts` and `.tsx` along with `.js` and `.jsx`) by adding a new 
preset to the `babel-loader`:
```typescript
module: {
    rules: [
        {
            test: /\.(ts|js)x?$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        '@babel/preset-env',
                        '@babel/preset-react',
                        '@babel/preset-typescript',
                    ],
                },
            },
        },
```

Changed the `resolve` setting to catch the new extensions:
```typescript
resolve: {
    extensions: ['.tsx', '.ts', '.js'],
},
```

And in the end adding a new plugin that runs TypeScript type checker:
```typescript
plugins: [
    new ForkTsCheckerWebpackPlugin({
        async: false,
    }),
```

##### tsconfig.json

Then I added the `tsconfig.json` to the project. For what this file is, and what its purpose, read the 
<a target="_blank" rel="noopener" href="https://www.typescriptlang.org/docs/handbook/tsconfig-json.html">official documentation</a>.
My configuration has a few extra options compared to the documentation:
```json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "target": "es6",
    "sourceMap": true,
    "declaration": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "allowSyntheticDefaultImports": true,
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react",
    "typeRoots": [
      "node_modules/@types"
    ]
  },
  "include": ["src/scripts"],
  "exclude": ["node_modules", "src/styles"]
}
```
Unfortunately I have no idea, which blog I get these settings from, and why they are good or necessary.

#### Checking

To check if all these changes work well, I made a dummy application that simply outputs a "Hello World".

First we need a template. In the configuration we can add the `HTMLWebpackPlugin` to define and deal with it:

```typescript
new HtmlWebpackPlugin({
    title: 'React + Webpack test',
    template: pathSrc + '/template.html', // template file
    filename: pathBuild + '/index.html', // output file
}),
```
Great. Now let's see our super simple template content:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="x-ua-compatible" content="ie=edge" />
    <title><%= htmlWebpackPlugin.options.title %></title>
  </head>

  <body>
    <div id="root"></div>
  </body>
</html>
```
Note that we basically did nothing here, just give a sane minimal frame for out application. We don't even include any
JavaScript or CSS files. The only strange part is the title, where we insert a configuration value. The same we defined 
for the `HTMLWebpackPlugin`. But this template is empty so far, so create the dummy application. To do so, create the 
`app.tsx` file in the `src/scripts` folder with the following content:

```jsx
import React from 'react'
import ReactDOM from 'react-dom'

const app = document.querySelector('#root')

ReactDOM.render(
    <div>Hello World</div>,
    app
)
```
Yes, for the moment now it's "only" a React code, but don't forget: it will go through the Typescript parser. And if there's
no error during the build, then we can assume it's working.

If you run the `npm run start` command, you should see the Hello World in the browser.

With this flimsy explanation and lame tutorial I finish the first part. In the next article I will show the different components,
and will write about the difficulties I faced, and also the features I learned and adopted.