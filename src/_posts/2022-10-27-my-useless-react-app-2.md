---
layout: post
title: "My useless React App, Part 2"
date: "2022-10-27 16:00:00 +0100"
level: 'beginner'
expiration: 'none'
illustration: 'react_components.jpg'
illustrationCaption: 'Image by <a rel="noopener" target="_blank" href="https://pixabay.com/users/stevepb-282134/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=674828">Steve Buissinne</a> from <a rel="noopener" target="_blank" href="https://pixabay.com//?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=674828">Pixabay</a>'
illustration_share: 'react_components_600x600.jpg'
category: 'frontend'
categoryLabel: 'Frontend'
tags:   [react,js,webpack,typescript,chakra]
tagLabels: ['React', 'JS', 'Webpack', 'Typescript', 'Chakra']
excerpt: "After we have the working development environment, now it's time to create the components to fulfill my criteria I set up previously."
keywords: "React, Webpack, JavaScript, Typescript, Chakra"
review: true
published: true
---

### Disclaimer

The [Part 1](/frontend/my-useless-react-app-1) was a shaking up for me from the year-long winter sleep. It was a bit rushy 
writing, because I didn't wanna jump in the middle of this tutorial without any warm up. Getting to the very start point
was really not a big deal after reading all those blogs, tutorials and watch the 
<a href="https://scrimba.com/allcourses?topic=react" target="_blank" rel="noopener">Scrimba</a> React courses. The real 
difficulty there was to add the Typescript to the game. Of course, it's a piece of cake now.

### TL;DR

And again, if you don't want to waste your time reading this tutorial, and you only need a working code sample, please 
check the source code on <a href="https://github.com/Gixx/worstpractice-react" target="_blank" rel="noopener">GitHub</a>.

### Inside out, outside in

Now we have a working basic, it's time to add the features. For a while, they will be dummies. 

#### The Application

Open the `src/script/app.tsx` file and modify the "_Hello World_" application:

```jsx
import React from 'react'
import ReactDOM from 'react-dom'
import {ChakraProvider} from '@chakra-ui/react'
import {Box} from '@chakra-ui/layout'
import '../styles/app.scss'

const app = document.querySelector('#root')
const Messagebar = () => (<div id="messagebar">This is an alert box</div>)
const Heading = () => (<h1>Hello there!</h1>)
const Form = () => (<form><button type="submit">Dummy</button></form>)

ReactDOM.render(
    <ChakraProvider>
        <MessageBar/>
        <Box id="box">
            <Heading />
            <Form />
        </Box>
    </ChakraProvider>,
    app
)
```

But before we could compile, we have to create the `src/styles/app.scss` too:
```sass
/* Variables */
$size-text-base: 62.5%; /* This should produce 10px, if your browser follows the unspoken rules. */

/* Definitions */
html {
  position: relative;
  margin: 0;
  padding: 0;
  width: 100vw;
  height: 100vh;
  font-size: $size-text-base;
  background: white;
}

body {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100vh;
  font-weight: 400;
  font-style: normal;
  font-size: 1.6rem;
  line-height: 1.9rem;
  letter-spacing: 0.01rem;
  scroll-behavior: smooth;
  overflow-x: hidden;
}

#root {
  width: 100vw;
  height: 100vh;
  background: cadetblue;
}

#box {
  position: absolute;
  width: 60rem;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: 2rem;
  padding: 1.5rem;
}

#messagebar {
  position: fixed;
  z-index: 100;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  width: 50rem;
  background-color: green;
  color: white;
}

button {
  border: 0.2rem outset lightgray !important;
  background-color: darkgray !important;
  padding: 0.2rem 0.5rem !important;
  text-align: center;
}
```
Okay, now let's see what we have here. If you read the <a href="https://chakra-ui.com/getting-started" rel="noopener" target="_blank">Chakra tutorial</a>,
then you will know we have to encapsulate our whole application into the `<ChakraProvider>` JSX tag. Whatever we do inside,
it can be a regular JSX component, a simple HTML or preferably a <a href="https://chakra-ui.com/docs/components" rel="noopener" target="_blank">Chakra component</a>.

First we need a `<MessageBar>` that will show information regarding some JavaScript events. Then we need some greeting text
represented by the `<Heading>` and a `<Form>`.

Right now none of them is doing anything. Let's take a look at the components, and fine tune them.

#### The &lt;Heading&gt; 
The `<Heading>` actually is just fine as is:

```tsx
const Heading = () => (<h1>Hello there!</h1>)
```

We don't need to touch, I didn't have any plan with it other than adding a greeting message.

#### The &lt;MessageBar&gt;

Let's define the purpose. We can say for example, we want to see the alert notification whenever the window size changes.

To achieve that, we need *hooks*! We wouldn't, if we used the _React Class Components_, but for some unknown reason -  at 
least it's unknown for me - the JS world don't want to hear about classes and methods and private properties and other 
classical OOP stuffs... They want functions! But a not too long time ago, they faced a situation when they couldn't use the 
_Class Components'_ state and lifecycle mechanism, so they invented the *HOOKS*! I bet, under the hood the hooks are some 
kind of helluva big cracking, hacking, antipattern pile of stinky junk. But that's what we have, that's what we have to use:

* *useState* that lets you add React state to function components.
* *useEffect* lets you express different kinds of side effects after a component renders.

And also we will need to use the Chakra UI. Create the `src/scripts/components/MessageBar.tsx`:

