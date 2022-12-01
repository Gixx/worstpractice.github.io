---
layout: post
title: "How to get the last modified file from an S3 Bucket?"
date: "2021-04-06 17:15:00 +0100"
level: 'beginner'
expiration: 'none'
illustration: 'download.jpg'
illustrationCaption: ''
illustration_share: 'download_600x600.jpg'
category: 'backend'
categoryLabel: 'Backend'
tags:   [php,php74,aws,s3-bucket]
tagLabels: ['PHP','PHP 7.4', 'AWS', 'S3 Bucket']
excerpt: "Recently I had to make my hands dirty with the AWS S3, and I faced a problem of getting the latest/newest file from a bucket with PHP."
keywords: "PHP, AWS, S3 Bucket, Client, ListObjectsV2, Last modified, descending order"
review: true
published: true
---

### TL;DR

If you don't want to waste your time reading this tutorial, and you only need a working code sample, please check the source code on
<a href="https://github.com/Gixx/worstpractice-aws-s3-adapter" target="_blank" rel="noopener">GitHub</a>.

### Requirement

First, it must be nailed down, if you need this regularly, probably it's better to create a RDS table where you can do such
queries easily and in a cost/CPU/time effective way.

This method is the opposite. It gets the full list from an S3 bucket, and then sort and filter on the local backend. Far from 
optimal. 

I assume those looking for this code snippet has already some kind of access to the <a target="_blank" rel="noopener" href="https://aws.amazon.com/s3/">Amazon S3</a>
and also has the keys and credentials for the AWS SDK S3 Client script to access it from their application.

### The Adapter

I'm a PHP developer, so I will show how to do this in PHP. First I define some constants that we will need later:

```php
<?php

declare(strict_types=1);

namespace WorstPractice\Component\Aws\S3;

class Adapter
{
    public const AWS_DEFAULT_LIST_LIMIT = 1000;

    public const OBJECT_SORT_BY_NAME = '^Key';
    public const OBJECT_SORT_BY_NAME_DESC = 'vKey';
    public const OBJECT_SORT_BY_DATE = '^LastModified';
    public const OBJECT_SORT_BY_DATE_DESC = 'vLastModified';
}
```

The `AWS_DEFAULT_LIST_LIMIT` is the default value the `MaxKeys` limiter of the requested list. If there are more objects 
in the given S3 bucket, it will return chunks. I believe the developers at AWS know why this value is the best, so I didn't 
change it. If I make it smaller, the more chunks I have to request, if I make it bigger it may hit the response time. So 
the default limit is just fine.

Then I defined four constants for control the sorting. By default the objects are returned sorted in an ascending order 
of the respective key names in the list, and currently there's no official AWS way to change this sort. So we have to do 
it locally.

I don't like to put too complex logic to determine the key and sort direction, so I mixed the two using some semi-visual
markers. Before the key name, I use either `^` or `v` to know if it's a ascending (`^` or "up") or a descending (`v` or 
down) order.

#### The constructor

To **instantiate** the adapter, we need to pass the AWS S3 Client object, so it can communicate with the AWS when needed. 

```php
//...

use Aws\S3\S3Client;

class Adapter
{
    // ...
    
    public function __construct(private S3Client $s3Client)
    {
    }
}
```

I love the new features of the PHP8, for example this constructor property promotion simplifies a lot on the code.

#### Specify the bucket

To **use** the different S3 Client actions, in most cases we need to specify the **bucket** we want to work with. To avoid
unnecessary parameters, and assuming that one wants to work on the same bucket, we decouple this setting from the
constructor into a separate public method:

```php
// ...

class Adapter
{
    // ...
    
    private string $bucket;
    
    // ...
    
    public function setBucket(string $bucket): void
    {
        $this->bucket = $bucket;
    }
}
```

#### Get the bucket's object list 

In an S3 bucket we don't talk about files, we talk about objects. An object holds various metadata like ID, key, date of 
modification, the filesize etc. That's why the sorting is so difficult, and if you need a frequently used sorting, I yet 
again recommend You to create a table in a relational database to solve it there.

To get the `last modified file from an S3 Bucket` we need to do four things:

