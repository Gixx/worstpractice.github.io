---
layout: post
title: "Advent of Code - Day 14"
date: "2022-12-14 18:25:00 +0200"
level: 'beginner'
expiration: 'none'
illustration: 'advent-14.jpg'
illustrationCaption: 'Calendar icon by <a target="_blank" rel="noopener" href="https://pixabay.com/users/pinwhalestock-13691058/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=4623521">Kevin Sanderson</a> from <a target="_blank" rel="noopener" href="https://pixabay.com//?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=4623521">Pixabay</a>'
illustration_share: 'advent-14_600x600.jpg'
category: 'backend'
categoryLabel: 'Backend'
tags:   [advent, php]
tagLabels: ['Advent', 'PHP']
excerpt: 'A nice sand-fall game, with very simple logic.'
keywords: "PHP, Advent of Code"
review: true
published: true
---

<a href="https://adventofcode.com/2022/day/14" rel="noopener" target="_blank">Today's puzzle</a> in short: If you ever played
to the original <a href="https://en.wikipedia.org/wiki/Boulder_Dash" rel="noopener" target="_blank">Boulder Dash</a> game 
in the '80s, you know what this game is about.

If you didn't, well here's a very nice example from the game, that also highlights the physics, that we need to re-create:
<iframe class="yt" width="560" height="315" src="https://www.youtube-nocookie.com/embed/Nj-ldSUTFCg?start=17" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### The input data

This time the input data is pretty complex: simulates drawing horizontal and vertical lines.

* Each line contains chained coordinates:
  * X and Y coordinates are separated by comma,
  * positions are separated by ` -> `.
* Between coordinates the ` -> ` represents a vector (movement), so the coordinates on its sides are start and end points 
  of a continuous line (range).
* The coordinates are counted left to right, top to bottom.

#### Game rules

The given 2 dimensional data set represents the 2D schema of a cave:

* Where we draw according to the coordinates and vectors, there are rocks.
* The remaining space is void air.
* There's a leak on the roof at the coordinates 500,0.

On the leak, sand flows inside the cave and fill it up:
* 1 piece of sand falls at a time.
* It can fall 1 unit on our map at a time.
* If it hits a rock and there's free space 1 unit down on left, it continues falling there.
* If it hits a rock and there's free space 1 unit down on right, it continues falling there.
* If it hits a rock and there's no free space 1 unit down on any of the sides, it takes a rest and the next piece of sand start the process again.

### The Data model

The most difficult part of the code was actually parsing the input and create the matrix of the used spaces:

```php

$cave = [];

if ($fn = fopen(__DIR__ . '/input.txt', 'r')) {
    $row = 0;
    while (($line = fgets($fn, 1024)) !== false) {
        $line = trim($line);

        $coordinates = explode(' -> ', $line);

        $previousX = null;
        $previousY = null;

        foreach ($coordinates as $coordinate) {
            [$x, $y] = explode(',', $coordinate);

            if ($previousX === null && $previousY === null) {
                $cave[$y][$x] = '#';
                $previousX = $x;
                $previousY = $y;
                continue;
            }

            $distanceX = $previousX - $x;
            $distanceY = $previousY - $y;

            if ($distanceX != 0) {
                $iteratorX = $distanceX < 0 ? -1 : 1;

                for ($i = $x; $i != $previousX; $i += $iteratorX) {
                    $cave[$y][$i] = '#';
                }
            }

            if ($distanceY != 0) {
                $iteratorY = $distanceY < 0 ? -1 : 1;

                for ($j = $y; $j != $previousY; $j += $iteratorY) {
                    $cave[$j][$x] = '#';
                }
            }

            $previousX = $x;
            $previousY = $y;
        }

    }
    fclose($fn);
}
```

The only difficulty here is to calculate the ranges well and fill all the fields between the actual and previous coordinates. 

### Part 1

The map shows no ground for the cave, so the sand can fall into the eternity. We need to count the amount of sand remain on
the rocks when the first piece falls to the nowhere.

```php
$maxY = 0;

foreach ($cave as $y => $columns) {
    $maxY = max($maxY, $y);
}

$restingSandCounter = 0;
$y = 0;
$x = 500;

do {
    $tmp = $cave;
    $tmp[$y][$x] = 'o';

    if (!isset($tmp[$y + 1][$x])) {
        $y++;
    } elseif (!isset($tmp[$y + 1][$x - 1])) {
        $y++;
        $x--;
    } elseif (!isset($tmp[$y + 1][$x + 1])) {
        $y++;
        $x++;
    } else {
        $cave[$y][$x] = "o";
        $y = 0;
        $x = 500;
        $restingSandCounter++;
    }
} while (($y < $maxY + 2));

echo $restingSandCounter.PHP_EOL;
```

Here we need to check how far is the bottom of the last rock from the top. We set the position of the leak, then start the
process. Any sand piece that passes that height will stop the process. In the simple `do ... while` loop we apply the 
physics rules and as soon as a sand piece finds its place, we increment the counter that will give the solution for the puzzle.

In every loop we add the sand to our `$cave`, so the next piece of sand can count with it.

We maybe could use `ksort()` to sort the `$cave` array by keys order to get the highest key, but I didn't want to ruin
the structure we built, maybe in the next part we need it.

### Part 2

Now we realize, there's a ground in the cave, actually we stand on it. We need to count how much sand can fill the cave
according to the rules until the leak gets blocked. The process is the same, only some initialization and loop check changed:

```php
$cave = [0 => [500 => '+']];

if ($fn = fopen(__DIR__ . '/input.txt', 'r')) {
    // ...
}
```

Now we have the same cave created, but now we need to add the ground to it. The game description says it can be infinite, 
but that's something that not easy to do with arrays, and also unnecessary. I guessed if the maximum height tripled in both
directions is enough to not get into an infinite loop in the end:

```php
$maxY += 2;
$minX = 500 - (3 * $maxY);
$maxX = 500 + (3 * $maxY);

for ($i = $minX; $i < $maxX; $i++) {
    $cave[$maxY][$i] = '#';
}
```

I didn't make any proper calculations on it, simply tried out:
* multiplying with two ended in an infinite loop (or I was just impatient)
* multiplying with three worked.

As the `$maxY` was the bottom of the last rock, we had to add 2 more units to the height:
* One for an empty air (where we are too)
* One for the ground (that we stand on).

The rest is almost the same, only the while expression changes:

```php
do {
    /// ...
} while (($cave[0][500] != "o"));

echo $restingSandCounter.PHP_EOL;
```

### Bonus

I'm a visual type guy. I can understand everything better, if I can see it. So for this puzzle too, I made a print function
which I didn't add to the code samples, since it won't work on the full data set.

But it was good enough to print the initial state of our cave:

<figure class="a-illustration">
    <img class="a-illustration__image" src="/assets/img/post-illustration-placeholder.png" data-src="/assets/img/blog/2022/backend/advent-of-code-day-14/cave.png" width="344">
    <figcaption class="a-illustration__caption">Output sample of the </figcaption>
</figure>