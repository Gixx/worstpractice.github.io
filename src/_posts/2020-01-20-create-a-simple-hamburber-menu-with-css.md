---
layout: post
title: "Create a simple Hamburger menu with CSS only"
date: "2020-01-20 12:00:00 +0100"
expiration: 'none'
illustration: 'hamburger.jpg'
illustrationCaption: 'Image by <a href="https://www.dairyqueen.com/" target="_blank">DairyQueen</a>'
illustration_share: 'hamburger_600x600.jpg'
category: 'frontend'
categoryLabel: 'Frontend'
tags:   [css,html,smart]
tagLabels: ['CSS','HTML', 'Smart']
excerpt: "Let's start with a pretty easy and smart solution. No JavaScript, only CSS."
review: true
published: false
---

### Confession

The basic idea was not mine. Unfortunately I don't even remember where I read about if for the first time, so I am unable to place
credits, and I also unable to tell which solution was the one that give the base for my code. There are tons of tutorials in this
topic believe me. And now here's mine.

### TL;DR

If you don't want to waste your time reading this tutorial, and you only need a working code sample, please check the source code on
<a href="https://github.com/Gixx/worstpractice-css-hamburger-menu" target="_blank">GitHub</a>.

### Build my Burger up!

The goal is to create a slide-in menu with semi-transparent, clickable backdrop without any JavaScript, image or font resources.
Only HTML and CSS. It sounds easy, and after we have done it for the first time, we will see that, it IS really easy to understand
and adopt this technique to other use cases.

#### Naming conventions

There are many popular standards and recommendations on the market which should be considered before starting the development.
I prefer the <a href="https://css-tricks.com/abem-useful-adaptation-bem/" target="_blank">ABEM</a>, but please feel free to use
any other you like. The code samples will be straightforward and easy to replace the class names.

#### 1. Wrapper

I tried some "wrapper-less" solutions during the development process, but any of them could satisfy my criteria. We **NEED** a wrapper.
Anyways I like boxing and encapsulating.

```html
<div class="m-menu"></div>
```

#### 2. Hamburger

I'm starving for a (good) hamburger, and I am not (yet enough) afraid of the junk food giants. But forget about the food for a minute,
because what we are talking about now is that three little ~~piggies~~ horizontal bars on the top left corner on this site (and on many
others). This symbol became a standard in the last decade, so again:

> No need to reinvent the wheel.

There are (at least) three ways to create this icon:

1. Use an image. By itself, or as a background, doesn't matter. A bit old thinking, but definitely the easiest.
2. Use an Icon Font (like the <a href="https://material.io/resources/icons/" target="_blank">Material Icons</a>). Elegant and popular solution.
3. Use meaningless markup and style them with CSS.

I used the third option, because I promised a "CSS-only Hamburger Menu", and not a "CSS-only Hamburger Menu with Image, Font and Cheese".
So let's create those meaningless markups:

```html
<div class="m-menu">
    <div class="m-menu__burger">
        <span></span>
        <span></span>
        <span></span>
    </div>
</div>
```

#### 3. Toggle state

Then, we have to be able to define two states: `Open` and `Closed`. Without JavaScript our toolkit is very limited when we
are talking about 'state'. No doubt, the best tool for this job is the `checkbox`. This HTML element natively provides us what we
need, and we don't have to deal with any JavaScript to change its state. And most importantly: we can differentiate these states
on CSS level.

```html
<div class="m-menu">
    ...
    <input class="m-menu__toggle" type="checkbox">
</div>
```

#### 4. Menu body

And of course we need the menu body itself and some content to make it useful:

```html
<div class="m-menu">
    ...
    <div class="m-menu__content">
        <nav>
            <h2 class="m-menu__title">Categories</h2>
            <ul>
                <li><a href="#cars" class="m-menu__link -current">Cars</a></li>            
                <li><a href="#girls" class="m-menu__link">Girls</a></li>            
                <li><a href="#money" class="m-menu__link">Money</a></li>            
            </ul>
        </nav>
    </div>
</div>
```

#### 5. Backdrop

Unfortunately the <a href="https://developer.mozilla.org/en-US/docs/Web/CSS/::backdrop" target="_blank">`::backdrop` CSS pseudo-element</a>
is not supported in every modern browser... ☞ Safari! Hello?? ...so we have do a little bit of workaround.

