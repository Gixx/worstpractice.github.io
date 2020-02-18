---
layout: post
title: "Deal with 'public' and 'private' access modifiers in JS"
date: "2020-02-19 20:00:00 +0100"
level: 'Beginner'
expiration: 'none'
illustration: ''
illustrationCaption: ''
illustration_share: ''
category: 'frontend'
categoryLabel: 'Frontend'
tags:   [js, oop]
tagLabels: ['JS', 'OOP']
excerpt: "I asked my frontend-pro friends and colleagues to tell me their honest opinions about my codes. Well, I got it. This is the absolute worst practice I'm afraid."
keywords: "JS, JavaScript, OOP, Object-Oriented Programming, Class, Private, Public, access modifiers, getter, setter"
review: true
published: true
---

### My concept

You'd better know, I am basically a backend developer. Or, as I used to say with a little bit of humor and a piece of well-deserved self-critics:

> I am a Full-STUCK Señor PHP Developer

Most of my time in the office I deal with corporate PHP codes, and try to give my best in it, and I also try to improve my skills. I write object-oriented
code 99% during the work by using the most hyped and recommended patterns, such as Dependency Injection, Adapter, Factory, MVC, etc. So I use OO day-by-day,
and I learned to think in the object-styled encapsulation during my years in the industry. In fact I already see the world in Objects...!
That's totally crazy, isn't it?

And when I deal with JavaScript for myself, like on this blog, where I can give myself free hand, I try to somehow adopt this 'knowledge' too. But we
all know that, in the native way it is not that simple. It needs a different kind of thinking, which I find a bit weird and triple-twisted. There are
objects of a kind, and since ES6 there are classes too, but not in the `class`ical way (Ha-Ha-Ha). Scope, inheritance, access modifiers and in general
everything is just different. Well, JavaScript is a different animal for sure... that's what they used to say.

I know, there are many many wonderful frameworks and libraries to develop JavaScript. I could do React, Svelte, Vue and so on. But I don't. Not right now.
I want to do something simple, something on my own. I like to reinvent the wheel, and even if it will be a shitty one, it will be mine. And I don't want
to go deep in the soul of the JavaScript development now, and define terms, understand the whys, find the good way I ought to follow.

The first step for a dummy / lame / rookie / amateur like me is to try to create something for my own. Make it work. Then, when I have some experience,
I can learn the proper 'How'. You can't qualify yourself to the 100m sprint on the Olympic games until you can't even walk, can you? And how do you learn
to walk? Try it, do it, fail and retry.

So I decided to use my understanding of the `Object`, and with the available tools of the JavaScript's arsenal, I create something, in which I can feel
myself comfortable when I code. Of course to achieve this, I had to give up some of OO things temporarily, and stick to a very basic concept:

* encapsulate properties and methods together
* support `public` and `private` access in some way
* no need for inheritance right now

I tried several different ways before I choose the following two cases. Both have pros and cons. To be comparable I've made the same `Yet-another`
UUID generator class.

#### Way 1: clean but vulnerable.

This can be called a more 'standard' solution.

```js
/**
 * @typedef {Object} MyClass1
 * @property {function(): string} generateUUID
 * @property {string} nilUUID
 */

/**
 * @constructor
 */
const MyClass1 = function()
{
    /** @type {array} */
    const AVAILABLE_CHARACTERS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

    /** @type {array} */
    const uuidTemplate = 'xxxxxxxx-xxxx-!xxx-?xxx-xxxxxxxxxxxx'.split('');

    /** @type {string} */
    const uuidVersion = '4';

    /**
     * @returns {string}
     */
    const getNilUUID = function()
    {
        return '00000000-0000-0000-0000-000000000000';
    };

    /** @type {string} */
    this.nilUUID = getNilUUID();

    /**
     * Generate a valid UUID
     * @see https://en.wikipedia.org/wiki/Universally_unique_identifier
     *
     * @return {string}
     */
    this.generateUUID = function (isNilUUID = false)
    {
        if (isNilUUID) {
            return this.nilUUID;
        }

        let uuidVariant, i, random;
        const uuid = [];

        for (i = 0; i < uuidTemplate.length; i++) {
            random = 0 | Math.random() * 16;
            uuidVariant = (random & 0x3)  | 0x8;

            uuid[i] = uuidTemplate[i]
                .replace(/[^\-\!\?]/, AVAILABLE_CHARACTERS[random])
                // ! is the uuid version
                .replace('!', uuidVersion)
                // ? is the high bits of clock sequence according to rfc4122
                .replace('?', AVAILABLE_CHARACTERS[uuidVariant]);
        }
        return uuid.join('');
    };
};

window['MyClass1'] = MyClass1;

const myObj1 = new MyClass1();
```

Our goal is to create an object where there is a publicly available property (`nilUUID`) and a publicly available method (`generateUUID()`).

We construct a new instance with the `new` keyword. If we leave the keyword and then try to call the `myObj1.generateUUID();`, we will get a
`Uncaught TypeError: Cannot read property 'generateUUID' of undefined` error.

All the `const` and `let` methods and properties will be hidden from "outside".
So the `myObj1.getNilUUID();` will result a `Uncaught TypeError: myObj1.getNilUUID is not a function` error. We can call them to be `private`.

Every property and method having the `this` keyword will be reachable from outside. They are definitely `public`. But they are heavily vulnerable which
I find really disturbing. But that's the JS way. Try the `document.getElementById = 'sucker';` in the console on any website and see what happens. It's
also possible to inject new properties and methods into our instance which is also a bit... yuck...