```tsx
import React, {useState, useEffect, FunctionComponent} from 'react'
import {Alert, AlertIcon, AlertTitle, AlertDescription} from '@chakra-ui/react'
import {Box} from '@chakra-ui/layout'

const MessageBar:FunctionComponent = function()
{
    const [[x, y], setWindowSize] = useState<number[]>([window.innerWidth, window.innerHeight])
    
    return (
        <Alert id="messagebar" status="info" variant="top-accent">
            <AlertIcon />
            <Box className="chakra-alert__content">
                <AlertTitle>The browser window is resized</AlertTitle>
                <AlertDescription>The window size now is {x} x {y}</AlertDescription>
            </Box>
        </Alert>
    )
}

export default MessageBar
```

As you can see, we didn't add any magic here so far, just getting the window sizes and put them into the `x` and `y` 
variables, and we printed them out. 

To have the magic work, let's add the `useEffect`:

```tsx
    // ...
    useEffect(() => {
        const handleResize = () => {
            setWindowSize([window.innerWidth, window.innerHeight])
        }

        window.addEventListener('resize', handleResize)
    
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        // ...
    )
// ...
```
By default - according to the definition - the `useEffect` runs both after the first render and after every update. But 
in our case we want it to run only once, specifically when the page is rendered. How to do this? Just simply pass an empty 
array (`[]`) as a second argument. This tells React that our effect doesn't depend on any values from props or state, so 
it never needs to re-run. And indeed, our effect depends on a window event. We also return the `useEffect` with a function. 
It is the `cleanup function`, mainly to avoid memory leaks. Runs automatically, nice to have. 

We also want this alert to appear only when the event is triggered. So let's extend this `useEffect` function (showing
only the additions):

```tsx
// ...
const MessageBar:FunctionComponent = function()
{
    // ...
    const [isVisible, setVisibility] = useState<Boolean>(false)

    useEffect(() => {
        let timerIds: Array<number> = []

        const handleResize = () => {
            setWindowSize([window.innerWidth, window.innerHeight])
            cancelTimeoutHide()
            showAlertBox()
            timeoutHideAlertBox()
        }

        const showAlertBox = () => {
            setVisibility(true)
        }

        const timeoutHideAlertBox = () => {
            timerIds.push(window.setTimeout(() => setVisibility(false), 1500))
        }

        const cancelTimeoutHide = () => {
            for (let i = 0, n = timerIds.length; i < n; i++) {
                window.clearTimeout(timerIds[i])
            }
            timerIds = []
        }

        // ...
    }, [])

    return isVisible ? (
        <Alert id="size-alert" status="info" variant="top-accent">
            {/* ... */}
        </Alert>
    ) : <></>
}

```
So we introduce a new state the `isVisible`. This controls whether the alert box "is visible" or not. Wow, what a miracle!
How? When it's visible, the component returns the alert box content, otherwise it returns and empty JSX tag, which makes the
React renderer to remove the box from the source code.

We also added three new methods:
* `showAlert`: shows the alert box
* `timeoutHideAlert`: sets timeouts to hide the alert box.
* `cancelTimeoutHideAlert`: clears the timeouts that were not executed yet.

Why do we need array to collect the IDs? It is simply just to give room for more actions here. If you check the 
<a href="https://github.com/Gixx/worstpractice-react/blob/main/src/scripts/components/MessageBar.tsx" rel="noopener" target="_blank">source code on GitHub</a>,
you will see, I added another timout to add/remove a class name change that will make some CSS transition effect. 

#### The &lt;Form&gt;

The Form. In [Part 1](/frontend/my-useless-react-app-1) I set up the specification about the form and what it should be
capable of. Just to recap, these were:

* I need a select box that loads its option values from an endpoint (in this case from a json file)
* I need a text box which content changes depending on the selected dropdown value
* I need a button that changes its style depending on the selected dropdown value
* I need a checkbox that can block the button to change its style

For now let's construct a dummy form component. What can I say? I love dummy things! I'm dummy! Yaaaay!
Create the `src/scripts/components/Form.tsx`:

```tsx
import React, {FunctionComponent} from 'react'
import './Form/style.scss'

const Form: FunctionComponent = function ()
{
    const SelectBox = () => (<select><option value="1">A select box value</option></select>)
    const InputField = () => (<input type="text" value="An input field value" />)
    const Lock = () => (<label>A checkbox to lock state: <input type="checkbox" value="1" /></label>)
    const Submit = () => (<button type="submit">A submit button</button>)

    return (
        <form id='MyForm' onSubmit={event => event.preventDefault()}>
            <SelectBox/><br/>
            <InputField/><br/>
            <Lock/><br/>
            <Submit/>
        </form>
    )
}

export default Form
```

You can see, I imported a stylesheet too. That's a nice way to group together component source with its styles. In the 
webpack configuration we make sure that the styles won't be inlined. Honestly I hate when a production code is full of 
inline styles. Let's keep it for debugging, and keep the styles in their well deserved own file. To do so, let's modify the
`webpack.config.ts` file:

```typescript
// ...
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

const config: webpack.Configuration = {
    module: {
        rules: [
            // ...
            {
                test: /\.(scss|css)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {loader: 'css-loader', options: {importLoaders: 2, sourceMap: false}},
                    {loader: 'postcss-loader', options: {sourceMap: true}},
                    {loader: 'sass-loader', options: {sourceMap: true}},
                ],
            },
        ],
    },
    plugins: [
        // ...
        new MiniCssExtractPlugin({
            filename: 'assets/styles/[name].[contenthash].css',
            chunkFilename: '[id].css',
        }),
        // ...
    ],
    // ...
}
// ...
```
Now create the `src/scripts/components/Form/style.scss` file. Notice this stylesheet not under the `src/styles`, where we
have the general `app.scss`. With this `import` we can make sure it will be included, compiled and minified too. For now
keep it simple, but you can pimp it up anytime.

```css
#MyForm {
  padding: 20px;
}
```

Now we have a very basic, no-use form. Let's pause here for a while, take a breath and play around. In the next article
we will build the Form's subcomponents and make the whole thing work. Cheers!