1. set up the search options and additionally change the sort and limit arguments
2. get the full bucket object list (filtered by prefix)
3. apply the sorting on the full list (sort by "date modified" in descending order)
4. get the first element and return the object's key that we need to get the file.

It looks as the following:

```php
// ...

class Adapter
{
    // ...
    
    public function getObjectListByPrefix(string $keyPrefix, string $sortBy = null, int $limit = 0): array
    {
        $options = $this->getSearchOptions($keyPrefix, $sortBy, $limit);

        $results = $this->fetchFullFileList($options);
        // Avoid sort if not needed.
        $sortBy !== self::OBJECT_SORT_BY_NAME && $this->sortFileList($results, $sortBy);
        // Avoid limit if not needed.
        $limit && $this->limitFileList($results, $limit);

        return $results;
    }
}
```

First we setup the basic options array for the request. If we use the default sort by value, we can skip the expensive 
process of custom sorting on PHP side. Also if the limit is equal to zero, we can skip the additional method call.

Now let's see the these methods

#### The search options 

Here we set up the basic options array, and if necessary change the `$sortBy` and `$limit` parameters:

* If the sortBy was not set, set the default one. I could have added a constant for it, but didn't feel necessary.
* If the limit is a negative number, we consider it as a soft mistake and use the absolute value of it. I could have 
use the negative limit to control the direction of the sort, but it would have added an unnecessary complexity.

Then we check if the given sort-by parameter is the default AWS S3 sorting. We can use this information to add an AWS 
side result limiter, and if the limit is lower than the default AWS list limit (`MaxKeys`). It's good for the performance.

```php
// ...

class Adapter
{
    // ...
    private function getSearchOptions(string $keyPrefix, ?string &$sortBy, int &$limit): array
    {
        $options = [
            'Bucket' => $this->bucket,
            'EncodingType' => 'url',
            'Prefix' => $keyPrefix,
            'RequestPayer' => 'requester'
        ];

        if (empty($sortBy)) {
            $sortBy = self::OBJECT_SORT_BY_NAME;
        }

        $limit = (int) abs($limit);

        // We can add a query limit here only when we don't want any special sorting.
        if ($sortBy === self::OBJECT_SORT_BY_NAME && $limit < self::AWS_DEFAULT_LIST_LIMIT) {
            $options['MaxKeys'] = $limit;
            // Set the parameter to 0 to avoid the unnecessary array_chunk later.
            $limit = 0;
        }

        return $options;
    }   
}
```

Note, we added a `Prefix` index to the options. In an S3 bucket the *prefix* is something like a path on the filesystem. 
Generally it can be anything that is part of the beginning of the object's key, but with slashes (`/`), the S3 console on
the AWS website will consider them as "folders". This will help a lot when we request file list under a specific "sub-folder".

#### The requester

Here we communicate with the AWS through the S3 Client provided by the AWS SDK. In this method we have to heavily build
on the <a target="_blank" rel="noopener" href="https://docs.aws.amazon.com/aws-sdk-php/v3/api/class-Aws.S3.S3Client.html">SDK documentation</a>, 
So we have to believe what is written there:
* It there is no result, then the `Contents` index is empty in the response array.
* Otherwise the all the required indexes **must** exist.

Getting a full bucket list is a little bit tricky. We need to keep requesting the AWS, until we get all the objects, then
merge the results into one array.

To achieve this, the best option is the `do ... while` loop.  

```php
// ...

class Adapter
{
    // ...
    
    private function fetchFullFileList(array $options): array
    {
        $results = [];
        $continuationToken = '';

        do {
            $options['ContinuationToken'] = $continuationToken;

            $response = $this->s3Client->listObjectsV2($options);

            if (empty($response['Contents'])) {
                break;
            }

            $results[] = $response['Contents'];
            $continuationToken = $response['NextContinuationToken'];
            $isTruncated = $response['IsTruncated'];
            usleep(50000); // 50 ms pause to avoid CPU spikes
        } while ($isTruncated);

        return array_merge([], ...$results);
    }
}
```

I'm always happy when I can use a `do ... while`, it's a kind of rare occasion. 

In the loop we get actual portion of the list. The `ContinuationToken` tells the AWS where it should continue the listing.
For the first time, this token is empty, so the AWS will start in the beginning. In the response we get the 
`NextContinuationToken` which points to the next portion. We call again the AWS with this token unless the `isTruncated`
flag is `TRUE` which means we reached the end of the list.

