---
layout: post
title: "Advent of Code - Day 1"
date: "2022-12-02 12:00:00 +0100"
level: 'beginner'
expiration: 'none'
illustration: 'advent-2.jpg'
illustrationCaption: 'Calendar icon by <a target="_blank" rel="noopener" href="https://pixabay.com/users/pinwhalestock-13691058/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=4623521">Kevin Sanderson</a> from <a target="_blank" rel="noopener" href="https://pixabay.com//?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=4623521">Pixabay</a>'
illustration_share: 'advent-2_600x600.jpg'
category: 'backend'
categoryLabel: 'Backend'
tags:   [advent, php]
tagLabels: ['Advent', 'PHP']
excerpt: 'A nice classic game I used to play a lot with my son.'
keywords: "PHP, Advent of Code"
review: true
published: true
---

<a href="https://adventofcode.com/2022/day/2" rel="noopener" target="_blank">Today's puzzle</a> in short: It's the good
old `Stone - Paper - Scissors` game.

### The input data

The input data today is simple:

* Every row contains two characters separated by a space.
* The first character is either `A`, `B` or `C`.
* The second character is either `X`, `Y` or `Z`.

#### Game rules

* `A` represents player 1's decision: the `Stone`.
* `B` represents player 1's decision: the `Paper`.
* `C` represents player 1's decision: the `Scissors`.
* The `Stone` worth `1` point.
* The `Paper` worth `2` points.
* The `Scissors` worth `3` points.
* If player 1 wins, that's `0` point.
* If it's a draw, that's `3` points.
* If player 2 wins, that's `6` points.

### Part one

The second character in this part also represents decisions:

* `X` represents player 2's decision: the `Stone`.
* `Y` represents player 2's decision: the `Paper`.
* `Z` represents player 2's decision: the `Scissors`.

Task: how much point will player 2 get after playing all rounds?

#### The code

Following the rule I set up yesterday, I think in the most simple solution. So we have two players, six letters with three 
points assigned and also some points regarding the result of the duel. This will cause a bit of hell with the variables,
so it's better to define constants. Also need to make a 3x3 matrix for the game rules:

* Stone beats scissors
* Scissors beat paper
* Paper beats stone

```php
const ROCK_1 = 'A';
const PAPER_1 = 'B';
const SCISSORS_1 = 'C';

const ROCK_2 = 'X';
const PAPER_2 = 'Y';
const SCISSORS_2 = 'Z';

const P1_WINS = 0;
const P2_WINS = 6;
const DRAW = 3;

$decisionScore = [
    ROCK_2 => 1,
    PAPER_2 => 2,
    SCISSORS_2 => 3
];

$winningMatrix = [
    ROCK_1 => [
        ROCK_2 => DRAW,
        PAPER_2 => P2_WINS,
        SCISSORS_2 => P1_WINS
    ],
    PAPER_1 => [
        ROCK_2 => P1_WINS,
        PAPER_2 => DRAW,
        SCISSORS_2 => P2_WINS
    ],
    SCISSORS_1 => [
        ROCK_2 => P2_WINS,
        PAPER_2 => P1_WINS,
        SCISSORS_2 => DRAW
    ],
];
```

You may have noticed, that the `$decisionScore` contains only the player 2's decisions. It's because we don't care about player 1's 
score in the end.

Now let's think about the logic. Go line-by-line, split up the string into the two players' decisions, and simply add
together the decision score and the score given by the winning matrix.

```php
$player_2_score = 0;

if ($fn = fopen(__DIR__.'/input.txt', 'r')) {
    while (($line = fgets($fn, 1024)) !== false) {
        $line = trim($line);
        [$player_1_decision, $player_2_decision] = explode(' ', $line);
        $player_2_score += ($winningMatrix[$player_1_decision][$player_2_decision] + $decisionScore[$player_2_decision]);
    }
    fclose($fn);
}

echo $player_2_score.PHP_EOL;
```

### Part two

The second character in part two represents the strategy that player 2 should follow:

* `X` to loose the round
* `Y` to make draw
* `Z` to win the round

Task: how much point will player 2 get after playing all rounds?

#### The code

For this version we have to revert our thinking a bit. The winning matrix will become a decision matrix, and with given
strategy we can easily identify the right decision. The constants will now look as follows:

```php
const ROCK = 'A';
const PAPER = 'B';
const SCISSORS = 'C';

const P1_SHOULD_WIN = 'X';
const END_DRAW = 'Y';
const P2_SHOULD_WIN = 'Z';

$decisionScore = [
    ROCK => 1,
    PAPER => 2,
    SCISSORS => 3
];

$duelResult = [
    P1_SHOULD_WIN => 0,
    P2_SHOULD_WIN => 6,
    END_DRAW => 3
];

$decisionMatrix = [
    ROCK => [
        P1_SHOULD_WIN => SCISSORS,
        P2_SHOULD_WIN => PAPER,
        END_DRAW => ROCK
    ],
    PAPER => [
        P1_SHOULD_WIN => ROCK,
        P2_SHOULD_WIN => SCISSORS,
        END_DRAW => PAPER
    ],
    SCISSORS => [
        P1_SHOULD_WIN => PAPER,
        P2_SHOULD_WIN => ROCK,
        END_DRAW => SCISSORS
    ],
];
```

We have one extra array compared to the previous version, and another became much simpler. The logic will be the following:

```php
$player_2_score = 0;

if ($fn = fopen(__DIR__.'/input.txt', 'r')) {
    while (($line = fgets($fn, 1024)) !== false) {
        $line = trim($line);
        [$player_1_decision, $player_2_strategy] = explode(' ', $line);
        $player_2_decision = $decisionMatrix[$player_1_decision][$player_2_strategy];
        $player_2_score += ($duelResult[$player_2_strategy] + $decisionScore[$player_2_decision]);
    }
    fclose($fn);
}

echo $player_2_score.PHP_EOL;
```