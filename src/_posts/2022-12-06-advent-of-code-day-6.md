---
layout: post
title: "Advent of Code - Day 6"
date: "2022-12-06 12:15:00 +0200"
level: 'beginner'
expiration: 'none'
illustration: 'advent-6.jpg'
illustrationCaption: 'Calendar icon by <a target="_blank" rel="noopener" href="https://pixabay.com/users/pinwhalestock-13691058/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=4623521">Kevin Sanderson</a> from <a target="_blank" rel="noopener" href="https://pixabay.com//?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=4623521">Pixabay</a>'
illustration_share: 'advent-6_600x600.jpg'
category: 'backend'
categoryLabel: 'Backend'
tags:   [advent, php]
tagLabels: ['Advent', 'PHP']
excerpt: 'This time we need to analyze a spooky data stream.'
keywords: "PHP, Advent of Code"
review: true
published: true
---

<a href="https://adventofcode.com/2022/day/6" rel="noopener" target="_blank">Today's puzzle</a> in short: we get a bunch 
of random characters and need to find the first `n` distinct characters.

### The input data

Today there's only one line in the input, but it's a long one. No special rules for this, just a bunch of characters.

Our task is to find the position of the first `n` distinct characters.

### Part one and two

The two parts today are almost the same, the only difference is the value of the `n`:

* In part one, `n` is *4*.
* In part two, `n` is *14*.

In the solution today I can simply read the whole input at once, since it contains only one line. Then we split this
long string into array with the `str_split()` function, that I used before. Then just start counting. Make it simple:

```php
$line = file_get_contents(__DIR__.'/input.txt');
$code = str_split($line);
$buffer = [];
const MARKER_LENGTH = 4;

for ($i = 0; $i < count($code); $i++) {
    if (in_array($code[$i], $buffer)) {
        [, $buffer] = explode($code[$i], implode('',$buffer));
        $buffer = empty($buffer) ? [] : str_split($buffer);
    }

    $buffer[] = $code[$i];

    if (count($buffer) == MARKER_LENGTH) {
        break;
    }
}

echo ($i + 1).PHP_EOL;
```

The only complexity in this story the buffer handling. I chose a very primitive and low performance, but yet effective 
way:

* check if the next character is in the buffer
  * if yes, then convert the buffer to string 
  * split by the next character and take the second part
  * convert this to array again, or initialize an empty array if the second part is empty
* add the new character to the buffer
* quit the loop when the buffer reached the `MARKER_LENGTH`