A general rule is to avoid `array_merge` within loops. Then how to collect all the data into a list without it or adding
another loop, like `foreach`? Here is an optimization advice:

> Collect the result arrays into an array, and after the loop simple merge them with the help of the <strong>splat
> operator</strong>.

Actually this part:
```php
array_merge([], ...$results);
```

Here we use the `splat operator` (`...`) for "unpacking the argument". Since we are sure that every element of the `$results` 
array are arrays too, we can bravely unpack it and pass all its items (arrays) to the `array_merge`. But since we need 
to explicitly add two arrays, we use an empty array as a starting. The `array_merge` then merges all the arrays within 
the `$results` with this empty array, and what we get is the full object list on an AWS S3 bucket starting with a specific 
prefix.

#### The sorter

The next method is the `sortFileList`. We call it only when want other than the default sort.
This method gives us a great opportunity to practice the custom sorting ability of PHP. First we need to check if we 
need ascending or descending sort. As I wrote earlier, the first character should tell this. To avoid mistakes, we can 
add a simple validator for the available sorting values too.

```php
// ...

class Adapter
{
    // ...
    
    private array $validSortByKeys = [
        self::OBJECT_SORT_BY_NAME,
        self::OBJECT_SORT_BY_NAME_DESC,
        self::OBJECT_SORT_BY_DATE,
        self::OBJECT_SORT_BY_DATE_DESC,
    ];
    
    // ...
    
    private function sortFileList(array &$fileList, ?string $sortBy): bool
    {
        if (empty($fileList) || empty($sortBy) || !in_array($sortBy, $this->validSortByKeys, true)) {
            return false;
        }

        $direction = $sortBy[0] === '^' ? 'asc' : 'desc';
        $sortByKey = substr($sortBy, 1);

        return usort($fileList, static function ($a, $b) use ($direction, $sortByKey) {
            $cmp = strcmp($a[$sortByKey], $b[$sortByKey]);
            return $direction === 'asc' ? $cmp : -$cmp;
        });
    }    
}
```

If you are not familiar with the custom sort in PHP, this is how it works. The <a target="_blank" rel="noopener" href="https://www.php.net/manual/en/function.usort.php">`usort`</a> 
function gets the array that needs to be sorted as a reference parameter. This means the function will change the parameter 
itself and doesn't return a new version of it as other array functions do like the <a target="_blank" rel="noopener" href="https://www.php.net/manual/en/function.array-replace.php">`array_replace`</a>.

The second parameter is a callback function, that gets two actual elements from the array. We don't need to know where are
these placed in the original array, the `usort` calls this, not us. We only need to define the logic, that decides the 
relation between the two items. Return `-1` if the first argument is considered to be respectively less than, `0` if it is 
equal to, or `1` if it is greater than the second parameter.

With the `use` statement, we can "inject" variables into the function's scope. This way we can control if the "greater"
should be `1` or `-1` therefore apply the ascending and descending order without an extra `array_reverse` call.

#### The result limiter

This is the simplest: the result must be an array. If it's not empty, then just chunk the array into pieces with the size
of the `limit` and return the first chunk.

```php
// ...

class Adapter
{
    // ...
    
    private function limitFileList(array &$fileList, int $limit): bool
    {
        if (empty($fileList) || $limit <= 0) {
            return false;
        }

        $fileList = array_chunk($fileList, $limit)[0];

        return true;
    }
}
```

#### Get the last modified file's key

After having the method getting the full list sorted and chunked, the base problem of this topic is as simple as is:
calling our method with the right parameters. Or we can create a method just for this special case.

```php
// ...

class Adapter
{
    // ...
    
    public function getLastUploadedKeyByPrefix(string $keyPrefix): ?string
    {
        $object = $this->getObjectListByPrefix($keyPrefix, self::OBJECT_SORT_BY_DATE_DESC, 1);

        return $object[0]['Key'] ?? null;
    }
}
```

This will return a string with the file's key on the S3 bucket, or `NULL` if the bucket with the given prefix is empty.
You can also create a method that downloads the file from the S3 bucket, but let it be a homework.