```html
<div class="m-menu">
    ...
    <div class="m-menu__backdrop"></div>
</div>
```

Now, that we have the menu skeleton, it's time to add the style that makes all the magic.

### Pimp my Burger up!

To be able to do the CSS job in the right way, I like to visualize the layers and boxes in my head. We need to know which element will
be over the other. Until the W3C is not ready with the `Mind Reader API`, I use this simple diagram:

<figure class="a-illustration">
    <img class="a-illustration__image" src="/assets/img/post-illustration-placeholder.jpg" data-src="/assets/img/blog/2020/frontend/create-a-simple-hamburber-menu-with-css/layers.jpg" width="800" height="522">
    <figcaption class="a-illustration__caption">Box layers</figcaption>
</figure>

The actual page content will be between the `BODY` and the `.m-menu` wrapper.

#### Recommendation

There are some default styles I used to set up every time, to be able to calculate better with box sizes. If you don't want to use any of
the popular CSS "Frameworks", I highly recommend you to use these setting as well. I believe they will make your life much easier.

```css
*, *::before, *::after {
    box-sizing: border-box;
    position: relative;
    cursor: default;
    margin: 0;
}

html {
    position: relative;
    margin: 0;
    padding: 0;
    width: 100vw;
    height: 100vh;
    font-size: 62.5%;
}

body {
    margin: 0;
    padding: 0;
    width: 100vw;
    height: 100vh;
    font-variant-ligatures: no-common-ligatures;
    font-feature-settings: "kern", "liga" 0, "clig" 0;
    scroll-behavior: smooth;
    overflow-x: hidden;
}
```

I give a little description:

<dl>
    <dt><code>box-sizing: border-box;</code></dt>
    <dd>
        Applied on every element and on the <code>before</code> and <code>after</code> pseudo-element. Helps calculating with the box sizes
        and positions.
    </dd>

    <dt><code>cursor: default;</code></dt>
    <dd>
        It's my personal preference, but I don't like the default cursor over the text. Sometimes it's really hard to find, where you left it.
    </dd>
    
    <dt><code>font-size: 62.5%;</code></dt>
    <dd>
        Applied on the HTML element. If your browser supports the unspoken rules, then this should set the base size to 10 pixels. And 
        later on you can simply use the <a href="https://www.w3.org/TR/css-values-3/#rem" target="_blank"><code>rem</code> unit</a> instead 
        of <code>px</code>. Why? Because if the user decides to change the browser's default font sizing, the design will automatically scale 
        properly and the design will not break apart.  
    </dd>
    
    <dt><code>orverflow-x: hidden;</code></dt>
    <dd>
        We stretch the HTML, the BODY and also our menu wrapper to the maximum width of the browsing area. In general it's fine, but on 
        Windows the scrollbars are those old-fashioned ones that consumes a narrow area (around 20 pixels) from this browsing area instead 
        of being an overlay like on Mac OSX and on some Linux Distros (e.g.: Ubuntu). So when we have a long content, the vertical scrollbar 
        appears, takes 20 pixels from the browsing area, and since our HTML is said to be <code>100vw</code>, the whole thing together will be 
        <code>100vw + 20px</code>, which is wider than it can display, so the horizontal scrollbar will appear too. That is what we try to avoid.
        Of course you have to keep this in mind, and plan your design well to let enough space beside the content.
    </dd>
</dl>

#### 1. The wrapper

We put the wrapper into the top left corner and stretch it over the whole browser window and also stuck it into that position whatever happens.

```css
.m-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 100;
  pointer-events: none;
  margin: 0;
  padding: 0;
}
```

See that we use the `vw` (_viewport width_) and `vh` (_viewport height_) instead of a percentage value. Why? In nutshell, a very non
precisely answer is, we use it because the percentage will be calculated from the parent element, while the viewport is calculated
from the browser window area size. And together with the `position: fixed` it will be always in the same viewport position even if we
scroll the content "below". Yes, they are **below**, because this wrapper should be **always on top**. For this make sure that the
`z-index`'s value is high enough.

> But if it's on the top it will block the underneath content!

No, and here's the little magic, I was talking about. The `pointer-events: none;` will make sure that this element will let through every
pointer (mouse) events to the elements underneath.

#### 2. The burger

Within the wrapper we can bravely position the elements

#### 3. The toggle

#### 4. The menu

#### 5. The backdrop

### Live Demo

// codepen

### Conclusion
