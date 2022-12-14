---
layout: post
title: "Advent of Code - Day 13"
date: "2022-12-13 13:40:00 +0200"
level: 'intermediate'
expiration: 'none'
illustration: 'advent-13.jpg'
illustrationCaption: 'Calendar icon by <a target="_blank" rel="noopener" href="https://pixabay.com/users/pinwhalestock-13691058/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=4623521">Kevin Sanderson</a> from <a target="_blank" rel="noopener" href="https://pixabay.com//?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=4623521">Pixabay</a>'
illustration_share: 'advent-13_600x600.jpg'
category: 'backend'
categoryLabel: 'Backend'
tags:   [advent, php]
tagLabels: ['Advent', 'PHP']
excerpt: 'One of the first algorithm in programming you have to learn is sorting.'
keywords: "PHP, Advent of Code"
review: true
published: true
---

<a href="https://adventofcode.com/2022/day/13" rel="noopener" target="_blank">Today's puzzle</a> in short: compare &amp; sort.

### The input data

In the input file today we get a spooky, datastructure-like strings:

* Each line starts with `[` and ends with `]`.
* Between the sides there can be number separated by comma and encapsulated within square brackets.
* The square brackets are in pairs so the number of `[` equals to the number of `]`.
* It's possible to have empty square bracket pairs (`[]`).
* Every third line is an empty line.

#### Game rules

We need to compare values between lines to determine if the line above is smaller than the line above.

### Part one

In part one, we have different game rules, so I present them here: 
* We take every two rows as a group. 
* Groups are counted from 1. 
* Groups are separated by the empty line. 
* We need to check every group if the first member is "smaller" than the second one. If the first member is smaller, we 
  increment a counter with the group's index.

Saying one of them is "smaller" depends on our algorithm. So let's see it:

```php
$pairs = [];
$pairIndex = 1;
$rightOrderPairIndexSum = 0;

if ($fn = fopen(__DIR__ . '/input.txt', 'r')) {
    $row = 0;
    while (($line = fgets($fn, 1024)) !== false) {
        $line = trim($line);

        if (empty($line)) {
            continue;
        }

        $pairs[] = $line;

        if (count($pairs) == 2) {
            $left = json_decode(str_replace('[]', '[null]',$pairs[0]));
            $right = json_decode(str_replace('[]', '[null]',$pairs[1]));
            $result = comparePairs( $left, $right);

            if ($result < 0) {
                $rightOrderPairIndexSum += $pairIndex;
            }
            $pairs = [];
            $pairIndex++;
        }
    }
    fclose($fn);
}

function comparePairs(array $left, array $right): int
{
    foreach ($left as $index => $leftValue) {
        if ($leftValue === null) {
            return -1;
        }

        if (!isset($right[$index])) {
            return 1;
        }

        $rightValue = $right[$index];

        if (is_array($leftValue) && !is_array($rightValue)) {
            $rightValue = [$rightValue];
        }

        if (!is_array($leftValue) && is_array($rightValue)) {
            $leftValue = [$leftValue];
        }

        if (is_array($leftValue) && is_array($rightValue)) {
            if ($result = comparePairs($leftValue, $rightValue)) {
                return $result;
            } else {
                continue;
            }
        }

        if ($leftValue == $rightValue) {
            continue;
        }

        if ($leftValue < $rightValue) {
            return -1;
        }

        if ($leftValue > $rightValue) {
            return 1;
        }
    }

    if (count($left) < count($right)) {
        return -1;
    }

    return 0;
}

echo $rightOrderPairIndexSum.PHP_EOL;
```

The trick part was in this puzzle, that the line almost looks like a JSON string. The only issue is the empty square brackets.
But since these are strings, we can fix it by replacing every `[]` with `[null]`, and there you go: We have a JSON!

From this point is just a simple recursive function and a loop. The function always gets two arrays to compare. Then it
starts a loop on the first parameter (making it the `left`) to compare the values:

* If left-side value is `null`, that means originally there was an `[]`. Left is smaller, return `-1`.
* If the right-side pair does not exist, then the left is bigger, return `1`.
* If any of the left or right values is an array, while the other is a literal, we convert the literal into an array.
* If both values are arrays, we recursively call the compare function with these values and if it returns with `0`, we 
  continue the compare, otherwise we return what it returns (either `1` or `-1`).
* If both values are literals, and they are equal to each other, we continue the compare.
* If left is smaller, return `-1`.
* If right is smaller, return `1`.
* If we reach the end of the loop, and we see the size of the parameter is smaller, than the second's, it means, left is
  smaller, return `-1`.
* If we didn't return so far, the values should be equal, return `0`.

### Part two

Now we have a quite different game rule, however the code will hardly change. 

* We have to add two extra lines to the input: these will be the distress signal codes.
* We have to ignore the empty lines.
* We need to sort every line with the two new lines included.
* We have to check where are the distress signal codes now and multiply their indexes.
* The line indexing starts from 1.

Luckily I instinctively wrote the `comparePairs()` function returns `-1`, `0` or `1`. With 20+ years of experience, this
just came naturally. And what a luck! Now we have to sort all the lines, the PHP's `usort()` function requires exactly a
custom function that returns `-1`, `0` or `1`. So this time we have to change only the surrounding codes:

```php
<?php

$lines = [
    '[[2]]',
    '[[6]]'
];

if ($fn = fopen(__DIR__ . '/input.txt', 'r')) {
    $row = 0;
    while (($line = fgets($fn, 1024)) !== false) {
        $line = trim($line);

        if (empty($line)) {
            continue;
        }

        $lines[] = $line;
    }
    fclose($fn);
}

function compare(string $a, string $b): int
{
    $left = json_decode(str_replace('[]', '[null]',$a));
    $right = json_decode(str_replace('[]', '[null]',$b));

    return comparePairs($left, $right);
}

function comparePairs(array $left, array $right): int
{
    // ...
}

usort($lines, 'compare');

$key1 = array_search('[[2]]', $lines) + 1;
$key2 = array_search('[[6]]', $lines) + 1;

echo ($key1 *  $key2).PHP_EOL;
```

As you can see, I didn't change the input file, instead I initialized the "line collection" array with the two new lines.
Then, when we read the input, we skip all the empty lines, and add the rest to this collection.

I created a wrapper function called `compare`, to prepare the left- and right-side values before call our original `comparePairs()`.
Of course, I could - and maybe I should - write it as an anonymous function as the second parameter of the `usort()`, but
I like naming things.

The `usort()` will do the heavy job of sorting, then the `array_search` will get the indexes, that we need to solve the 
puzzle.