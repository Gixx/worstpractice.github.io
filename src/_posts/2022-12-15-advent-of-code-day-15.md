---
layout: post
title: "Advent of Code - Day 15"
date: "2022-12-15 16:25:00 +0200"
level: 'intermediate'
expiration: 'none'
illustration: 'advent-15.jpg'
illustrationCaption: 'Calendar icon by <a target="_blank" rel="noopener" href="https://pixabay.com/users/pinwhalestock-13691058/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=4623521">Kevin Sanderson</a> from <a target="_blank" rel="noopener" href="https://pixabay.com//?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=4623521">Pixabay</a>'
illustration_share: 'advent-15_600x600.jpg'
category: 'backend'
categoryLabel: 'Backend'
tags:   [advent, php]
tagLabels: ['Advent', 'PHP']
excerpt: 'This time the game is not the one it looks like for the first sight.'
keywords: "PHP, Advent of Code"
review: true
published: true
---

<a href="https://adventofcode.com/2022/day/15" rel="noopener" target="_blank">Today's puzzle</a> in short: we need to calculate
the <a href="https://en.wikipedia.org/wiki/Taxicab_geometry" rel="noopener" target="_blank">Manhattan distance</a> between
two points and measure the area you can cover with that distance.

Something like this: 

<iframe class="yt" width="281" height="500" src="https://www.youtube.com/embed/Wrp4EH5zd9I" title="Advent of code 2022 day 15." frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

### The input data

The input file is short, and basically simple too, if we ignore all the space filling text and just focus on the data:

Each line contains the following text (variable data is replaced with `#`):
```text
Sensor at x=#, y=#: closest beacon is at x=#, y=#
```

### Game rules

Rules are simple:

* Distance between coordinates are measured with the Manhattan distance.
* We need to determine every area that will be covered.

### The strategy

The difficulty in today's task is not the calculation itself, but the amount of calculation. We can easily run out of
process execution time limit, or what is worse: run out of memory.

So we have to do everything to reduce the number of data, that the script have to deal with.

The next important thing is, if you started filling areas like I did in the video, I have a bad news: that's the wrong
approach. We have to deal with **ranges**, and we need to merge **ranges** to solve both part one and two.

### Part one 

In part one, the question is how much area is covered by the sensors' signals on the 2000000th row. This is good hint, that
we need to focus only one specific line. So when we collect the sensors' and beacon's positions from the input data, we
can immediately calculate whether the covered area reaches the target line or not.

With this trick we can remove more than half of the original data from the upcoming calculations.

```php
$ranges = [];
const TARGET_ROW = 2000000;

if ($fn = fopen(__DIR__ . '/input.txt', 'r')) {
    while (($line = fgets($fn, 1024)) !== false) {
        $line = trim($line);

        $matches = [];

        if (preg_match('/^Sensor at x=(?P<sensorX>\d+), y=(?P<sensorY>\d+): closest beacon is at x=(?P<beaconX>\d+), y=(?P<beaconY>\d+)$/', $line, $matches)) {
            $manhattanX = abs($matches['sensorX'] - $matches['beaconX']);
            $manhattanY = abs($matches['sensorY'] - $matches['beaconY']);

            $distance = $manhattanX + $manhattanY;

            // If the signal area doesn't reach the target row, skip dealing with it.
            if (
                !(TARGET_ROW >= $matches['sensorY'] && TARGET_ROW <= $matches['sensorY'] + $distance) &&
                !(TARGET_ROW <= $matches['sensorY'] && TARGET_ROW >= $matches['sensorY'] - $distance)
            ) {
                continue;
            }

            $distanceDiff = 0;

            if (TARGET_ROW > $matches['sensorY']) {
                $distanceDiff = TARGET_ROW - $matches['sensorY'];
            }

            if (TARGET_ROW < $matches['sensorY']) {
                $distanceDiff = $matches['sensorY'] - TARGET_ROW;
            }

            $targetRowRangeStart = $matches['sensorX'] - $distance + $distanceDiff;
            $targetRowRangeStop = $matches['sensorX'] + $distance - $distanceDiff;

            $ranges[] = [$targetRowRangeStart, $targetRowRangeStop];
        }
    }
    fclose($fn);
}
```

With a simple regular expression, we can extract the coordinates that we need. Then with a simple algebra we can calculate
the maximal distance that a sensor can cover. Obviously when the sensor's `Y` coordinate plus the signal distance don't reach
the target line, we go on to the next sensor.

Then we have to calculate how much area will be covered on the given line. Simply subtract the two line numbers (the `Y` coordinates) 
and we get how much part of the distance will fall on the target line. With this simple calculation we get the start and 
end coordinates. And since we talk about one fix line number, we need to remember only the `X` coordinates, and the start
with the end together gives a **range**.

We collect all the ranges we can. Okay but the ranges may overlap! So we need to merge them:

