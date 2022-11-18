---
layout: post
title: "Tips & Tricks to make Jekyll do what you need"
date: "2022-11-18 17:00:00 +0100"
level: 'Beginner'
expiration: "none"
illustration: 'jekyll.jpg'
illustrationCaption: '<a href="https://commons.wikimedia.org/wiki/File:Dr_Jekyll_and_Mr_Hyde_poster.png">Unknown author, published by the National Printing &amp; Engraving Company, Chicago</a>,<br>Public domain, via Wikimedia Commons'
illustration_share: 'jekyll_600x600.jpg'
category: devenv
categoryLabel: 'Development Environment'
tags:   [jekyll]
tagLabels: ['Jekyll']
excerpt: "The most simple websites are those have only static files. For a blog like this is perfect. But making everything static by default is difficult. You need a generator. And when you work with Jekyll, sometimes you meet Mr. Hide as well."
review: true
published: false
---

### What is Jekyll?

Short answer: <a href="https://jekyllrb.com/Jekyll" rel="noopener" target="_blank">Jekyll</a> is a static site generator.

Long answer: Jekyll is a static site generator that uses layouts and <a href="https://daringfireball.net/projects/markdown/syntax" rel="noopener" target="_blank">Markdown</a> 
to generate a static website. It has its own templating engine, named <a href="https://jekyllrb.com/docs/step-by-step/02-liquid/" rel="noopener" target="_blank">Liquid</a>. 
If you know the Symfony's <a href="https://twig.symfony.com/" rel="noopener" target="_blank">Twig</a> template engine, 
you will find the Liquid very familiar. At least syntax-wise.

### Why Jekyll?

When I started to deal with static site generators, I didn't know much of them. I asked my friends what they recommend, but
almost everybody told a different tool as to be the best. ...including the _"Write your own in PHP, dude!"_ option. 

So I tried some of them, and I chose Jekyll because its template engine's syntax similarity to Twig's, which I know well.

### Tops and Flops

The bright side of the story is, the Liquid is easy to learn, easy to understand and easy to use. Unless you keep yourself
on the path that the documentation shows you. 

The dark side of the story begins as soon as you want something different, or a bit more.

The Liquid has three main components:

* objects
* tags
* filters

Liquid tags are not the same as on <a href="https://www.twitter.com" rel="noopener" target="_blank">Twitter</a>. These 
are more like statements, functions, procedures. For example, the `{% raw %}{%if ...%}...{% endif %}{% endraw %}` is a 
_control flow tag_.

Just to confuse you, it has Twitter-like tags too. And categories. Great.

So, from these three components you can create many beautiful things, but sometimes it's very painful to customize them.

### Challenges

During the development of this blog, I faced some issues, and I had to be very creative to solve them. My problem now is
I can't really remember the order of the issues came up, so I can't tell now which issues in which order lead me to the 
current state of the setup. But I try to grab some details.

#### Slug vs Label

I had a private, more personal blog that I wrote in Hungarian. There we have special letters above the default _latin-1_
character set. In a very short time I figured out that Jekyll was written by English-speaking programmers. Because - according
to my decade-long experience - many English-speaking programmers just simply give a damn on the rest of the world, that 
would like to speak, read and write in other than English. Sorry guys, that's the truth.

And in Jekyll, what you give for example for a post's category name, it will be used for the URL too. And if you have 
special characters you are screwed. For example the `category: 'csőlátás'` will be transformed into `/cslts`. Not good.
Also even in English you can shoot yourself on the leg, when you need a short slug for a longer label:

```liquid
category: 'Development environment'
```

For this the slug will be either `/development/environment/...` or `/development%20environment/...`, however a simple
`/devenv/...` would be enough for the URL. And the same goes for the tags.

Of course there are _I18n_ plugins for Jekyll, but what I tried, didn't work very well. 

What could I do? I tricked the system, with the system's tools:

* Every custom data you create in the posts' <a href="https://jekyllrb.com/docs/step-by-step/03-front-matter/" rel="noopener" target="_blank">front matter</a>
will be collected in the `post` variable. 
* You can create custom data by capturing a printouts.
* You can create arrays by splitting up strings. Liquid even has some array-related filters.
* You can iterate through these arrays.

So, if you keep adding multiple built-in/custom data consequently for all the posts, and you keep them in sync, you can 
create two arrays, and the item index will be the connection between them. Example:
```liquid
---
category: 'devenv'
categoryLabel: 'Development Environment'
---

Page content
```
then you can use the following:
```liquid
{% raw %}<a href="{{ page.category }}">{{ page.categoryLabel }}</a>{% endraw %}
```

Okay, you can say, this is easy, we just go through the `site.posts` array and print these values. Okay, but how you do it
when you have more than one category and/or tags? How you pair them? 

```liquid
---
category: 'devenv'
categoryLabel: 'Development Environment'
tags:   [docker, wsl2, powerline-shell, phpstorm, windows]
tagLabels: ['Docker', 'WSL2', 'Powerline Shell', 'PHPStorm', 'Windows']
---

Page content
```

Of course, you can do it, but you have to write all the damn iteration every place, where you want to use them. Wouldn't
be easier to pre-collect all the categories and tags and their labels and just use them?

### Variables

I introduced a new include file, called `variables.html`:

```liquid
{% raw %}{%- include variables.html -%}{% endraw %}
```

And inside that file I made all my dirty tricks: collect all the posts' categories and labels, concatenate them into one string, and then split them back
to arrays:

#### Slugs and labels

```liquid
{% raw %}{%- capture categorySlugs -%}
    {% for post in site.posts %}{{ post.category | strip }}{% unless forloop.last %},{% endunless %}{% endfor %}
{%- endcapture -%}
{%- assign categorySlugs = categorySlugs | split: ',' | uniq -%}

{%- capture categoryLabels -%}
    {% for post in site.posts %}{{ post.categoryLabel | strip }}{% unless forloop.last %},{% endunless %}{% endfor %}
{%- endcapture -%}
{%- assign categoryLabels = categoryLabels | split: ',' | uniq -%}
{% endraw %}
```

We do the same for the tags:

```liquid
{% raw %}{%- capture tagSlugs -%}
    {% for post in site.posts %}{{ post.tags | join: ',' }}{% unless forloop.last %},{% endunless %}{% endfor %}
{%- endcapture -%}
{%- assign tagSlugs = tagSlugs | split: ',' | uniq -%}

{%- capture tagLabels -%}
    {% for post in site.posts %}{{ post.tagLabels | join: ',' }}{% unless forloop.last %},{% endunless %}{% endfor %}
{%- endcapture -%}
{%- assign tagLabels = tagLabels | split: ',' | uniq -%}
{% endraw %}
```

Rules to keep:

* Never sort these arrays, otherwise the slugs and labels will be mixed up
* Always make sure that one slug doesn't have multiple labels and vice-versa.

### Highlight the actual page in the menu

For this blob I group posts into categories. There are also tags, archive and other static pages. I need to know which 
is the actual page I am on to highlight the right link in the menu.

```liquid
{% raw %}
{% endraw %}
```

### List the top 3 most used tags and display their usage number

Another interesting solution was born here. To know what is the internal content of the `site.tags`, we call the help of
the `debug` filter:

```liquid
{% raw %}{{ site.tags | debug }}
{% endraw %}
```

... which will print something like:

```
{"docker"=>[#], "js"=>[#, #, #, #], "clean-code"=>[#, #, #], "react"=>[#, #, #], "webpack"=>[#, #, #], "jekyll"=>[#]}
```

So the `key` in this object holds the slug, and the `value` is an array with some unknown data. What is important for us, 
it's countable. The more a tag is used, the larger its value-array is. From these information, we need to make a sorted list.

How to sort? Make the count to be a string, concatenate to the slug, and sort as text:

```liquid
{% raw %}{%- capture counts_with_tags_string -%}
    {%- for tag in site.tags -%}{{ tag[1] | size | prepend:"000000" | slice:-6,6 }}:{{ tag[0] }}{% unless forloop.last %},{% endunless %}{%- endfor -%}
{%- endcapture -%}
{% endraw %}
```

Let's go one-by-one. 
* The `{% raw %}{{ tag[1] | size | prepend:"000000" | slice:-6,6 }}{% endraw %}` gets the tag value-array's size. 
* By prepending a bunch of zeros in front of the number, converts it to string. So if we used a tag for example **123** 
times, then it will be **000000123**. 
* We need to make every tag counter to be exactly the same length to be sortable, so
we keep only the last 6 characters: `slice:-6,6`. 
* Then we print a colon (`:`). 
* Then we print the tag slug (`tag[0]`). 
* And finally, unless it's the last item in the iteration, we print a comma (`,`) as well. 

We need to be careful, the `capture` tag capture the whitespaces as well, so always double-check the result.

From the example above, with this capture we get the following string:

```
000001:docker,000004:js,000003:clean-code,000003:react,000003:webpack,000001:jekyll
```

To convert it back to array, and get the highest number first, we need to split this string by the comma, then sort and 
reverse the result list: 

```liquid
{% raw %}{%- assign counts_with_tags = counts_with_tags_string | split:"," | sort | reverse -%}{% endraw %}
```

Then we can use this list to match with our `tagSlugs` and `tagLabels` lists to print the top 3 most used tags:

```liquid
{% raw %}<ul>
{%- for count_with_tag in counts_with_tags limit:3 -%}
    {%- assign tag = count_with_tag | split:":" | last | slugify -%}
    {%- assign tagLabel = tag -%}
    {% assign count = count_with_tag | split:":" | first | plus: 0 %}
    {%- for tagSlug in tagSlugs -%}
        {%- if tag == tagSlug -%}
            {%- assign tagLabel = tagLabels[forloop.index0] -%}
            {%- break -%}
        {%- endif -%}
    {%- endfor -%}
    <li><a href="/tags/{{ tag }}/">{{ tagLabel | strip }} <sup>{{ count }}</sup></a></li>
{%- endfor -%}
</ul>    
{% endraw %}
```
What is going on here:

* We go through this list and get only the first 3 items (`limit:3`). 
* Get the tag's slug by splitting up the actual element by the colon (`:`) and take the last part (`| last`).
* For safety purpose we assign the tag slug to the `tagLabel` as well.
* Get the tag's count by splitting up the actual element by the colon (`:`) and take the first part (`| first`). We add 
  zero (`| plus 0`) to convert it back to number. So the **000123** will be **123** again. 
* We go through our `tagSlugs` list we created earlier and match against the tag slug we currently have. When we find it
  we overwrite the `tagLabel` and quit this loop.
* Print the link with the slug, the label and the count.

### Pragmatically stop the build process

In some special cases the tag slugs and tag labels are getting out of sync because of human error. To avoid publishing
a site with wrong tag links and let Google to index them, I had to find a way to stop the build process with error.
The solution is quite simple: we rely on the Jekyll's behaviour, that it evaluates the "conditions" only when the control
gets there, not sooner, and not when not used. So simply add a screwed up Liquid code, like an `include` with invalid characters:

```liquid
{% raw %}{%- assign tagSlugSize = tagSlugs | size -%}
{%- assign tagLabelSize = tagLabels | size -%}
{%- if tagSlugSize != tagLabelSize -%}
    {%- include ./stopBuild.html -%}
{%- endif -%}
{% endraw %}
```
...will result and error but only when the `tagSlugs` and `tagLabels` lists' sizes are different:
```bash
{% raw %}Liquid Exception: Invalid syntax for include tag. File contains invalid characters or sequences: ".
/stopBuild.html" Valid syntax: {% include file.ext param='value' param2='value' %} in /app/src/_layouts/default.html
{% endraw %}
```



```liquid
{% raw %}
{% endraw %}
```
