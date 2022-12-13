---
layout: post
title: "Advent of Code - Day 12"
date: "2022-12-12 15:45:00 +0200"
level: 'intermediate'
expiration: 'none'
illustration: 'advent-12.jpg'
illustrationCaption: 'Calendar icon by <a target="_blank" rel="noopener" href="https://pixabay.com/users/pinwhalestock-13691058/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=4623521">Kevin Sanderson</a> from <a target="_blank" rel="noopener" href="https://pixabay.com//?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=4623521">Pixabay</a>'
illustration_share: 'advent-12_600x600.jpg'
category: 'backend'
categoryLabel: 'Backend'
tags:   [advent, php]
tagLabels: ['Advent', 'PHP']
excerpt: 'I would climb the mountain high, so high, to be able to touch the sky.'
keywords: "PHP, Advent of Code"
review: true
published: true
---

<a href="https://adventofcode.com/2022/day/12" rel="noopener" target="_blank">Today's puzzle</a> in short: <span lang="jp" title="Climb mount Niitaka">新高山登れ</span>

### The input data

We get a file with a bunch of alphabetical characters:

* The input has 41 lines and 71 columns
* Every character represents the height of the surface:
  * `a` is the lowest
  * `z` is the highest
  * `b` is 1 level higher than `a`
  * `c` is 1 level higher than `b`
  * ...
  * `z` is 1 level higher than `y`
* `S` represents the start point
* `E` represents the end point

#### Game rules

One step at a time to a neighboring field only when:
* the neighbor field is maximum one level higher
* ... or equal to the current one
* or lower (with any level) then the current one

Our task is get from `S` to `E` in the shortest possible way.

### The data model

Since part one and two are almost the same (again), I start with the common part. First we need to define a class to represent a
field on the height map and also store the neighbor fields:

```php
class Position
{
    public ?Position $top = null;
    public ?Position $right = null;
    public ?Position $bottom = null;
    public ?Position $left = null;
    public bool $isVisited = false;
    public ?int $distance = null;

    public function __construct(public int $row, public int $col, public int $height, public bool $isEnd)
    {}

    /**
     * @return array<int, Position>
     */
    public function getNeighbors(): array
    {
        $neighbors = [];

        if ($this->top !== null) {
            $neighbors[] = $this->top;
        }

        if ($this->right !== null) {
            $neighbors[] = $this->right;
        }

        if ($this->bottom !== null) {
            $neighbors[] = $this->bottom;
        }

        if ($this->left !== null) {
            $neighbors[] = $this->left;
        }

        return $neighbors;
    }
}
```

So we can instantiate this class  with some basic information:
* the vertical and horizontal position on the map,
* the height of the field,
* a flag whether it's the target field or not.

For the neighboring fields we created four nullable properties. Obviously the fields on the sides at least one neighbor is `NULL`.
We also add a function to collect all non-NULL neighbors.

Now it's time to create the height map from the input data:

```php
/** @var array<int, array<int, Position>> $heightMap */
$heightMap = [];
/** @var array<int,Position> $startPositions */
$startPositions = [];

// Read file and fill the height map with positions
if ($fn = fopen(__DIR__ . '/input.txt', 'r')) {
    $row = 0;
    while (($line = fgets($fn, 1024)) !== false) {
        $line = trim($line);
        $letters = str_split($line);
        $cols = count($letters);
        $heightMap[$row] = [];

        foreach ($letters as $col => $character) {
            $height = match($character)
            {
                'S' => 1,
                'E' => ord('z') - ord('a') + 1,
                default => ord($character) - ord('a') + 1
            };
            $position = new Position(
                row: $row,
                col: $col,
                height: $height,
                isEnd: $character === 'E'
            );

            if ($character === 'S') {
                $startPositions[] = $position;
            }

            $heightMap[$row][$col] = $position;
        }

        $row++;
    }
    fclose($fn);
}
```

Although for part one there's only one start position, I use an array to store it, because in part two there are multiple
start positions, so my goal is to achieve both tasks with the less work.

The trick here is the same I used before: convert the characters into numbers. This way, I will get mutually exclusive correspondence:
* for `a` we will get `1`,
* for `b` we will get `2`,
* ...
* for `z` we will get `26`.

There are the two special cases:
* for `S` we set the height to `1` and add the current position to the `$startPositions`,
* for `E` we set the height to `26` and use this information on the `Position`'s constructor.

The only reason is to store these `Position` instances in a multidimensional array is to keep the relative positions between
the fields. Therefore, we have all to `Position`s, so we can link the neighbors by reference.

