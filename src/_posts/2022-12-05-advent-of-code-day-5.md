---
layout: post
title: "Advent of Code - Day 5"
date: "2022-12-05 18:30:00 +0200"
level: 'beginner'
expiration: 'none'
illustration: 'advent-5.jpg'
illustrationCaption: 'Calendar icon by <a target="_blank" rel="noopener" href="https://pixabay.com/users/pinwhalestock-13691058/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=4623521">Kevin Sanderson</a> from <a target="_blank" rel="noopener" href="https://pixabay.com//?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=4623521">Pixabay</a>'
illustration_share: 'advent-5_600x600.jpg'
category: 'backend'
categoryLabel: 'Backend'
tags:   [advent, php]
tagLabels: ['Advent', 'PHP']
excerpt: 'Christmas town is a big factory with a big warehouse. And in this warehouse the elves need to organize crates with the world-famous `CrateMover 9001`'
keywords: "PHP, Advent of Code"
review: true
published: true
---

<a href="https://adventofcode.com/2022/day/5" rel="noopener" target="_blank">Today's puzzle</a> in short: for the first 
sight I thought it will be a custom sorting algorithm, but in the end it became just a simple item movement between arrays.

### The input data

For the first time, the input data contains additional information. We have to extract this information and create initial
"warehouse" state in the PHP code. The input file must remain pilled with crane-movement orders.

* The first 10 lines must be deleted (can be added to the PHP code as comment)
* Each line has the same form of information: `move # from # to #`, where `#` is a decimal.* 

#### Game rules 

The solution for the puzzle is to follow each order and move crates between the columns according to the command, where
the numbers are defined as follows:

* The first number represents the amount of crates.
* The second number represents the source column.
* The third number represents the target column.

Our task is to tell which item is on the top of each column.

### Part one

Because of a misreading the elves predicted that the crane is the `CrateMover 9000` which can move only one item at a time.

To solve this puzzle we need to think in arrays again and simple `pop` and `push` elements.

```php
$storage = [
    null,
    str_split('QFMRLWCV'),
    str_split('DQL'),
    str_split('PSRGWCNB'),
    str_split('LCDHBQG'),
    str_split('VGLFZS'),
    str_split('DGNP'),
    str_split('DZPVECW'),
    str_split('CPDMS'),
    str_split('ZNWTVMPC'),
];

if ($fn = fopen(__DIR__.'/input.txt', 'r')) {
    while (($line = fgets($fn, 1024)) !== false) {
        $line = trim($line);
        $command = [];
        if (preg_match('/move (?P<iteration>\d+) from (?P<from>\d+) to (?P<to>\d+)/', $line, $command)) {
            for ($i = 0; $i < $command['iteration']; $i++) {
                $storage[$command['to']][] = array_pop($storage[$command['from']]);
            }
        }
    }
    fclose($fn);
}

foreach ($storage as $column) {
    if (empty($column)) continue;
    echo end($column);
}

echo PHP_EOL;
```

As you can see, first of all, I initialized the warehouse in a more readable way: string which is being split into array 
of characters. Why should I give up something that works? 

Then I used regular expression again to extract the numeric information out from the command. Then just simply do an 
`array_pop()` and an `array_push` (with a simpler syntax) within a for loop.

In the end, we go through the final state of the `$storage` and print the last element of each item.

### Part two

Now the elves figured out their mistake, and realized that the crane is actually a `CrateMover 9001`, which can move multiple 
items at a time. This will change the results for sure.

Technically this means, either:
* We keep the loop and the `array_pop`, but then we need to collect these popped items into a new array, and then reverse
  it before pushing to the target column.
* We find a way to pop as many items at once as we need, and pushing them one-by-one to the target column.

The second option sounds better because:
* We can eliminate an ugly loop.
* PHP has a built-in function to pop multiple elements
* The `array_push` can accept multiple elements
* We have the chance to use the `...` spread-operator which is always a nice thing.

So the new code will look like this:

```php
// ... $storage

if ($fn = fopen(__DIR__.'/input.txt', 'r')) {
    while (($line = fgets($fn, 1024)) !== false) {
        $line = trim($line);
        $command = [];

        if (preg_match('/move (?P<slice>\d+) from (?P<from>\d+) to (?P<to>\d+)/', $line, $command)) {
            array_push($storage[$command['to']], ...array_splice($storage[$command['from']], -1 * $command['slice']));
        }
    }
    fclose($fn);
}

foreach ($storage as $column) {
    if (empty($column)) continue;
    echo end($column);
}

echo PHP_EOL;
```

We need to be careful with sticky keys on the keyboard, because I had an annoying debug session to figure out why I don't 
get the right result. The reason was, I used `array_slice()` and not `array_splice()`. Even with a typo the code was valid
but it gave an absolute wrong answer for the task.