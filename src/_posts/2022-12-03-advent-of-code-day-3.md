---
layout: post
title: "Advent of Code - Day 3"
date: "2022-12-03 12:00:00 +0200"
level: 'beginner'
expiration: 'none'
illustration: 'advent-3.jpg'
illustrationCaption: 'Calendar icon by <a target="_blank" rel="noopener" href="https://pixabay.com/users/pinwhalestock-13691058/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=4623521">Kevin Sanderson</a> from <a target="_blank" rel="noopener" href="https://pixabay.com//?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=4623521">Pixabay</a>'
illustration_share: 'advent-3_600x600.jpg'
category: 'backend'
categoryLabel: 'Backend'
tags:   [advent, php]
tagLabels: ['Advent', 'PHP']
excerpt: 'A nice finger practice to count characters.'
keywords: "PHP, Advent of Code"
review: true
published: true
---

<a href="https://adventofcode.com/2022/day/3" rel="noopener" target="_blank">Today's puzzle</a> in short: There are a
bunch of character strings. Each letter has a number, and we need to group these strings by different criteria and sum
the common characters' numbers.

### The input data

The guys didn't go crazy with this input for the first sight.

* Every line contains "random" characters from the English alphabet.

#### Game rules

* Each character has a priority number:
  * the lowercase characters (from `a` to `z`) have priorities 1 through 26.  
  * the uppercase characters (from `A` to `Z`) have priorities 27 through 52.
* We have to deal with groups of strings, and the character that is common in every string within a group gives the groups
  priority.
* We have to count all the groups' priorities.

### Part one

In the first task we have to split every line of string into two equal parts, and they will form a group.

The first thing we need to realize here is the priority numbers are not the same way added to the characters as they
present in the ASCII table. Because the character codes are the following:

* Characters from `A` trough `Z` are between `65` and `90`.
* Characters from `a` trough `z` are between `97` and `122`.

In PHP, you can easily get this value from the character set's mapping table with the 
<a href="https://www.php.net/manual/en/function.ord.php" rel="noopener" target="_blank">ord()</a> function.

The second thing is - like in most programming languages - the string are not really equal to an array of characters, so
we need to convert each string to arrays of characters.

So the code will be like this:

```php
$sum = 0;

const PRIORITY_DIFF_LOWERCASE = (-97 + 1);
const PRIORITY_DIFF_UPPERCASE = (-65 + 27);

if ($fn = fopen(__DIR__.'/input.txt', 'r')) {
    while (($line = fgets($fn, 1024)) !== false) {
        $line = trim($line);
        $characters = str_split($line);
        [$compartment1, $compartment2] = array_chunk($characters, floor(count($characters) / 2));
        $commonItem = current(array_unique(array_intersect($compartment1, $compartment2)));
        $priorityDiff = ord($commonItem) >= ord('a')
            ? PRIORITY_DIFF_LOWERCASE
            : PRIORITY_DIFF_UPPERCASE;

        $sum += (ord($commonItem) + $priorityDiff);
    }
    fclose($fn);
}


echo $sum.PHP_EOL;
```

As you can see the big "trick" here is we use the character code as a starting pont and with a simple addition (subtraction),
we get the right priority number without having to store them in an array. And as I mentioned earlier, the best way to 
solve this puzzle to convert the strings into arrays of characters (doing it with the `str_split()`), and then with the
`array_intersect()` we can easily get all the common elements of the arrays. 

Since we know that the input data has been delivered with care, we don't need to be super strict with checks:

* We assume that each line has an even number of characters, so we can split with no issue.
* We assume that grouping will result one and only one common character, so we get the right result when we pick the 
  first item from the returning array of the `array_intersect()` function.
* We assume there are no tricks with "out of range" (like random UTF-8) characters.

### Part two

In this task the only thing changed is the way we make the groups. Instead of splitting each row, now we collect 3 rows
into a group. Then the rest of the logic is more-or-less the same:

```php
$sum = 0;
$backpacks = [];

const PRIORITY_DIFF_LOWERCASE = (-97 + 1);
const PRIORITY_DIFF_UPPERCASE = (-65 + 27);

if ($fn = fopen(__DIR__.'/input.txt', 'r')) {
    while (($line = fgets($fn, 1024)) !== false) {
        $line = trim($line);
        $backpacks[] = str_split($line);

        if (count($backpacks) < 3) {
            continue;
        }

        $commonItem = current(array_unique(array_intersect($backpacks[0], $backpacks[1], $backpacks[2])));
        $priorityDiff = ord($commonItem) >= ord('a')
            ? PRIORITY_DIFF_LOWERCASE
            : PRIORITY_DIFF_UPPERCASE;

        $sum += (ord($commonItem) + $priorityDiff);
        $backpacks = [];
    }
    fclose($fn);
}


echo $sum.PHP_EOL;
```
