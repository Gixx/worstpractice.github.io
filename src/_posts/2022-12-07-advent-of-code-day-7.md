---
layout: post
title: "Advent of Code - Day 7"
date: "2022-12-07 15:30:00 +0200"
level: 'beginner'
expiration: 'none'
illustration: 'advent-7.jpg'
illustrationCaption: 'Calendar icon by <a target="_blank" rel="noopener" href="https://pixabay.com/users/pinwhalestock-13691058/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=4623521">Kevin Sanderson</a> from <a target="_blank" rel="noopener" href="https://pixabay.com//?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=4623521">Pixabay</a>'
illustration_share: 'advent-7_600x600.jpg'
category: 'backend'
categoryLabel: 'Backend'
tags:   [advent, php]
tagLabels: ['Advent', 'PHP']
excerpt: 'Dig deep in a folder structure, to find the one.'
keywords: "PHP, Advent of Code"
review: true
published: true
---

<a href="https://adventofcode.com/2022/day/7" rel="noopener" target="_blank">Today's puzzle</a> in short: we have a
filesystem that we need to build up from command history (input), then figure out sizes for different criteria.

### The input data

Okay, this one fired up the boosters for sure. The input file has filesystem commands and some responses for the commands:

#### The commands 

The commands are normal *nix system commands. The `$` represents the command prompt.

* `$ cd /` - enter the root directory.
* `$ cd ..` - one level up in the folder structure.
* `$ cd xy` - enter the `xy` directory.
* `$ ls` - list directory content.

#### Responses

Only the `ls` command produces any output in this input data:

* `dir abc` - there's a subdirectory with the name of `abc`.
* `1234 file.txt` - there's a file with the name of `file.txt` and the size of `1234` bytes. The filename extension is 
  optional.

#### Game rules

No special rules here. We need to reproduce the file system structure and then calculate different data out of it.

### The structure

For the first time we need to go into a more advanced mode and create some structure from the input data. Let's start 
with this one.

We read the input data line-by-line and decide what its content is. For both part one and two, we need to deal with 
directory sizes (that means the sizes all the files and subdirectories of the given directory), we can simplify our 
structure and collect only the folders and the sizes of their content.

```php
$currentDirectory = null;
$rootDirectory = null;

class ElfDirectory {
    public string $name = '';
    public ?ElfDirectory $parent = null;
    /** @var array<int, ElfDirectory>  */
    public array $children = [];
    /** @var array<int, string> */
    public array $files = [];
    public int $totalSize = 0;
}

if ($fn = fopen(__DIR__.'/input.txt', 'r')) {
    while (($line = fgets($fn, 1024)) !== false) {
        $line = trim($line);

        if ($line == '$ ls') {
            continue;
        }

        if ($line == '$ cd ..') {
            $currentDirectory = $currentDirectory->parent;
            continue;
        }

        if ($line == '$ cd /') {
            $newDirectory = new ElfDirectory();
            $newDirectory->name = '/';
            $currentDirectory = $rootDirectory = $newDirectory;
            continue;
        }

        $matches = [];
        if (preg_match('/^\$ cd (?P<dirName>[a-z]+)$/', $line, $matches)) {
            $newDirectory = new ElfDirectory();
            $newDirectory->name = $matches['dirName'];
            $currentDirectory->children[] = $newDirectory;
            $newDirectory->parent = $currentDirectory;
            $currentDirectory = $newDirectory;
            continue;
        }

        $matches = [];
        if (preg_match('/^(?P<fileSize>\d+)\s(?P<fileName>[a-z\.]+)$/', $line, $matches)) {
            $currentDirectory->totalSize += (int) $matches['fileSize'];
            $currentDirectory->files[] = $matches['fileName'].' ('.$matches['fileSize'].')';
            $parent = $currentDirectory->parent;

            while ($parent !== null) {
                $parent->totalSize += (int) $matches['fileSize'];
                $parent = $parent->parent;
            }
        }
    }
    fclose($fn);
}
```

As you see we use a nice and simple PHP class for this task. When we go line-by-line through the file, we check with 
exact comparison and with regular expression the actual line:

* When it's an `ls` command, it's just a placeholder, we can ignore it.
* When it's a `cd ..` command, it means the `$currentDirectory` pointer should point to its parent element.
* When it's a `cd /` command, we need to initialize the root level directory. We save it into both the `$currentDirectory`
  and the `$rootDirectory`
