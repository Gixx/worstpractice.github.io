---
layout: post
title: "Advent of Code - Day 9"
date: "2022-12-09 15:45:00 +0200"
level: 'ultra fucking advanced'
expiration: 'none'
illustration: 'advent-9.jpg'
illustrationCaption: 'Calendar icon by <a target="_blank" rel="noopener" href="https://pixabay.com/users/pinwhalestock-13691058/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=4623521">Kevin Sanderson</a> from <a target="_blank" rel="noopener" href="https://pixabay.com//?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=4623521">Pixabay</a>'
illustration_share: 'advent-9_600x600.jpg'
category: 'backend'
categoryLabel: 'Backend'
tags:   [advent, php]
tagLabels: ['Advent', 'PHP']
excerpt: 'The day I failed.'
keywords: "PHP, Advent of Code"
review: true
published: true
---

### The input data

A very basic data file:

* each row contains a character and a number separated by space
* the characters represent directions (up, right, down, left): `U`, `R`, `D`, `L`
* the numbers represent the distance/step

Task: we pull a rope in the given direction for the given distance, and we need to figure out,  

### Part one

I will be honest: it was tough. I went down to a super primitive level, and wrote a low-performing code just to do what
needs to be done and get the right result. Currently, I am not even sure, whether my code is actually working well or just
accidentally gives the right result. 

Should I share the code? Well, it's definitely the worst practice:

```php
<?php

$headX = 0;
$headY = 0;
$tailX = 0;
$tailY = 0;
$fields = [
    '0,0' => 1,
];

if ($fn = fopen(__DIR__ . '/input.txt', 'r')) {
    while (($line = fgets($fn, 1024)) !== false) {
        $line = trim($line);
        [$direction, $step] = explode(' ', $line);

        [$headX, $headY] = getNextHeadPosition($direction, $step, $headX, $headY);
        [$tailX, $tailY, $coordinates] = getNextTailPosition($direction, $headX, $headY, $tailX, $tailY);

        foreach ($coordinates as $coordinate) {
            if (!isset($fields[$coordinate])) {
                $fields[$coordinate] = 0;
            }

            $fields[$coordinate]++;
        }
    }
    fclose($fn);
}

function getNextHeadPosition(string $direction, int $step, int $currentHeadX, int $currentHeadY): array
{
    $newHeadX = match ($direction) {
        'L' => $currentHeadX - $step,
        'R' => $currentHeadX + $step,
        default => $currentHeadX
    };
    $newHeadY = match ($direction) {
        'U' => $currentHeadY + $step,
        'D' => $currentHeadY - $step,
        default => $currentHeadY
    };

    return [$newHeadX, $newHeadY];
}

function getNextTailPosition(string $direction, int $currentHeadX, int $currentHeadY, int $currentTailX, int $currentTailY): array
{
    /**
     * Corner touch positions:
     *
     *    ..T   ...   ...   T..
     *    .H.   .H.   .H.   .H.
     *    ...   ..T   T..   ...
     */
    $cornerTouch = abs($currentHeadX - $currentTailX) === 1 && abs($currentHeadY - $currentTailY) === 1;

    /**
     * Side touch positions:
     *
     *    .T.   ...   ...   ...
     *    .H.   .HT   .H.   TH.
     *    ...   ...   .T.   ...
     */
    $sideTouch = abs($currentHeadX - $currentTailX) + abs($currentHeadY - $currentTailY) === 1;

    // Head covers Tail
    $covers = $currentHeadX === $currentTailX && $currentHeadY === $currentTailY;

    $coordinates = [];

    // Tail doesn't need to move
    if ($cornerTouch || $sideTouch || $covers) {
        return [$currentTailX, $currentTailY, $coordinates];
    }

    $x = $currentTailX;
    $y = $currentTailY;

    // Head moved left
    if ($direction == 'L') {
        for ($i = $currentTailX; $i > $currentHeadX + 1; $i--) {
            // During horizontal moves the max absolute difference on the Y can be only one.
            if ($currentHeadY != $currentTailY) {
                $currentTailY = $y = $currentHeadY;
            }

            --$currentTailX;
            --$x;

            $coordinates[] = $x.','.$y;
        }
    }

    // Head moved left
    if ($direction == 'R') {
        for ($i = $currentTailX; $i < $currentHeadX - 1; $i++) {
            // During horizontal moves the max absolute difference on the Y can be only one.
            if ($currentHeadY != $currentTailY) {
                $currentTailY = $y = $currentHeadY;
            }

            ++$currentTailX;
            ++$x;

            $coordinates[] = $x.','.$y;
        }
    }

    // Head moved up
    if ($direction == 'U') {
        for ($i = $currentTailY; $i < $currentHeadY - 1; $i++) {
            // During vertical moves the max absolute difference on the X can be only one.
            if ($currentHeadX != $currentTailX) {
                $currentTailX = $x = $currentHeadX;
            }

            ++$currentTailY;
            ++$y;

            $coordinates[] = $x.','.$y;
        }
    }

    // Head moved down
    if ($direction == 'D') {
        for ($i = $currentTailY; $i > $currentHeadY + 1; $i--) {
            // During vertical moves the max absolute difference on the X can be only one.
            if ($currentHeadX != $currentTailX) {
                $currentTailX = $x = $currentHeadX;
            }

            --$currentTailY;
            --$y;

            $coordinates[] = $x.','.$y;
        }
    }

    return [$currentTailX, $currentTailY, $coordinates];
}

echo count($fields).PHP_EOL;
```

### Part two

I'm not proud of myself. This is the day I have to give up. I could pass part one, but this one requires skills that I 
don't have yet. I failed. I tried, but couldn't figure out the algorithm. I tried to reuse the functions from the part one,
but it was a complete failure as well. I'm too tired, sad and disappointed now to try again. I give up...

<a href="https://www.reddit.com/r/adventofcode/comments/zgq3nr/2022_day_9_rope_pull/" rel="noopener" target="_blank">This is how it should look like visualized.</a>

When I was thinking about the solution, I thought if I treat every knot as a rope-head for the next knot, it will work. But I
couldn't even reproduce the example outputs of the <a href="https://adventofcode.com/2022/day/9#part2" rel="noopener" target="_blank">task</a>.

Maybe later I will re-try and update this article... But not today.