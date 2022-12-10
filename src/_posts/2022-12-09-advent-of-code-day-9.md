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

Should I share the code? Well, it's definitely the worst practice.

### Part two

I'm not proud of myself. This is the day I have to give up. I could pass part one, but this one requires skills that I 
don't have yet. I failed. I tried, but couldn't figure out the algorithm. I tried to reuse the functions from the part one,
but it was a complete failure as well. I'm too tired, sad and disappointed now to try again. I give up...

<a href="https://www.reddit.com/r/adventofcode/comments/zgq3nr/2022_day_9_rope_pull/" rel="noopener" target="_blank">This is how it should look like visualized.</a>

When I was thinking about the solution, I thought if I treat every knot as a rope-head for the next knot, it will work. But I
couldn't even reproduce the example outputs of the <a href="https://adventofcode.com/2022/day/9#part2" rel="noopener" target="_blank">task</a>.

Maybe later I will re-try and update this article... But not today.

### The next day

I was very upset that I couldn't figure out the solution, so I spent my whole Saturday (10th of December) to find a solution.
I analyzed the example in the puzzle description and watched that reddit video of the working solution a million times to
understand the logic behind it. And then I just found it. 

The solution I made for the part one was a total dead end, no wonder why lead me to nowhere. Yes, it accidentally gave the 
right result, but it was a disaster.

The new, working code covers both part one and two, you need only change the value of the `ROPE_LENGTH` constant. I also 
added a print function to be able to visualize the result. For the puzzle example, it will look something like this:

<figure class="a-illustration">
    <img class="a-illustration__image" src="/assets/img/post-illustration-placeholder.png" data-src="/assets/img/blog/2022/backend/advent-of-code-day-9/example.png" width="707">
    <figcaption class="a-illustration__caption">Output sample of the rope pull puzzle.</figcaption>
</figure>

### The Code

```php
const ROPE_LENGTH = 10;

$knotPositions = array_fill(0, ROPE_LENGTH, [0,0]);
$moves = [];
$headX = 0;
$headY = 0;
$visitedByTail = [
    '0,0' => 1,
];

$minY = 0;
$maxY = 0;
$row = 1;

if ($fn = fopen(__DIR__ . '/input.txt', 'r')) {
    while (($line = fgets($fn, 1024)) !== false) {
        $line = trim($line);
        [$direction, $steps] = explode(' ', $line);

        for ($i = 0; $i < $steps; $i++) {
            switch ($direction) {
                case 'U':
                    $headY++;
                    break;
                case 'R':
                    $headX++;
                    break;
                case 'D':
                    $headY--;
                    break;
                case 'L':
                    $headX--;
            }

            $knotPositions[0] = [$headX, $headY];
            $minY = min($minY, $headY);
            $maxY = max($maxY, $headY);

            for ($j = 1; $j < ROPE_LENGTH; $j++) {
                moveKnot($j, $knotPositions);
            }

            $coordinate = $knotPositions[ROPE_LENGTH - 1][0].','.$knotPositions[ROPE_LENGTH - 1][1];

            if (!isset($visitedByTail[$coordinate])) {
                $visitedByTail[$coordinate] = 0;
            }

            $visitedByTail[$coordinate]++;

            deleteLines($minY, $maxY);
            printStep(
                moveIndex: $row,
                stepIndex: $i + 1,
                direction: $direction,
                knotPositions: $knotPositions,
                visitedByTail: $visitedByTail,
                minY: $minY,
                maxY: $maxY
            );
        }
        $row++;
    }
    fclose($fn);
}
function moveKnot(int $knotIndex, array &$knotPositions): void
{
    [$currentTailX, $currentTailY] = $knotPositions[$knotIndex];
    [$previousTailX, $previousTailY] = $knotPositions[$knotIndex - 1];

    $diffX = abs($previousTailX - $currentTailX);
    $diffY = abs($previousTailY - $currentTailY);

    if ($diffX < 2 && $diffY < 2) {
        return;
    }

    $currentTailX += ($diffX === 0 && $diffY > 1)
        ? 0
        : ($previousTailX - $currentTailX > 0 ? 1 : -1);

    $currentTailY += ($diffX > 1 && $diffY === 0)
        ? 0
        : ($previousTailY - $currentTailY > 0 ? 1 : -1);

    $knotPositions[$knotIndex] = [$currentTailX, $currentTailY];
}

function deleteLines(int $minY, int $maxY): void
{
    for ($y = max($maxY +6, 20); $y >= min($minY -5, -20) -2; $y--) {
        echo "\r\x1b[K"; // remove this line
        echo "\033[1A\033[K";
    }
}

function printStep(
    int $moveIndex,
    int $stepIndex,
    string $direction,
    array $knotPositions,
    array $visitedByTail,
    int $minY,
    int $maxY
): void {
    $matrix = [];
    // Prepare matrix
    for ($y = max($maxY +5, 20); $y >= min($minY -5, -20); $y--) {
        for ($x = -180; $x <= 40; $x++) {
            $matrix[$y][$x] = ' ';

            if ($y === 0) {
                $matrix[$y][$x] = '─';
            }

            if ($x === 0) {
                $matrix[$y][$x] = '|';
            }
        }
    }

    foreach ($visitedByTail as $coordinate => $times) {
        [$x, $y] = explode(',', $coordinate);
        $matrix[$y][$x] = '.';
    }

    // Place markers
    for ($i = ROPE_LENGTH - 1; $i >= 0; $i--) {
        $sign = $i === 0 ? 'H' : $i;
        $matrix[$knotPositions[$i][1]][$knotPositions[$i][0]] = $sign;
    }

    echo "Move #$moveIndex | Step #$stepIndex into $direction".PHP_EOL;

    foreach ($matrix as $index => $row) {
        echo str_pad($index, 4, ' ', STR_PAD_LEFT).'. '.implode($row).PHP_EOL;
    }

    echo '      ';
    for ($x = -180; $x <= 40; $x++) {
        echo ($x % 5 === 0) ? '|' : "'";
    }
    echo PHP_EOL;

    usleep(100000);
}

echo count($visitedByTail).PHP_EOL;
```