But we do it smart: we link the neighbor field only when it fulfills the <a href="#game-rules">Game rules</a>:
```php
foreach ($heightMap as $row => $cols) {
    foreach ($cols as $col => $position) {
        if (isset($heightMap[$row - 1][$col])) {
            $top = $heightMap[$row - 1][$col];

            if ($position->height + 1 >= $top->height) {
                $position->top = $top;
            }
        }

        if (isset($cols[$col + 1])) {
            $right = $cols[$col + 1];

            if ($position->height + 1 >= $right->height) {
                $position->right = $right;
            }
        }

        if (isset($heightMap[$row + 1][$col])) {
            $bottom = $heightMap[$row + 1][$col];

            if ($position->height + 1 >= $bottom->height) {
                $position->bottom = $bottom;
            }
        }

        if (isset($cols[$col - 1])) {
            $left = $cols[$col - 1];

            if ($position->height + 1 >= $left->height) {
                $position->left = $left;
            }
        }
    }
}
```

Now, we have the `Position`s properly initializes, it's time to  find the path. For this I create a new class, called `Path`:

```php
class Path
{
    /** @var array<int array<int, int>> */
    public array $distanceMap = [];
    /** @var array<int, Position>  */
    public array $queue = [];
    public ?Position $endPosition = null;

    public function __construct(public Position $startPosition, public int $rows, public int $cols)
    {
        $tmp = array_fill(0, $this->cols, null);
        $this->distanceMap = array_fill(0, $this->rows, $tmp);
        $this->startPosition->distance = 0;
        $this->queue[] = $startPosition;
    }

    public function findPath(): void
    {
        do {
            $current = array_shift($this->queue);

            if ($current->isEnd) {
                $this->endPosition = $current;
                break;
            }
            
            if ($current->isVisited) {
                continue;
            }
            $current->isVisited = true;

            if ($this->distanceMap[$current->row][$current->col] === null) {
                $this->distanceMap[$current->row][$current->col] = $current->distance;
            }

            $neighbors = $current->getNeighbors();
            foreach ($neighbors as $position) {
                if ($position->distance === null) {
                    $position->distance = $current->distance + 1;
                }
            }

            $this->queue = array_merge($this->queue, $neighbors);
        } while (!empty($this->queue));
    }

    public function printDistanceMap(): void
    {
        for ($row = 0; $row < $this->rows; $row++) {
           for ($col = 0; $col < $this->cols; $col++) {
               echo str_pad($this->distanceMap[$row][$col], 5, ' ', STR_PAD_BOTH).' |';
           }
           echo PHP_EOL;
           echo str_repeat('------+', $this->cols).PHP_EOL;
        }
    }
}
```

To start, we need to initialize this class with the `$startPosition` and number of rows and columns of the height map.
Inside this class we will create a new "map", a multidimensional array to track the distance, we already climbed.

We will also need a queue know how many `Position`s more we need to climb. The path find process ends in two cases:

* we reach the _End_,
* we run out of `Position`s in the queue.

Upon instantiation, we add the `$startPosition` directly into the queue. Then we call the `findPath()` public method, that
will start the search:

* It takes the first element out from the queue.
* If the current `Position` is the _End_, we save the `Position` in to the `endPosition` property and stop the process.
* If the current `Position` is marked as already visited, we skip to the next `Position` in the queue. We can do that, because
  when we visited it earlier, that means we already added all its neighbors to the queue.
* Mark the current `Position` as visited.
* If the current `Position` is not yet recorded in the `distanceMap`, we save the `Position`'s distance into it.
* We get the current `Position`'s neighbors. And check one-by-one:
  * If the given neighbor has no distance set, we set the current `Position`'s distance, plus one.
* Merge the neighbors into the queue. Most likely there will be a ton of redundancy in the queue, but the `isVisited` check
  will fasten up the process.

I also added a `printDistanceMap` method to visualize, which `Position`s were checked during the process.

### Part one

Now we have everything to complete the task. Here we have one fix starting point, so our script will look like the following:

```php
$rows = count($heightMap);
$cols = count($heightMap[0]);

$path = new Path(
    startPosition: $startPositions[0],
    rows: $rows,
    cols: $cols
);
$path->findPath();

echo $path->endPosition->distance.PHP_EOL;
```

### Part two

Here we have to take all the level 1 fields as start point, and find the shortest of them all. For this, we need to modify
our part one code only a bit:

```php
// ...
if ($fn = fopen(__DIR__ . '/input.txt', 'r')) {
    // ...
    while (($line = fgets($fn, 1024)) !== false) {
        // ...
        foreach ($letters as $col => $character) {
            // ...
            if ($height === 1) {
                $startPositions[] = $position;
            }
            // ...
        }
        // ...
    }
    // ...
}

// ...

$minimalPath = PHP_INT_MAX;

foreach ($startPositions as $start) {
    $path = new Path(
        startPosition: $start,
        rows: $rows,
        cols: $cols
    );
    $path->findPath();

    if ($path->endPosition) {
        $minimalPath = min($minimalPath, $path->endPosition->distance);
    }

    for ($row = 0; $row < $rows; $row++) {
        for ($col = 0; $col < $cols; $col++) {
            $heightMap[$row][$col]->isVisited = false;
            $heightMap[$row][$col]->distance = null;
        }
    }
}

echo $minimalPath.PHP_EOL;
```