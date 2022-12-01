---
layout: post
title: "Advent of Code - Day 1"
date: "2022-12-01 17:00:00 +0100"
level: 'beginner'
expiration: 'none'
illustration: 'advent-1.jpg'
illustrationCaption: 'Calendar icon by <a target="_blank" rel="noopener" href="https://pixabay.com/users/pinwhalestock-13691058/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=4623521">Kevin Sanderson</a> from <a target="_blank" rel="noopener" href="https://pixabay.com//?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=4623521">Pixabay</a>'
illustration_share: 'advent-1_600x600.jpg'
category: 'backend'
categoryLabel: 'Backend'
tags:   [advent, php]
tagLabels: ['Advent', 'PHP']
excerpt: 'It&apos;s December again, the time of the Advent Calendars. <a href="http://was.tl/" rel="noopener" target="_blank">Eric Wastl</a> made the <a href="https://adventofcode.com/" rel="noopener" target="_blank">Advent of Code</a> which is an Advent calendar of small programming puzzles for a variety of skill sets and skill levels that can be solved in any programming language.'
keywords: "PHP, Advent of Code"
review: true
published: true
---

<a href="https://adventofcode.com/2022/day/1" rel="noopener" target="_blank">Today's puzzle</a> in short: It's a 
heart-warming story about elves and their journey. To be able to travel, they need food and calories. Every elf writes a 
note about the amount of food (calories) they take in their bags. 

### Technical specification

First of all, we need to read between the lines, and pile off all the fairytale from the pure specification.

We will get the input data:

* every line may contain a number
* every line ends with a new line character (obviously)
* the numbers a grouped
* every group separated with one empty line
* the last row is also an empty line

### Part one

The task: summarize the numbers by the groups and return with the highest number. It's that simple.

#### The code

The first step is to save the puzzle input into a file: `input.txt`. Then let's think about the most simple solution:

```php
$actualCalorie = 0;
$maxCalorie = 0;

if ($fn = fopen(__DIR__.'/input.txt', 'r')) {
    while (($line = fgets($fn, 1024)) !== false) {
        $line = trim($line);

        if (empty($line)) {
            $maxCalorie = max($actualCalorie, $maxCalorie);
            $actualCalorie = 0;
            continue;
        }

        $actualCalorie += (int) $line;
    }
    fclose($fn);
}

echo $maxCalorie.PHP_EOL;
```

* initialize the `$actualCalorie` and the `$maxCalorie` as zero
* read the file line-by-line:
  * if not empty line: 
    * convert the data into a number
    * add this number to a puffer variable `$actualCalorie`
  * if the line is empty:
    * check if the `$actualCalorie` if higher than the `$maxCalorie`
    * reset `$actualCalorie`
    * skip to next line
* print the `$maxCalorie`

### Part two

The input is the same, but we need to get the sum of the top three groups.

#### The code

Instead of saving the `$maxCalorie` all the time, we need to save all the groups, sort the array in descending order, and 
add together the first three element.

```php
$actualCalorie = 0;
$calories = [];

if ($fn = fopen(__DIR__.'/input.txt', 'r')) {
    while (($line = fgets($fn, 1024)) !== false) {
        $line = trim($line);
        if (empty($line)) {
            $calories[] = $actualCalorie;
            $actualCalorie = 0;
            continue;
        }

        $actualCalorie += (int) $line;
    }
    fclose($fn);
}

rsort($calories);

echo ($calories[0] + $calories[1] + $calories[2]).PHP_EOL;
```

I could go into a more secure and much prettier code, but I didn't want to, because:

* the result is the important, not the code
* the input is known, so I could skip some array index availability checks
