---
layout: post
title: "Why I dropped the `Mobile-first` approach"
date: "2020-03-11 15:05:00 +0100"
level: ''
expiration: 'none'
illustration: 'drop.jpg'
illustrationCaption: 'Image from <a target="_blank" rel="noopener" href="https://houstoniphonescreenrepair.com/">Houston iPhone Screen Repair</a>'
illustration_share: 'drop_600x600.jpg'
category: 'frontend'
categoryLabel: 'Frontend'
tags:   [responsive,mobile,design]
tagLabels: ['Responsive', 'Mobile', 'Design']
excerpt: "...and how I regret it. At least a little bit."
keywords: "CSS, responsive design, design patterns"
review: true
published: true
---

### The (wrong) decision

It was late 2019. I was working on this blog in my free time since months, and I still couldn't see the end. I was struggling with the
design - as always - and my creativity went into the `not good enough` infinite loop, and started to reject any ideas came up.
Meanwhile the backend part - if we can  talk about backend for a static website - went pretty well. Luckily I could heavily build on
my experiences when I created my family blog, the <a href="https://thomas.von.fuerstenfeld.blog" target="_blank" rel="noopener">Thomas von Fürstenfeld</a>.

It was almost Christmas season, when I finally had a design idea flashed in my mind. Since I felt I'm running out of time, I tried to
sketch it up as simple as possible and drop all the unnecessary things. What remain was the color scheme and the header. That's enough
for the start.

And this was the exact moment when I had to decide what is more important for me:
* Start the blog in the very beginning of 2020, even if the price is I have to drop the `Mobile-first` approach, or
* Do it properly, nice and clean, and maybe I will be able to publish it only in the summer maybe?

Since I already had the domain bought in February 2019, I didn't want to waste any time more. I really felt that if I don't publish
this blog in the first days of the New Year, I will get into the `not good enough` rejecting loop again... So I chose to give a damn
on the handheld versions for a while, just do it, publish it. Anyway, developers develop on desktops, don't they?

### The help of the years in the business

So my own tech blog started, and I also wrote my first articles. I shared the links to a small group of developers, to check, read, and
give some feedback about their impressions, etc. Among the many many positive feedback, there was one returning topic:

> Where is the mobile version?

I realized, my assumption - that the web developers usually sits in front of a desktop computer and browse the Internet on their 24
inch monitors - was totally wrong. I can't avoid to create a version for the tablets and the mobile devices too.

Luckily, without really focus on the semantic aspects, somehow I was able to create a nice, clean and tidy `HTML` structure in the
first wave, and with the guiding help of the <a target="_blank" rel="noopener" href="https://css-tricks.com/abem-useful-adaptation-bem/">ABEM</a>
`CSS` class naming convention, the style definitions were also became pretty flexible. This happens when you stare the monitor
long enough: you get experiences which with time become skills.

### Surprise, Mother#@!$er!

First I tried to figure out, what I should change to make this website look relatively good on the smaller screens. And here
came the surprise: only a few parts required different styles. And some of these changes can be
applied directly on the "global" styles. Great, isn't it? I was happy I don't have to refactor the whole frontend.

So in the end, in one week of free time work, I was able to create a decent mobile and tablet version for this website. Unfortunately
I had to give up the "Monitor with terrible code" (hidden) feature, because the dynamically positioning an element, which has the
`perspective` style transformation applied on it, is very difficult, and it exceeds my current capabilities.

So I modified the header, and I spliced off the `title with the woman` and the `monitor`. This way I could gently hide the monitor
as soon as the header starts to shrink.

Also the smallest screens got a `title only` header to maximize the useful area of the page. In fact this graphical change caused
the biggest headache because the actual version of the design was never saved in an editable source (whatta loooser!), and I had to
remember all those tiny adjustments to add them again. The rest of the job on the CSS side (overwrite margin, padding, font-size)
were just a matter of manual measuring.

### Conclusion

When you have time, it's worth to invest in planning, and thinking in the `mobile-first approach`. Most of the people reads articles
on their mobile phones or tablets. Those, who refuse to support these devices will loose potential customers. For me, it's not a
disaster, I don't think there are many people visiting this new and unknown website. And since I have taken up the responsive(ish)
design, my future readers will know about my design failure only from this article.