```php
function mergeRanges($ranges): array
{
    usort($ranges, function($a, $b) {
        return $a[0] - $b[0];
    });

    $y = 0;
    $max = count($ranges);

    for ($i = 1; $i < $max; $i++)
    {
        if ($ranges[$i][0] > $ranges[$y][1] + 1) {
            $y = $i;
            continue;
        }

        if ($ranges[$y][1] < $ranges[$i][1]) {
            $ranges[$y][1] = $ranges[$i][1];
        }

        unset($ranges[$i]);
    }

    return array_values($ranges);
}

$usedPositionsOnTargetRow = 0;
$ranges = mergeRanges($ranges);

foreach ($ranges as $range) {
    $usedPositionsOnTargetRow += $range[1] - $range[0];
}

echo $usedPositionsOnTargetRow.PHP_EOL;
```

I will be honest: probably I could solve the logic of merging ranges myself, but sometimes I like to be a lazy _M.F._ and look
solutions for "simple" problems on the <a href="https://stackoverflow.com/questions/3630500/merging-overlapping-ranges-in-php-arrays" rel="noopener" target="_blank">Stackowerflow</a>.

Anyway, PHP should have a built-in function for this, shouldn't it?

So we merged the ranges, then we need only count the covered areas.

### Part two

In part two they twisted on the story and made **every line as target line**. Great, that will definitely eat up the Earth's
resources. Luckily they gave some discount on the rules. 

Now we have to take consider ranges between 0 and 4000000. And we have to find the one single spot, that is not covered by
any of the sensor's signal.

I think, this will be still too much for any average home computer, so we still need to remove as many data as possible.

```php
$allRanges = [];
const MIN_RANGE_START = 0;
const MAX_RANGE_STOP = 4000000;
const FREQUENCY_MULTIPLIER = 4000000;

set_time_limit(500);

if ($fn = fopen(__DIR__ . '/input.txt', 'r')) {
    while (($line = fgets($fn, 1024)) !== false) {
        $line = trim($line);
        $matches = [];

        if (preg_match('/^Sensor at x=(?P<sensorX>\d+), y=(?P<sensorY>\d+): closest beacon is at x=(?P<beaconX>\d+), y=(?P<beaconY>\d+)$/', $line, $matches)) {
            $manhattanX = abs($matches['sensorX'] - $matches['beaconX']);
            $manhattanY = abs($matches['sensorY'] - $matches['beaconY']);

            $distance = $manhattanX + $manhattanY;
            $targetRow = $matches['sensorY'] - $distance;

            while ($targetRow <= $matches['sensorY'] + $distance) {
                $distanceDiff = 0;

                if ($targetRow > $matches['sensorY']) {
                    $distanceDiff = $targetRow - $matches['sensorY'];
                }

                if ($targetRow < $matches['sensorY']) {
                    $distanceDiff = $matches['sensorY'] - $targetRow;
                }

                $targetRowRangeStart = $matches['sensorX'] - $distance + $distanceDiff;
                $targetRowRangeStop = $matches['sensorX'] + $distance - $distanceDiff;

                // Add ranges only within the limits
                if ($targetRowRangeStart <= MAX_RANGE_STOP && $targetRowRangeStop >= MIN_RANGE_START) {
                    if (!isset($allRanges[$targetRow])) {
                        $allRanges[$targetRow] = [];
                    }

                    $allRanges[$targetRow][] = [
                        max(MIN_RANGE_START, $targetRowRangeStart),
                        min(MAX_RANGE_STOP, $targetRowRangeStop)
                    ];
                }
                $targetRow++;
            }
        }
    }
    fclose($fn);
}
```

Parsing the information works in the same way, but now we collect the ranges from every row and for every sensor.

I already had to increase the time limit, since it will be dead slow. I tell you now, the `$allRanges` array will have 
more than 6 million elements, which elements are many-many arrays of range pairs.

PHP and arrays: straight way into the memory leak hell. But luckily it is still manageable. So we need to run the `mergeRanges()`
function more than 6 million times! God, give me strength!

As the Advent of Code's challenges are all prepared well, and they don't want to trick you out or provide multiple possible
results, we can bravely assume that this task has one, and only one valid result.

This way, when we start merging the ranges, we immediately stop as soon as we get two ranges after the merge. Because it
means there's an empty area between them. And because we trust the guys at _AoC_, we blindly believe the area is exactly
one specific coordinate and no more.

```php
function mergeRanges($ranges): array
{
    // ...
}

$distressY = 0;
$distressX = 0;

foreach ($allRanges as $targetRow => $ranges) {
    $ranges = mergeRanges($ranges);

    if (count($ranges) > 1) {
        $distressY = $targetRow
        $distressX = $ranges[0][1] + 1;
        break;
    }
}

echo "Distress signal source: X = $distressX, Y = $distressY, Frequency = ". ($distressX * FREQUENCY_MULTIPLIER + $distressY) . PHP_EOL;
```
