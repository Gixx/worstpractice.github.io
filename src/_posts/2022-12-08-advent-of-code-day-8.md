---
layout: post
title: "Advent of Code - Day 8"
date: "2022-12-08 12:45:00 +0200"
level: 'beginner'
expiration: 'none'
illustration: 'advent-8.jpg'
illustrationCaption: 'Calendar icon by <a target="_blank" rel="noopener" href="https://pixabay.com/users/pinwhalestock-13691058/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=4623521">Kevin Sanderson</a> from <a target="_blank" rel="noopener" href="https://pixabay.com//?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=4623521">Pixabay</a>'
illustration_share: 'advent-8_600x600.jpg'
category: 'backend'
categoryLabel: 'Backend'
tags:   [advent, php]
tagLabels: ['Advent', 'PHP']
excerpt: 'It is winter, we have to do some lumber job. But first we need to find the right trees.' 
keywords: "PHP, Advent of Code"
review: true
published: true
---

<a href="https://adventofcode.com/2022/day/8" rel="noopener" target="_blank">Today's puzzle</a> in short: we have a 
99&nbsp;x&nbsp;99 matrix filled with numbers. We need to check neighbor elements (top, right, bottom, left) and find the
right value according to the task's criteria

### The input data

It's a simple file filled with numbers:

* 99 rows
* 99 decimals in a row (0 through 9)

#### Game rules

The matrix is a forest. Each number represents the height of a tree:

* 0 is a very short tree
* 9 is a very tall tree

Our task is to return values defined by the tasks.

### Common code

Like yesterday, we have some common code that is the same in both tasks. Namely, to read the input file and create the
matrix. So let's do it:

```php
$forest = [];

if ($fn = fopen(__DIR__ . '/input.txt', 'r')) {
    while (($line = fgets($fn, 1024)) !== false) {
        $line = trim($line);

        $forest[] = str_split($line);

    }
    fclose($fn);
}

$rows = count($forest);
$columns = count($forest[0]);
```

Although we know the input contains 99 rows and columns, we prepare for changes. 

### Part one

We need to find, how many trees are visible from outside the forest:

* trees on the edges are visible by default
* an inner tree is visible only when there are smaller trees in any of the four directions 

For this task we have a big help: the trees on the edges are automatically visible, so we can do a fast calculation
(2 times the rows and 2 times the columns, minus four for the four corners which we counted twice), and save time and energy 
on the `for` loops. Then just iterate through the "inner" matrix and do the math:

```php
$allVisibleTrees = (2 * $rows) + (2 * $columns) - 4;

for ($i = 1; $i < $rows - 1; $i++) {
    for ($j = 1; $j < $columns - 1; $j++) {
        if (isInnerTreeVisible($i, $j, $forest)) {
            $allVisibleTrees++;
        }
    }
}

function isInnerTreeVisible(int $row, int $column, array $matrix): bool
{
    $rowNumber = count($matrix);
    $columnNumber = count($matrix[0]);
    $actualHeight = (int) $matrix[$row][$column];
    $topHighest = 0;
    $rightHighest = 0;
    $bottomHighest = 0;
    $leftHighest = 0;

    // top
    for ($i = $row - 1; $i >= 0; $i--) {
        $topHighest = max($topHighest, $matrix[$i][$column]);
    }

    // right
    for ($i = $column + 1; $i < $columnNumber; $i++) {
        $rightHighest = max($rightHighest, $matrix[$row][$i]);
    }

    // bottom
    for ($i = $row + 1; $i < $rowNumber; $i++) {
        $bottomHighest = max($bottomHighest, $matrix[$i][$column]);
    }

    // left
    for ($i = $column - 1; $i >= 0; $i--) {
        $leftHighest = max($leftHighest, $matrix[$row][$i]);
    }
    
    return $actualHeight > $topHighest
        || $actualHeight > $rightHighest
        || $actualHeight > $bottomHighest;
        || $actualHeight > $leftHighest
}

echo $allVisibleTrees.PHP_EOL;
```

Well, it's not pretty, and deal with four `for` loops in a function that is called within a `for` loop which is itself in
another `for` loop is anything but fast. But it's not a business code, just a local script, so I can bravely focus on the
goal.

### Part two

Now, we need to invert the logic and check for each tree, how far can you see from the top of the given tree:
* If the next tree in any direction is the same height or higher than the current tree, we stop counting the distance, that is the furthest
tree. 
* Trees on the edges have at least one direction where there are no more trees, so those distances will be zero.
* We have to calculate the "scenic score" of every tree: multiply the view distance of each direction.

Again, we can save a lot of time and energy by skipping the trees on the edges, because their scenic score will be zero
by the rules.

```php
$highestScenicScore = 0;

for ($i = 1; $i < $rows - 1; $i++) {
    for ($j = 1; $j < $columns - 1; $j++) {
        $highestScenicScore = max($highestScenicScore, getTreeScenicScore($i, $j, $forest));
    }
}

function getTreeScenicScore(int $row, int $column, array $matrix): int
{
    $rowNumber = count($matrix);
    $columnNumber = count($matrix[0]);

    $actualHeight = $matrix[$row][$column];

    $scoreTop = 0;
    $scoreRight = 0;
    $scoreBottom = 0;
    $scoreLeft = 0;

    // top
    for ($i = $row - 1; $i >= 0; $i--) {
        $scoreTop++;

        if ($matrix[$i][$column] >= $actualHeight) {
            break;
        }
    }

    // right
    for ($i = $column + 1; $i < $columnNumber; $i++) {
        $scoreRight++;

        if ($matrix[$row][$i] >= $actualHeight) {
            break;
        }
    }

    // bottom
    for ($i = $row + 1; $i < $rowNumber; $i++) {
        $scoreBottom++;

        if ($matrix[$i][$column] >= $actualHeight) {
            break;
        }
    }

    // left
    for ($i = $column - 1; $i >= 0; $i--) {
        $scoreLeft++;

        if ($matrix[$row][$i] >= $actualHeight) {
            break;
        }
    }

    return $scoreTop * $scoreRight * $scoreBottom * $scoreLeft;
}

echo $highestScenicScore.PHP_EOL;
```