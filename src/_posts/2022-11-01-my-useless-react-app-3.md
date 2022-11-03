---
layout: post
title: "My useless React App, Part 3"
date: "2022-11-01 16:00:00 +0100"
level: 'beginner'
expiration: 'none'
illustration: 'react_form.jpg'
illustrationCaption: 'Image by <a rel="noopener" target="_blank" href="https://pixabay.com/users/krissie-49050/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=2398693">Krissie</a> from <a rel="noopener" target="_blank" href="https://pixabay.com//?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=2398693">Pixabay</a>'
illustration_share: 'react_form_600x600.jpg'
category: 'frontend'
categoryLabel: 'Frontend'
tags:   [react,js,webpack,typescript,chakra]
tagLabels: ['React', 'JS', 'Webpack', 'Typescript', 'Chakra']
excerpt: "So far we scratched only the surface, now it's time dig deeper and add functionality and some tricks to our form. No pain, no gain - that's what they used to say."
keywords: "React, Webpack, JavaScript, Typescript, Chakra"
review: true
published: true
---

### TL;DR

<a href="https://en.wikipedia.org/wiki/In_medias_res" rel="noopener" target="_blank">_In medias res?_</a> No problem. 
If you don't want to waste your time reading this tutorial, and you only need a working code sample, please check the 
source code on <a href="https://github.com/Gixx/worstpractice-react" target="_blank" rel="noopener">GitHub</a>.

### The &lt;SelectBox&gt;

In [Part 2](/frontend/my-useless-react-app-2) we already built the `<Form>` component with dummy children components.
And in [Part 1](/frontend/my-useless-react-app-1) we set up the base specification for the `<SelectBox>` as well:

* I need a select box that loads its option values from an endpoint (in this case from a json file)

Okay, so let's get is started. First recreate the dummy component as a separate component in the 
`src/scripts/components/Form/SelectBox.tsx` file:

```tsx
import React, {FunctionComponent} from 'react'
import { Select } from '@chakra-ui/react'

const SelectBox:FunctionComponent = function()
{
    return (
        <Select placeholder="A select box value" variant="outline" onChange={onSelectChange} />
    )
}

export default React.memo(SelectBox)
```

We added an extra spice to the soup here in the last row: `export default React.memo(SelectBox)`. By default, if a component
has any update, it will re-render all child components as well. But in some cases this is unnecessary for a child component.
With the `React.memo` we can memorize any component, and it will be re-rendered only when that specific component has 
changes.

Now add some eye-candy around this, so modify the JSX part:
```tsx
// ...
return (
    <div>
        <label>
            Select the motto of the day:
            <Select placeholder="Motto of the day" variant="outline" />
        </label>
    </div>
)
// ...
```

Now, we need elements to be loaded. To do it properly we create a new child component for the `<option>` HTML elements.
Create the `src/scripts/components/Form/SelectBox/Option.tsx` file:

```tsx
import React, {FunctionComponent} from 'react'

interface OptionData {
    value: string,
    label: string
}

const Option:FunctionComponent<OptionData> =
    (props) => (<option value={props.value}>{props.label}</option>)

export default React.memo(Option)
```

Here we defined the `<Option>` component and defined its label and value to be strings. Now let's use it in the
`<SelectBox>`:
```tsx
import Option from './SelectBox/Option'
```

Okay, we have the component included, but how to load data? We use promise chain! Another fancy behaviour of the modern
JavaScript. 

First we have to define the external data source. It can be an API with JSON response or anything else. In our case we
will use a static `.json` file. Create the `assets/data/motto.json`:

```json
[
  {
    "id": 1,
    "text": "Good day to learn React!",
    "safe": true
  },
  {
    "id": 2,
    "text": "Spider-man 4 life!",
    "safe": true
  },
  {
    "id": 3,
    "text": "What you can do today, you can do it tomorrow either.",
    "safe": false
  }
]
```

Then in the `<SelectBox>` component create a new ~~method~~ _function_ that will load the data:

```tsx
const SelectBox:FunctionComponent = function()
{
    const [mottoElements, setMottos] = useState<JSX.Element[]>([])
    
    const getMottos = ():void => {
        fetch('/assets/data/motto.json')
            .then(response => response.json())
            .then((data) => {
                const elements = data.map((item) => {
                    return <Option value={item.id.toString()} label={item.text} />
                })

                setMottos(elements)
            })

        return
    }

   // ...
}
```
Okay but this is not good in TypeScript wise. We need to define types here. First we define the loaded data:

```tsx
const SelectBox:FunctionComponent = function() {
    type Motto = {
        id: number,
        text: string,
        safe: boolean
    }
    // ...
}
```
Then we use this type when we map the loaded data:
```tsx
// ...
const elements = data.map((item:Motto) => {
    return <Option value={item.id.toString()} label={item.text} />
})
// ...
```
As you see, we passed the value and label properties to the `<Option>` component, that will be waiting for. So when 
the JSON file is loaded, the promise chain starts, converts the JSON content into JavaScript array of objects, then we 
convert it into array of `<Option>` components and store this in a component state.

Now let's use the loaded elements in the `<SelectBox>`:
```tsx
<Select placeholder="Motto of the day" variant="outline">
    {mottoElements}
</Select>
```
As a final step, make the data load upon the component render. In [Part 2](/frontend/my-useless-react-app-2) we learned
about the `useEffect` and we need exactly the same:

```tsx
const SelectBox:FunctionComponent = function()
{
    // ...
    const getMottos = ():void => {
        // ...
    }

    useEffect(getMottos, [])

   // ...
}
```

We are almost done. In the `<Form>` component let's exchange the dummy component to this new one:
```diff
+   import SelectBox from './Form/SelectBox'
    
    const Form: FunctionComponent = function ()
    {
-       const SelectBox = () => (<select><option value="1">A select box value</option></select>)
    }
```

### The &lt;InputField&gt;

The second form component is the `<InputField>`, which almost as simple as it sounds, but we had an extra criteria for it:

* I need a text box which content changes depending on the selected dropdown value.

Okay, now create the `src/scripts/components/Form/InputField.tsx` file:

```tsx
import React, { FunctionComponent } from 'react'
import { Input, InputGroup, InputLeftAddon } from '@chakra-ui/react'

const InputField:FunctionComponent = function(props)
{
    return (
        <div>
            <InputGroup>
                <InputLeftAddon children='Is it safe?' />
                <Input
                    placeholder='Yes or No'
                    variant='filled'
                    value={props.value}
                />
            </InputGroup>
        </div>
    )
}

export default React.memo(InputField)
```

This is as simple as it can be, so make it complex. Just a little. First, let's typehint that `props`, because the TypeScript 
interpreter won't like it this way.

 ```tsx
// ...
type InputProps = {
    value: string,
}

const InputField:FunctionComponent<InputProps> = function(props)
{
    // ...
}
```

Easy, isn't it? The next thing is to add some sugar flavor: when we click inside the input field, make the whole value be
selected. It's useful. Two things to add here: a function that makes the selection, and an event listener that calls this 
function.
```tsx
// ...
const InputField:FunctionComponent<InputProps> = function(props)
{
    const onClick = (target: HTMLInputElement) => {
        target.setSelectionRange(0, props.value.length)
    }
    
    return (
        <div>
            <InputGroup>
                <InputLeftAddon children='Is it safe?' />
                <Input
                    placeholder='Yes or No'
                    variant='filled'
                    value={props.value}
                    onClick={(e) => onClick(e.target as HTMLInputElement)}
                />
            </InputGroup>
        </div>
    )
}
```
Well, I cheated a little, since the event listener is already written in the Chakra component, I needed only to pass the
new function to it. You can notice that in the function we didn't get the value from the input field, but we used the
`props` instead. It's a nice way to reduce complexity, since the input field's value is already in the `props`, so no need
to go to DOM level to extract it from the field itself.