* When we enter into a subdirectory, we create a new `ElfDirectory` instance, add it to the `$currentDirectory`'s children 
  list, and set the `$currentDirectory` as the parent of this directory instance. Then we set this new instance as the 
  `$currentDirectory`.
* When it's directory listing row, and it's a file, we increment the `$currentDirectory` size counter with the actual file
  size. To make our future life easier, we also iterate through the parent element(s) and increment their size counters 
  as well.
* When it's directory listing row, and it's a directory, we ignore it, the `cd` command will do the registration.

As you see we also store the file name with the file size in a string within the `ElfDirectory`. However, it's not necessary
I still added it, because we will have a bonus function in the end, which can visually display the folder structure in the 
terminal.

### Part one

In part one, we need to analyze the file system and count all the folder sizes that are below **100000** bytes. As in the
puzzle description is written, with this method we most likely will have redundant counts:

* If folder "B" size within folder "A" is 3000,
* ...and folder "A" size is 5000,
* ...then both folder "A" and folder "B" is below 100000, so we count 8000, although folder "A"'s size counter already contains
  the size of folder "B".

What can we say? `¯\_(ツ)_/¯`.

To find the answer for the question, we need to create a recursive function that can climb the tree and check every element 
of it:

```php
const DIRECTORY_CHECK_MAX_SIZE = 100000;

function calculateTotalSumOf10kFolders(ElfDirectory $directory): int
{
    $sum = 0;

    if ($directory->totalSize  <= DIRECTORY_CHECK_MAX_SIZE) {
        $sum += $directory->totalSize;
    }

    foreach ($directory->children as $subDirectory) {
        $sum += calculateTotalSumOf10kFolders($subDirectory);
    }

    return $sum;
}

echo calculateTotalSumOf10kFolders($rootDirectory).PHP_EOL;
```

### Part two

Here we need to find the smallest directory that is larger than a specific size. What is this specific size? So we know that
the total disk space is 70000000 bytes, and the update requires 30000000 bytes of free space. We also know, how much our
filesystem totally consumes (which is the `totalSize` of the root directory). From these, we can calculate how much space
we need more to fulfill the free space requirement of the update. We need to find one folder that frees up enough space
upon deletion.

```php
const TOTAL_DISK_SPACE = 70000000;
const MINIMUM_UPDATE_SPACE_REQUIRED = 30000000;

function findSmallestDirectoryFreesUpEnoughSpace(ElfDirectory $directory, int $actualMinimum, int $limit): int
{
    if ($directory->totalSize > $limit) {
        $actualMinimum = min($actualMinimum, $directory->totalSize);
    }

    foreach ($directory->children as $subDirectory) {
        $actualMinimum = findSmallestDirectoryFreesUpEnoughSpace($subDirectory, $actualMinimum, $limit);
    }

    return $actualMinimum;
}

$actualFreeSpace = TOTAL_DISK_SPACE - $rootDirectory->totalSize;
$spaceNeeded = MINIMUM_UPDATE_SPACE_REQUIRED - $actualFreeSpace;
echo findSmallestDirectoryFreesUpEnoughSpace($rootDirectory, $rootDirectory->totalSize, $spaceNeeded).PHP_EOL;

```

Of course, we don't make extra checks whether there's enough free space or not.

### Bonus

I promised a bonus. It's ugly as hell, and it can be optimized a lot, but for now it's a good start. So the "not-so-proper"
`tree` command:

```php
function tree(ElfDirectory $directory, int $level = 0): void
{
    echo str_repeat(' | ', max(0, $level - 1))
        .($level ? ' ├' :'')
        .'['.$directory->name.'] ('.$directory->totalSize.')'.PHP_EOL;

    foreach ($directory->children as $subDir) {
        tree($subDir, $level + 1);
    }

    foreach ($directory->files as $file) {
        echo str_repeat(' | ', max(0, $level -1))
            .($level ? ' | ' :'').' └'.$file.PHP_EOL;
    }
}
```

It will look something like this:

<figure class="a-illustration">
    <img class="a-illustration__image" src="/assets/img/post-illustration-placeholder.png" data-src="/assets/img/blog/2022/backend/advent-of-code-day-7/visual.png" width="480">
    <figcaption class="a-illustration__caption">Output sample of the tree function.</figcaption>
</figure>
