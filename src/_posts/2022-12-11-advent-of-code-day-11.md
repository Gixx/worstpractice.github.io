---
layout: post
title: "Advent of Code - Day 11"
date: "2022-12-11 15:45:00 +0200"
level: 'intermediate'
expiration: 'none'
illustration: 'advent-11.jpg'
illustrationCaption: 'Calendar icon by <a target="_blank" rel="noopener" href="https://pixabay.com/users/pinwhalestock-13691058/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=4623521">Kevin Sanderson</a> from <a target="_blank" rel="noopener" href="https://pixabay.com//?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=4623521">Pixabay</a>'
illustration_share: 'advent-11_600x600.jpg'
category: 'backend'
categoryLabel: 'Backend'
tags:   [advent, php]
tagLabels: ['Advent', 'PHP']
excerpt: "These monkeys always steal the man's valuables. We need to get back, just need to figure out where they land next."
keywords: "PHP, Advent of Code"
review: true
published: true
---

<a href="https://adventofcode.com/2022/day/11" rel="noopener" target="_blank">Today's puzzle</a> in short: monkeys have
their own rule how to choose who to pass the stolen items. We need to figure this out.

### The input data

The input data is way too complex to start parsing it. Instead, I chose to build the right data models from them.

#### Game rules 

So every monkey can have any number of items. With different calculation each monkey can determine how worried are we about 
the item he/she/it is investigating at the moment. According to this worry level he/she/it passes the item either "left" or "right".

The topmost two monkeys who investigate the most items will give the puzzle result.

### The data model

As I wrote before, it's better to build up the data model from code, rather than parsing the input file:

```php
class Monkey
{
    public const WORRY_DIVIDER = 3;
    public Monkey $targetTrue;
    public Monkey $targetFalse;

    public int $inspectionCounter = 0;

    public array $items = [];
    public function __construct(
        public int $index = 0,
        public array $nextRoundItems = [],
        public string $operand = '$old',
        public int $testWorryIndex = 1
    )
    {
    }
    public function runTest(): void
    {
        $this->setupNextRound();

        foreach ($this->items as $item) {
            $this->testWorry($item);
        }
    }

    private function getNewWorry(int $old): int
    {
        return (int) eval('return '.($this->operand).';');
    }


    private function testWorry(int $worry): void
    {
        $newWorry = $this->getNewWorry($worry);
        $testWorry = floor($newWorry / self::WORRY_DIVIDER);
        $this->inspectionCounter++;

        if ($testWorry % $this->testWorryIndex === 0) {
            $this->targetTrue->nextRoundItems[] = $testWorry;
        } else {
            $this->targetFalse->nextRoundItems[] = $testWorry;
        }
    }

    private function setupNextRound(): void
    {
        $this->items = $this->nextRoundItems;
        $this->nextRoundItems = [];
    }
}
```

I made a dirty trick here: I used the hatred `eval()` function. The only reason to do this to simplify the final code.
This way I can create a common class for each monkey, and I need only to pass their "calculation logic" as a string.

As you can see, I don't pass the investigated items directly to the next monkey's hand, instead, I just put into their "pockets",
so won't mess up the investigation cycle. Then in the beginning of the next cycle each Monkey get the items out from their 
"pocket" and the whole thing starts all over.

Let's initialize the `Monkey`s with the input data.

```php
$monkeys = [
    new Monkey(0, [66, 79], '$old * 11', 7),
    new Monkey(1, [84, 94, 94, 81, 98, 75], '$old * 17', 13),
    new Monkey(2, [85, 79, 59, 64, 79, 95, 67], '$old + 8', 5),
    new Monkey(3, [70], '$old + 3', 19),
    new Monkey(4, [57, 69, 78, 78], '$old + 4', 2),
    new Monkey(5, [65, 92, 60, 74, 72], '$old + 7', 11),
    new Monkey(6, [77, 91, 91], '$old * $old', 17),
    new Monkey(7, [76, 58, 57, 55, 67, 77, 54, 99], '$old + 6', 3),
];
```

Now we have the `Monkey` instances, but we still need to add their buddies as references:

```php
$monkeys[0]->targetTrue = $monkeys[6];
$monkeys[0]->targetFalse = $monkeys[7];

$monkeys[1]->targetTrue = $monkeys[5];
$monkeys[1]->targetFalse = $monkeys[2];

$monkeys[2]->targetTrue = $monkeys[4];
$monkeys[2]->targetFalse = $monkeys[5];

$monkeys[3]->targetTrue = $monkeys[6];
$monkeys[3]->targetFalse = $monkeys[0];

$monkeys[4]->targetTrue = $monkeys[0];
$monkeys[4]->targetFalse = $monkeys[3];

$monkeys[5]->targetTrue = $monkeys[3];
$monkeys[5]->targetFalse = $monkeys[4];

$monkeys[6]->targetTrue = $monkeys[1];
$monkeys[6]->targetFalse = $monkeys[7];

$monkeys[7]->targetTrue = $monkeys[2];
$monkeys[7]->targetFalse = $monkeys[1];
```

The good thing is that this data model is 99% the same for `Part one` and `Part two`.

### Part one

So we need to run this investigation 20 times, collect the results and choose the two highest.

```php
const ITERATION = 20;

for ($i = 1; $i <= ITERATION; $i++) {
    for ($m = 0; $m <= 7; $m++) {
        $monkeys[$m]->runTest();
    }
}

$inspections = [];

foreach ($monkeys as $monkey) {
    $inspections[] = $monkey->inspectionCounter;
}

rsort($inspections);

[$first, $second] = $inspections;

echo "Monkey business level is: ".($first * $second).PHP_EOL;
```

### Part two

This part is almost the same as the previous one, except:
* The `WORRY_DIVIDER` is "_something, that we need to figure out_"
* The `ITERATION` is **10000**

This high number of iteration makes the worry levels so high, that makes calculation difficult, and in some programming 
languages even impossible because of the legendary **overflow**.

First I missed the "_find another way to keep your worry levels manageable_" suggestion, and just simply removed the division
by three according to the puzzle description. Then I didn't understand why they don't accept my result. The solution
was the *Least common multiple*. 

And if you check every number we use to check the new worry level is actually a prime number. So the common value for the
`WORRY_DIVIDER` is just simply multiply them. 

All the changes on the part one code:
```php
class Monkey
{
    public const WORRY_DIVIDER = (7 * 13 * 5 * 19 * 2 * 11 * 17 * 3);
    
    // ...
    
    private function testWorry(int $worry): void
    {
        // ...
        $testWorry = $newWorry % self::WORRY_DIVIDER;
        // ...
    }
}

// ...

const ITERATION = 10000;

// ...
```