```js
// Get and set public property
console.log(myObj1.nilUUID); // '00000000-0000-0000-0000-000000000000'
console.log(myObj1.generateUUID(true)); // '00000000-0000-0000-0000-000000000000'

myObj2.nilUUID = 'Hello World!';
console.log(myObj1.nilUUID); // 'Hello World!'
console.log(myObj1.generateUUID(true)); // 'Hello World!'

// BUT!
myObj1.generateUUID = 'I am so sorry';
console.log(myObj1.generateUUID(true)); //  Uncaught TypeError: myObj1.generateUUID is not a function
console.log(myObj2.generateUUID); // 'I am so sorry'
```

##### Pros:
* It has a cleaner code.
* It's easier to understand.
* Enforces the `new` keyword for instantiation.

##### Cons:
* It is vulnerable: every public method and property can be re-defined.
* It has no support for `get`, `set` and `static` keywords.
* No type check is possible before assigning new value to the public properties.
* It's possible to add/attach additional properties and methods to the instance.

#### Way 2: twisted thinking to protect the code

This one is a nasty motherfucker. I found the cons very annoying in the first example, so I tried to figure out, how can I eliminate them.

In this case we start the same way as previously, but then instead of making publicly available properties and methods, we simply
**return** with an object.

```js
/**
 * @returns {string|Readonly<{readonly, nilUUID: Object.nilUUID, generateUUID: (function(*=): string)}>}
 * @constructor
 */
const MyClass2 = function()
{
    /** @type {array} */
    const AVAILABLE_CHARACTERS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

    /** @type {array} */
    const uuidTemplate = 'xxxxxxxx-xxxx-!xxx-?xxx-xxxxxxxxxxxx'.split('');

    /** @type {string} */
    const uuidVersion = '4';

    /**
     * @returns {string}
     */
    const getNilUUID = function()
    {
        return '00000000-0000-0000-0000-000000000000';
    };

    /**
     * Collection of public properties.
     *
     * @type {Object}
     */
    const properties = {
        nilUUID: getNilUUID(),
    };

    /**
     * Collection of public methods including setters and getters for public properties.
     *
     * @type { {readonly nilUUID: Object.nilUUID, generateUUID: (function(*=): string)} }
     */
    const methods = {
        set nilUUID(newValue) {
            if (typeof newValue !== 'string') {
                throw new TypeError('nilUUID must store string value, ' + (typeof newValue) + ' given.');
            }

            properties.nilUUID = newValue;
        },

        get nilUUID() {
            return properties.nilUUID;
        },

        /**
         * Generate and return a valid UUID
         * @see https://en.wikipedia.org/wiki/Universally_unique_identifier
         *
         * @returns {string}
         */
        generateUUID: function(isNilUUID = false)
        {
            if (isNilUUID) {
                return this.nilUUID;
            }

            let uuidVariant, i, random;
            const uuid = [];

            for (i = 0; i < uuidTemplate.length; i++) {
                random = 0 | Math.random() * 16;
                uuidVariant = (random & 0x3)  | 0x8;

                uuid[i] = uuidTemplate[i]
                    .replace(/[^\-\!\?]/, AVAILABLE_CHARACTERS[random])
                    // ! is the uuid version
                    .replace('!', uuidVersion)
                    // ? is the high bits of clock sequence according to rfc4122
                    .replace('?', AVAILABLE_CHARACTERS[uuidVariant]);
            }
            return uuid.join('');
        }
    };

    return Object.freeze(methods);
};

window['MyClass2'] = MyClass2;

const myObj2 = new MyClass2();
```

Our goal is the same: create an object where there is a publicly available property (`nilUUID`) and a publicly available method (`generateUUID()`).

We construct a new instance with the `new` keyword. But unfortunately it's not mandatory. However, I'd like to use it to keep the illusion.

As previously all the `const` and `let` methods and properties will be hidden from "outside". And here's the twisty thing: we define two objects in the
private part. One for the "*public properties*" and one for the "*public methods*". Within each object we can reach methods and properties by the `this`
keyword, as we do it in the `generateUUID()` method. But for cross-referencing between the `properties` and `methods` we can't use the `this`.

So why we separate the "*public*" properties and methods? Because in the end we will freeze the returning `methods` object, which means we can't change
this object any more. Luckily this does not stand for the contents of Arrays and Objects. In a frozen object we can't change scalars, but we can
add/change elements in an array/object. That's why we collect all the "*public*" properties separately in an object. And since we can use the `get`
and `set` keywords, we can create the illusion of working directly with the public property:

```js
// Get and set public property
console.log(myObj2.nilUUID); // '00000000-0000-0000-0000-000000000000'
console.log(myObj2.generateUUID(true)); // '00000000-0000-0000-0000-000000000000'

myObj2.nilUUID = 'Hello World!';
console.log(myObj2.nilUUID); // 'Hello World!'
console.log(myObj2.generateUUID(true)); // 'Hello World!'

// AND!
myObj2.generateUUID = 'I am so sorry';
console.log(myObj2.generateUUID(true)); // 'Hello World!'
console.log(myObj2.generateUUID); // 'function()...'
```

##### Pros
* The public code is in safe. No way to overwrite them.
* It has support for `get`, `set` and `static` keywords.
* With the `set` method we can do type check before assignment.
* Not possible to add/attach additional properties and methods.

##### Cons
* This is far away from readability.
* It's difficult to understand.
* Every public, read-write property requires a `set` and a `get` method.
* The `new` keyword is not mandatory.

### Conclusion

As you can see, in order to eliminate all the negatives from the first solution, I had to sacrifice all the positives from it. But I think it's worth it,
because in the end we want to use the code and not read it. And we can still use the `new` keyword if we want to.

Readability is not a big price to make our object defended from harmful hands. What do you think? Am I right? Am I wrong? Is this really a
worst practice?
