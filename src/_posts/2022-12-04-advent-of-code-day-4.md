---
layout: post
title: "Advent of Code - Day 4"
date: "2022-12-04 14:00:00 +0200"
level: 'beginner'
expiration: 'none'
illustration: 'advent-4.jpg'
illustrationCaption: 'Calendar icon by <a target="_blank" rel="noopener" href="https://pixabay.com/users/pinwhalestock-13691058/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=4623521">Kevin Sanderson</a> from <a target="_blank" rel="noopener" href="https://pixabay.com//?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=4623521">Pixabay</a>'
illustration_share: 'advent-4_600x600.jpg'
category: 'backend'
categoryLabel: 'Backend'
tags:   [advent, php]
tagLabels: ['Advent', 'PHP']
excerpt: 'Who like to clean the house when it was already cleaned up. Today we go the lazy way: we need to find out how to reduce redundant work.'
keywords: "PHP, Advent of Code"
review: true
published: true
---

<a href="https://adventofcode.com/2022/day/4" rel="noopener" target="_blank">Today's puzzle</a> in short: There are a
bunch of character strings. Each letter has a number, and we need to group these strings by different criteria and sum
the common characters' numbers.

### The input data

Each line in the input data represents two number sequences in the following way:

* Two ranges of numbers (decimals separated by `-`), then a comma, then another range.
* The ranges of course contain the start and end number.

#### Game rules

The puzzle is simple: 
* The elves work in sections. 
* Each section has an ID number. 
* Each elf work in a range of sections. 
* The elves work in pairs. 
 
Or task is to find overlapping (concurrency, redundancy) of the section ranges.

### Part One

In the first part of the puzzle, we need to identify and count the fully overlapping ranges.

With PHP, it's an easy task. We have built-in function to create a range of numbers as arrays, then just simply compare
these arrays.

```php
$fullyContained = 0;

if ($fn = fopen(__DIR__.'/input.txt', 'r')) {
    while (($line = fgets($fn, 1024)) !== false) {
        $line = trim($line);
        $pairRanges = [];

        if (preg_match('/^(?P<E1from>\d+)\-(?P<E1to>\d+),(?P<E2from>\d+)\-(?P<E2to>\d+)$/', $line, $pairRanges)) {
            $elf1Range = range($pairRanges['E1from'], $pairRanges['E1to']);
            $elf2Range = range($pairRanges['E2from'], $pairRanges['E2to']);

            if (
                count(array_diff($elf1Range, $elf2Range)) === 0 ||
                count(array_diff($elf2Range, $elf1Range)) === 0
            ) {
                $fullyContained++;
            }
        }
    }
    fclose($fn);
}


echo $fullyContained.PHP_EOL;
```

Just for fun, I used a regular expression to split the line of string into four numbers. I LOVE regular expressions by the way!

So when we create the ranges with the `range()` function, we need to check how different they are. The `array_diff()` 
function is just perfect for this. It checks the first argument array against the second array and returns any element
that is present only in the first array, but not in the other. Therefore, to find out whether a range of numbers is fully
contained in the other one, we should get back an empty array.

We need to do this check for the other range too, because we can't be sure, that only the first range can be a subset.

### Part two

This part is almost the same. Here we need to count also the partially overlapping ranges. How to do that? The same way, 
the only difference is now don't look for empty result, but a result that has fewer elements than the subject array.

```php
$partiallyOrFullyContained = 0;

if ($fn = fopen(__DIR__.'/input.txt', 'r')) {
    while (($line = fgets($fn, 1024)) !== false) {
        $line = trim($line);
        $pairRanges = [];

        if (preg_match('/^(?P<E1from>\d+)\-(?P<E1to>\d+),(?P<E2from>\d+)\-(?P<E2to>\d+)$/', $line, $pairRanges)) {
            $elf1Range = range($pairRanges['E1from'], $pairRanges['E1to']);
            $elf2Range = range($pairRanges['E2from'], $pairRanges['E2to']);

            if (
                count(array_diff($elf1Range, $elf2Range)) < count($elf1Range) ||
                count(array_diff($elf2Range, $elf1Range)) < count($elf2Range)
            ) {
                $partiallyOrFullyContained++;
            }
        }
    }
    fclose($fn);
}


echo $partiallyOrFullyContained.PHP_EOL;
```