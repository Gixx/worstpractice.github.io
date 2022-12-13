---
layout: post
title: "Advent of Code - Day 10"
date: "2022-12-10 15:00:00 +0200"
level: 'beginner'
expiration: 'none'
illustration: 'advent-10.jpg'
illustrationCaption: 'Calendar icon by <a target="_blank" rel="noopener" href="https://pixabay.com/users/pinwhalestock-13691058/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=4623521">Kevin Sanderson</a> from <a target="_blank" rel="noopener" href="https://pixabay.com//?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=4623521">Pixabay</a>'
illustration_share: 'advent-10_600x600.jpg'
category: 'backend'
categoryLabel: 'Backend'
tags:   [advent, php]
tagLabels: ['Advent', 'PHP']
excerpt: "After the rope adventure, it's nice to do some easy task. We will be TV technicians!"
keywords: "PHP, Advent of Code"
review: true
published: true
---

<a href="https://adventofcode.com/2022/day/10" rel="noopener" target="_blank">Today's puzzle</a> in short: we have a screen 
display and need to figure out what we draw on it.


### The input data

This time in the input file we get some nice programming commands:

* Each line contains exactly 1 command
* If the command is `noop`, it suppose to do nothing just takes one CPU cycle.
* It the command is `addx n`, it suppose to increment / decrement the *X* register by `n` (`n` can be negative). This 
  command takes two CPU cycle.

#### Game rules

* The `addx n` command first takes two CPU cycle, and only after that changes the register.

### Part one

Now we have to sum the X register's value in the 20th cycle and in every 40 cycles after that. This (with an additional
calculation) will give the `Signal Strength`'s value, what we need to give to pass the puzzle. 

#### The code

The code is so simple, I don't waste too many characters to describe, how it works. Check it yourself:

```php
$x = 1;
$cycle = 0;
$signalStrength = 0;

if ($fn = fopen(__DIR__ . '/input.txt', 'r')) {
    while (($line = fgets($fn, 1024)) !== false) {
        $line = trim($line);

        $cycle++;

        if ($cycle === 20 || ($cycle - 20) % 40 === 0) {
            $signalStrength += $cycle * $x;
        }

        if ($line != 'noop') {
            $cycle++;

            if ($cycle === 20 || ($cycle - 20) % 40 === 0) {
                $signalStrength += $cycle * $x;
            }

            [, $value] = explode(' ', $line);
            $x += (int) $value;
        }
    }
    fclose($fn);
}

echo $signalStrength.PHP_EOL;
```

### Part two

The part two is a bit more complex, but should not confuse anybody. Here we have a small `display screen` which is 40
characters wide and 6 characters tall. Luckily our input data contains exactly 240 CPU cycle (42 `noop` and 99 `addx` command).

So the input data is enough to fully fill the whole display with something. But with what? We move a `pixel` on this screen, 
and this pixel is 3 characters wide. The X register's actual value contains the position of the middle character.

We draw on the screen exactly one character in every CPU cycle. The drawing position's row and column is calculated from 
the CPU cycle.

* If the actual drawing position covers any of the three characters of the "pixel" - defined by X register - we draw `#`.
* If no covering, we draw `.`.

In the end we should see some ASCII art letters printed on the screen. These letters are the solution for the puzzle.

#### The code

The description is actually more complex than the solution:

* Concatenate every `#`s and `.`s together into a string. 
* We need to watch out for the screen size, when we reach the end, just add a line break.

```php
$x = 1;
$cycle = 0;
$signalStrength = 0;
$crt = '';
$pixelPosition = 0;

if ($fn = fopen(__DIR__ . '/input.txt', 'r')) {
    while (($line = fgets($fn, 1024)) !== false) {
        $line = trim($line);

        $cycle++;
        $crt .= getPixel($x, $pixelPosition);

        if ($line != 'noop') {
            $cycle++;
            $crt .= getPixel($x, $pixelPosition);

            [, $value] = explode(' ', $line);
            $x += (int) $value;
        }
    }
    fclose($fn);
}

function getPixel(int $x, int &$pixelPosition): string
{
    $pixel = ($x === $pixelPosition || $x - 1 === $pixelPosition || $x + 1 === $pixelPosition) ? '#' : '.';
    $pixelPosition++;

    if ($pixelPosition === 40) {
        $pixel .= PHP_EOL;
        $pixelPosition = 0;
    }

    return $pixel;
}

echo $crt.PHP_EOL;
```