Our specification said, it should change the value whenever the `<SelectBox>` changes. How to do this?  First I scratched
my head, but then I read after the good solutions, and realized the most obvious way: do this whole process in the common
parent, in the `<Form>` component. So open the `src/scripts/components/Form.tsx` file and add the following:
```tsx
// ...
import InputField from './Form/InputField'

const Form: FunctionComponent = function ()
{
    const [value, setValue] = useState('')
    // ...
   
    return (
        <form id='MyForm' onSubmit={event => event.preventDefault()}>
            <SelectBox/><br/>
            <InputField value={value}/><br/>
            {/* ... */}
        </form>
    )
}
// ...
```
This will store the `value` in the component state and pass it to the `<InputField>` component. But how will the `<SelectBox>`
change the value? The answer is twisted: we create a callback function that sets the `value` and pass this callback to the
`<SelectBox>` which will call it when it changes. Clear? No? Ok, then create the callback in the `<Form>`:
```tsx
// ...
const Form: FunctionComponent = function ()
{
    // ...
    const onSelectChange = (isSafe: boolean) => setValue(isSafe ? 'Yes' : 'No')
    // ...

    return (
        <form id='MyForm' onSubmit={event => event.preventDefault()}>
            <SelectBox onSelectChange={onSelectChange}/><br/>
            <InputField value={value}/><br/>
            {/* ... */}
        </form>
    )
}
// ...
```
So this callback must get a Boolean parameter and if it's TRUE, then the `value` will be "_Yes_", otherwise "_No_".
Now add the following to the `<SelectBox>` component:
```tsx
type SelectProps = {
    onSelectChange: (isSafe: boolean) => void;
}

const SelectBox:FunctionComponent<SelectProps> = function(props) 
{
    const onSelectChange:ChangeEventHandler = (event: ChangeEvent<HTMLInputElement>) => {
        const newValue = parseInt(event.target.value)
        const selectedMotto = null;

        props.onSelectChange((selectedMotto?.safe) === true)
    }

    return (
        {/* ... */}
                <Select placeholder="Motto of the day" variant="outline" onChange={onSelectChange}>
        {/* ... */}
    )
}
```
Note, we defined a type for the props, and changed the component signature as well. Then we created a callback that will 
be called by the Chakra component when the `<select>` field changes. When this callback is called it will get the new
selected value from the regular DOM event, and calls the callback that we passed through the `props`. I mean it **would** call.
Now it can't since we lost the fetched raw data when we converted into `<Option>` components. Fix this too: 
```diff
+   import React, {useState, useEffect, FunctionComponent, ChangeEvent, ChangeEventHandler} from 'react'
    // ...
    const SelectBox:FunctionComponent<SelectProps> = function(props)
    {
        // ...
+       type MottoStore = Array<Motto>;
+       const [mottos, setData] = useState<MottoStore>([])
        // ...
        const onSelectChange:ChangeEventHandler = (event: ChangeEvent<HTMLInputElement>) => {
            // ...
+           const selectedMotto = mottos.find((item:Motto) => item.id === newValue)
            // ...
        }
        //...        
        const getMottos = ():void => {
            fetch('/assets/data/motto.json')
                .then(response => response.json())
                .then((data) => {
                    const elements = data.map((item:Motto) => {
                        return <Option value={item.id.toString()} label={item.text} />
                    })
    
                    setMottos(elements)
+                   setData(data)
                })
    
            return
        }
    }
```
So what happens here? When we fetch the JSON data, we store it with the `setMottos` hook. Since we already defined the type
of each item in the JSON array, we can define the type of this array as well. So did we with the `MottoStore`. It's an
array of `Motto`s. Cool. And now in the `onSelectChange` we can use this array knowing the exact type of each
item, so we can refer one property of them safely. That's why it worth to use TypeScript! When we find the selected item,
we call the callback function with TRUE or FALSE depending on the `safe` property. And remember: this callback will set 
the value in the `<Form>` component.

So by changing the `<SelectBox>`'s selection the `<InputField>`'s value will be "Yes" or "No". Of course, you can change 
the `<InputField>`'s value with any free text if you wish.

### The &lt;Submit&gt;

In the order of the elements the checkbox would be the next, but its functionality depends on the button, so first let's
see this button. Again, our specification was:

* I need a button that changes its style depending on the selected dropdown value

Create the `src/scripts/components/Form/Submit.tsx` file:

```tsx
import React, {FunctionComponent} from 'react'
import { Button } from '@chakra-ui/react'

type SubmitProps = {
    value: string
}

const Submit:FunctionComponent<SubmitProps> = function(props)
{
    const enabled = props.value.toLowerCase() === 'yes'
    const style = enabled ? 'teal' : 'red'
    const text = enabled ? 'OK' : 'Cancel'

    return (
        <Button colorScheme={ style } variant="solid" type="submit">
            {text}
        </Button>
    )
}

export default React.memo(Submit)
```

After what we achieved with the `<SelectBox>` and with the `<Inputfield>`, it's not a big deal to understand how this 
button component works. It must get a `value` parameter, which must be "_yes_" (after making it lower case) or anything else.
This will set an `enabled` variable to TRUE or FALSE. When it's TRUE, the button will be a green (teal) OK, otherwise it
will be a red Cancel. Wonderful.

