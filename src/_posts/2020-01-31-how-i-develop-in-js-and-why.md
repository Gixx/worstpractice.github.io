---
layout: post
title: "How I develop in JS and why?"
date: "2020-01-31 20:00:00 +0100"
level: 'Beginner'
expiration: 'none'
illustration: ''
illustrationCaption: ''
illustration_share: ''
category: 'frontend'
categoryLabel: 'Frontend'
tags:   [js]
tagLabels: ['JavaScript']
excerpt: "I asked my frontend-pro friends and colleagues to tell me their honest opinions about my codes. Well, I got it."
review: true
published: true
---

### My concept

It's better to know, that I am basically a backend web developer. Or, as I used to say with a little bit of humor and a piece of well-deserved self-critics:

> I am a Full-STUCK Señor PHP Developer

Most of my time in the office I deal with corporate PHP codes, and try to give my best in it, and I also try to improve my skills. I write object-oriented
code 99% during the work by using the most hyped and recommended patterns, such as Dependency Injection, Adapter, Factory, MVC, etc. So I use OO day-by-day,
and I learned to think in the object-styled encapsulation during my years in the industry. In fact I already see the world in Objects...!
That's totally crazy, isn't it?

And when I deal with JavaScript for myself, like on this blog, where I can give myself free hand, I try to somehow adopt this 'knowledge' too. But we
all know that, in the native way it is not that simple. It needs a different kind of thinking, which I find a bit weird and triple-twisted. There are
objects of a kind, but no classes in the `class`ical way (Ha-Ha-Ha). Scope, inheritance and in general everything is just different.
Well... JavaScript is a different animal for sure, they used to say.

### Create Class-like things

I don't want to go deep in the soul of the JavaScript development now, and define terms, understand the whys, find the good way I ought to follow.
The first step for a dummy / lame / rookie / amateur like me is to try to create something for my own. Make it work. Then, when I have some experience,
I can learn the proper 'How'. You can't qualify yourself to the 100m sprint on the Olympic games until you can't even walk, can you? And how do you learn
to walk? Try it, do it, fail and retry.

So I decided to use my understanding of the `Object`, and with the available tools of the JavaScript's arsenal, I create something, in which I can feel
myself comfortable when I code. So here it is what I figured out. Please, dear real Frontenders, forgive me for this.

```js

const MyClass = function()
{
    /** type {string} Nil UUID */
    const readOnlyProperty = '00000000-0000-0000-0000-000000000000';
    
    /** @type {number} */
    let readWriteProperty;
    
    /**
     * Generate a valid UUID 
     * @see https://en.wikipedia.org/wiki/Universally_unique_identifier
     * 
     * @return {string}
     */
    const generateUUID = function()
    {
        const AVAILABLE_CHARACTERS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
        // M is the uuid version
        // N is the high bits of clock sequence as per rfc4122, sec. 4.1.5
        const uuidTemplate = 'xxxxxxxx-xxxx-Mxxx-Nxxx-xxxxxxxxxxxx'.split('');
        const uuidVersion = 4;
        let uuidVariant, i, random;
        const uuid = [];
        
        for (i = 0; i < uuidTemplate.length; i++) {
            random = 0 | Math.random() * 16;

            switch (uuidTemplate[i]) {
                case '-':
                    uuid[i] = '-';
                    break;
                    
                case 'M':
                    uuid[i] = uuidVersion;
                    break;
                    
                case 'N':
                    uuidVariant = (random & 0x3)  | 0x8;
                    uuid[i] = AVAILABLE_CHARACTERS[uuidVariant];
                    break;
                
                default:
                    uuid[i] = AVAILABLE_CHARACTERS[random];
              
            }
        }
        return uuid.join('');
    };
    
    /**
     * 
     * @type {{setReadWrite: setReadWrite, getNilUUID: (function(): string), SOME_CONSTANT: number, getReadWrite: (function(): number), resetReadWrite: resetReadWrite, generateUUID: (function(): string)}}
     * @private
     */
    const __ = {
        /** @type {number} */
        SOME_CONSTANT: 1,
        
        /**
         * Gets the read-only property.
         * 
         * @returns {string}
         */
        getNilUUID: function() 
        { 
            return readOnlyProperty; 
        },
        
        /**
         * Generate and return a valid UUID
         * 
         * @returns {string}
         */
        generateUUID: function()
        {
            return generateUUID()
        },
        
        /**
         * Gets the read-write property.
         * 
         * @returns {number}
         */
        getReadWrite: function() 
        { 
            return readWriteProperty;
        },
        
        /**
         * Sets the read-write property.
         * 
         * @param {*} value Accepts only Integers
         */
        setReadWrite: function(value) 
        { 
            if (isNaN(value)) {
                throw new ReferenceError('Parameter 1 expected to be an integer, ' + (typeof value) + ' given.');
            }
            
            readWriteProperty = parseInt(value); 
        },
        
        /**
         * Resets the read-write property to its initial state.
         */ 
        resetReadWrite: function() 
        { 
            // Just an example how the public stuff reach each other.
            this.setReadWrite(this.SOME_CONSTANT); 
        }
    };
    
    // Just an example for the init.
    readWriteProperty = __.SOME_CONSTANT;
    
    return Object.freeze(__);
};

window['MyClass'] = MyClass;

const x = new MyClass();
```