Make it use in the `<Form>` component:
```diff
    // ...
+   import InputField from './Form/Submit'
    
    const Form: FunctionComponent = function ()
    {
        // ...
-       const Submit = () => (<button type="submit">A submit button</button>)
       
        return (
            <form id='MyForm' onSubmit={event => event.preventDefault()}>
                {/* ... */}
+               <Submit value={value}/><br/>
            </form>
        )
    }
    // ...
```

And since we set and store the `value` in the `<Form>` component, we can easily pass it to the `<Submit>` component as well.

### The &lt;Lock&gt;

Our last component will be a checkbox. Remember our criteria regarding its purpose:

* I need a checkbox that can block the button to change its style

So we need a checkbox. Whenever we check this checkbox the `<Submit>`'s style must be intact. So this has its own value
that should affect another component. Sounds familiar, we did something similar with the `<SelectBox>`, didn't we?
Good, now let's create the `src/scripts/components/Form/Lock.tsx` file:

```tsx
import React, {FunctionComponent} from 'react'
import { Checkbox } from '@chakra-ui/react'

const Lock: FunctionComponent = function ()
{
    return (
        <div>
            <Checkbox size="lg" colorScheme="green">
                Lock button state?
            </Checkbox>
        </div>
    )
}

export default React.memo(Lock)
```
This won't do much, because we need to know the initial state, and we need a callback that will handle the changes. Just
define the `props` type, and pass the properties to the Chakra component:

```tsx
// ...
type CheckboxProps = {
    locked: boolean,
    onLockChange: () => void,
}

const Lock: FunctionComponent<CheckboxProps> = function (props)
{
    return (
        <div>
            <Checkbox size="lg" colorScheme="green" isChecked={props.locked} onChange={props.onLockChange}
            >
                {/* ... */}
            </Checkbox>
        </div>
    )
}
// ...
```
So whether the `<Lock>` component is checked or not, a boolean data will control. And we need to define the void function
for the callback. And as before we do this in the `<Form>` component:

```diff
    // ...
+   import Lock from './Form/Lock'
    
    const Form: FunctionComponent = function ()
    {
        // ...
+       const [locked, setLocked] = useState(true)
    
        // ...
+       const onLockChange = () => setLocked(!locked)
        // ...
-       const Lock = () => (<label>A checkbox to lock state: <input type="checkbox" value="1" /></label>)   
    
        return (
            <form id='MyForm' onSubmit={event => event.preventDefault()}>
                <SelectBox onSelectChange={onSelectChange}/><br/>
                <InputField value={value} onInputChange={onInputChange}/><br/>
+               <Lock locked={locked} onLockChange={onLockChange}/><br/>
+               <Submit value={value} locked={locked}/>
            </form>
        )
    }
    // ...
```

Okay, now the checkbox can call the function and the `<Form>` will store its state in the `locked` variable. As you can
see, we also passed this variable to the `<Submit>` component, so let's make it be used:

```tsx
// ...
type SubmitProps = {
    value: string,
    locked: boolean
}

const Submit:FunctionComponent<SubmitProps> = function(props)
{
    // ...
}

function isLocked(prevProps:SubmitProps, nextProps:SubmitProps)
{
    return prevProps === nextProps || nextProps.locked
}

export default React.memo(Submit, isLocked)
```

Hey, what is this? A new behavior! And yes, the `React.memo` can do more than just remember the actual state of a component 
and avoid its re-rendering, but it also can do this under certain circumstances. With the second parameter we can add an 
expression / callback / function to decide, whether it should change the state or not. I don't know, I didn't dig the sources,
but I assume in the background the component technically receives the new props, but this callback decides to not apply the
changes when the locked property is TRUE.

How it does this? The `isLocked` callback will get two parameters:

* `prevProps`: the component's props before the change
* `nextProps`: the component's props to apply to make the change happen

Simply we just check if there were any change between the two states (default behaviour) OR the checkbox is checked in 
the new properties. Super mega awesome!

<figure class="a-illustration">
    <img class="a-illustration__image" src="/assets/img/post-illustration-placeholder.png" data-src="/assets/img/blog/2022/frontend/my-useless-react-app-3/useless_react_app.png" width="800">
    <figcaption class="a-illustration__caption">My first and completely useless React application</figcaption>
</figure>

### Recap

So what we achieved? In short: made a useless React application. In details:

* We get together `Webpack`, `React` and `Typescript` in a solid, maintainable, well-structured code base.
* We used a third party UI to pimp the shit up.
* We learned how to create `React` components written in `Typescript` that can share data with each other.
* We could avoid to use the hateful `any`.

Now one question left: Is this the worst practice?
