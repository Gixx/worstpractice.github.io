---
layout: post
title: "Refactoring the Dependency Injection Container"
date: "2022-11-11 16:10:00 +0100"
level: 'intermediate'
expiration: 'none'
illustration: 'refactoring.jpg'
illustrationCaption: 'Image by <a rel="noopener" target="_blank" href="https://pixabay.com/users/stevepb-282134/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=840835">Steve Buissinne</a> from <a rel="noopener" target="_blank" href="https://pixabay.com//?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=840835">Pixabay</a>'
illustration_share: 'refactoring_600x600.jpg'
category: 'backend'
categoryLabel: 'Backend'
tags:   [php,php82,refactor,dic,clean-code]
tagLabels: ['PHP','PHP 8.2', 'Refactoring', 'DIC', 'Clean code']
excerpt: "Two years ago (and only a few articles earlier) I published a mini-series about writing my own DIC. Now it's time to get back there and practice the refactoring."
keywords: "PHP 8.2, dependency injection, Clean code, S.O.L.I.D., SOLID Principles, Interface, PHPUnit, PHPStan"
review: true
published: true
---

### TL;DR

If you don't want to waste your time reading this tutorial, and you only need a working code sample, please check the source code on
<a href="https://github.com/Gixx/worstpractice-dependency-injection" target="_blank" rel="noopener">GitHub</a>.

### Valuation of the original

Although my <abbr title="Do It Yourself Dependency Injection Container">DIY DIC</abbr> has it tops and lops, and according to the
<a href="https://packagist.org/packages/gixx/worstpractice-dependency-injection/stats" rel="noopener" target="_blank">Packagist</a>,
someone even dare to install it, there were many mistakes made.

**First**: leaving the configuration as an array. False statement <a href="https://worstpractice.dev/backend/diy-dependency-injection-container-2#choose-the-right-weapon" rel="noopener" target="_blank">made by me</a>: 
> And when we think about it, in the end, deep inside all the parsers the whole thing will end up in an average associative 
> array or Iterable class. Then why should we waste our time on this?

**Second**: comes from the first actually: the type strictness became unmaintainable. I even had to add some ignores and
exceptions to the `PHPStan`'s configuration, to pass all tests.

**Third**: closed the possibility to use other config parsers, so one can make their own (e.g.: XML, YAML, ini, etc.).

### Planning

I decided, when I refactor the code, I will do it right. So I aimed to rewrite everything in PHP 8.2. Today,
as I'm writing this article, the PHP 8.2 is still not officially released, and I could use only the Release Candidate version.

I assumed and accepted that some tools won't work as expected as partial or full lack of PHP 8.2 support. I as right
unfortunately. I had to give up using the `PHP CS`, the `CS Fixer`, and the 
<a href="https://scrutinizer-ci.com/" rel="noopener" target="_blank">Scrutinizer</a>'s code quality checks. But the two
most important, the `PHPUnit` and the `PHPStan` static analyser are still on duty, so I'm satisfied.

I also decided to eliminate all the `PHPStan` exceptions I made, and go for full throttle on maximum level with the checks.

### The old structure

The original DIC (form now I will refer it as `v.1.0`) was only one simple class with altogether 430 rows of code and 
comment. I think it was pretty neat and compact. But now, to avoid the multidimensional, mixed type array hell I made 
there, I will need to go Kansas and jump deep into that goddamn rabbit hole.

In `v.1.0` there were no structure. I used arrays everywhere for everything. These were the main "sub-containers":

```php
    /**
     * @var array The full raw configuration data
     */
    private array $configuration;
    /**
     * @var array The configuration data with resolved inherited configuration.
     */
    private array $serviceConfiguration;
    /**
     * @var array The instantiation-ready library with all necessary data.
     */
    private array $serviceLibrary;
    /**
     * @var array The instantiated services.
     */
    private array $serviceContainer;
```

To understand why I needed them, first let's analyse what one single service configuration can be built from:

#### ID

The service identifier. It's the first level key in the configuration array, therefore it must be unique. Can be a real 
class name, or just an alias.

#### Class

This record stores the class name. It's optional with conditions: either the service identifier points to a real class, 
or the `inherits` presents and points to another service in the configuration.

#### Inherits

A not so real pointer. It stores the identifier of another service in the configuration. This record is optional.

#### Arguments

A mixed type array that stores the parameters for the service constructor. If any of the parameters is not a pointer to 
another service, the array must be associative and the given parameter must be indexed with string literals. Numeric indexes
will be treated as service pointers to inject. This parameter is optional with conditions: either the service does not
require explicit parameters (empty or all has defaults), or the `inherits` presents, and the "parent" class' settings will
be used.

#### Calls

A multidimensional, mixed typed array. Every (1st level) item in this array is an array too. Those (2nd level) arrays
must have exactly two items: 
* a string literal that holds the public and callable method name of the actual service 
* a list of the arguments, built the same way as the class constructor's arguments previously.

#### Shared

A boolean data, that defines whether the class must be singleton or should be instantiated every time we retrieve it from
the container.

### The new structure

Now we understand the structure of the configuration, that makes a bit more sense for those class properties: 
* One to store the raw config.
* One that has all the inheritance solved.
* One with all data set for the instantiate process. 
* One to store the service instances.

To make this whole mess type-safe, we need to find a way to define all units for the configuration. 
Just a fast thinking to write our the grocery list:

* **Argument item** - One particular parameter. It stores the index (position), the type (string, integer, boolean etc.), 
  the value and whether it's a service reference or not.
* **Argument collection** - This stores all the **Argument items**, that will be passed to the class constructor.
* **Callable item** - The method name and the method's parameter list (which is an Argument collection).
* **Callable collection** - This stores all the **Callable items**, we want to call after the service is initialized.
* **Config item** - This is the 1:1 typed class representation of the config data. It stores the identifier (`ID`), the 
  service class name (`Class`), the inheritance reference (`Inherits`), the class' constructor arguments (`Arguments`, 
  which is an Argument collection), the methods that will be called (`Calls`, which is a Callable collection), and the 
  flag to be singleton or not (`Shared`). Besides the `ID` all the other properties can be NULL. 
* **Config model** - This stores all the **Config items**.
* **Config parser** - This will get a config data from any kind of input (specified by the parser class) and creates the
  **Config items** and stores them in the **Config model**.
* **Library and Books** - A library store books. The **Books** are in this case the ready-to-instantiate versions of the 
  **Config Items**. The **Library** should browse the catalog (**Config model**), solve the inheritance chain (if there's, 
  any), and create the **Books**.
* **Container** - that instantiates the services by:
  * Get the right service's information (**Book**) from the **Library**.
  * Resolve the argument list references (get the other service's instance).
  * Create the service instance by passing (injecting) the constructor parameters. 
  * Call the defined method(s) with the defined parameters (with resolved argument list references) after the initialization.
  * Store (cache) the initialized instance in an internal list for later use.

### Challenges

The `ArgumentItem`, the `CallableItem`, the `ConfigItem` and the `ServiceBook` classes are super simple, strictly typed, 
readonly classes (PHP 8.2!). Okay, the `ConfigItem` has mostly nullable properties, but this is by purpose: the **Config items** 
can store partial data, the **Books** are required to store all necessary data. And **Library**'s duty is to provide all 
these data either by resolving the inheritance or by setting the defaults. For example the **Shared** flag is by default 
`TRUE` when not presents.

Just to show some example, here is the `ConfigItem`:

```php
declare(strict_types=1);

namespace WorstPractice\Component\DependencyInjection\ConfigModel;

readonly class ConfigItem
{
    public function __construct(
        public string $id,
        public ?string $class,
        public ?string $inherits,
        public ?ArgumentItemCollection $arguments,
        public ?CallableItemCollection $calls,
        public ?bool $isShared,
    ) {
    }
}
```

The `ArgumentItemCollection`, the `CallableItemCollection` and the `ConfigModel` classes are almost as simple as the 
"Items" were. Here I chose to store the items into an internal, "single level, every item has the same type"-kind of array 
(let's call it `list`). Public and readonly in this case wouldn't be good, because we need to add the items one-by-one and 
not once through the constructor. But to still make possible to be used in a `foreach`, they implement the `IteratorAggregate`
interface.

One typical case is the `ArgumentItemCollection`:

```php
declare(strict_types=1);

namespace WorstPractice\Component\DependencyInjection\ConfigModel;

use IteratorAggregate;
use Traversable;

/**
 * @implements IteratorAggregate<int, ArgumentItem>
 */
class ArgumentItemCollection implements IteratorAggregate
{
    /** @var array<int, ArgumentItem> $items */
    private array $items = [];

    public function add(ArgumentItem $item): void
    {
        $this->items[] = $item;
    }

    final public function getIterator(): Traversable
    {
        yield from $this->items;
    }
}
```

The `ServiceLibrary` in `v.1.0` was basically part of the `Container`, now I separated these two to be more readable and also 
simplify the responsibilities. According to the **Single responsibility principal**, a class should have one and only one 
reason to change, meaning that a class should have only one job. Okay, maybe I failed on this, but I can say the following:

* The library's responsibility is to prepare all the data for the container. This includes calling the parser, resolve the
  inheritance chains etc.
* The container's responsibility is to create instances from the data that the library provided to it. 
 
It's all just a  matter of perspective, isn't it?

#### The biggest challenge

The biggest challenge was to solve, how can I convert a multi-mixed-typeless array to a strictly typed structure of objects.
Creating the strictly typed class structure was relatively easy. To fill them with data was the problem. The `PHPStan`
always complained about the missing types on the Iterables, such like: 

```
------ ------------------------------------------------------------------------------------------------- 
 Line   WorstPractice/Component/DependencyInjection/ConfigModel/CallableItemCollection.php
------ ------------------------------------------------------------------------------------------------- 
 27     Property WorstPractice\Component\DependencyInjection\ConfigModel\CallableItemCollection::$items  
        type has no value type specified in iterable type array.
        💡 See: https://phpstan.org/blog/solving-phpstan-no-value-type-specified-in-iterable-type        
------ ------------------------------------------------------------------------------------------------- 
```

Tried to solve it with <a href="https://phpstan.org/writing-php-code/phpdoc-types#iterables" rel="noopener" target="_blank">PHPDoc Types</a> 
and PHP Attributes (such as <a href="https://blog.jetbrains.com/phpstorm/2020/10/phpstorm-2020-3-eap-4/#ArrayShape" rel="noopener" target="_blank">ArrayShape</a>), 
but pre-defining the service's (1st level) call list's (2nd level) method's (3rd level) parameter list (4th level),
where any parameter can be an array too, became way too complicated. Also in the config, the call list itself is a mixed
array, because the zero indexed element is the method name is string, and the first indexed element is the attribute list is an array. 

No doubt, it's a mess. Not a small one, but huge. How to solve it then? Well... it's called `ConfigParserInterface`! We
define it simple and the Library will use the implementation:

```php
declare(strict_types=1);

namespace WorstPractice\Component\DependencyInjection;

use WorstPractice\Component\DependencyInjection\ConfigModel\ArgumentItemCollection;
use WorstPractice\Component\DependencyInjection\ConfigModel\CallableItemCollection;

interface ConfigParserInterface
{
    public function parse(mixed $config): ConfigModel;
}
```
As you can see, I simply set the `$config` to be "mixed", and whatever the implementation do inside must result a `ConfigModel`.
Great theory, but I still have to solve the parsing under the close surveillance of the `PHPStan`. For this task I made
only the `ArrayParser`. Later, I may create an `XMLParser` or a `YamlParser` (by including the Symfony's Yaml parser class).

The question is still the same, and I avoid the hot porridge, like a cat.

##### Array to Object

So a mixed array should be converted to object. Can we do it in one step? If yes, please send me a good solution, anything I 
tried were all wrong, or just simply didn't fit here.

Then, can we do it in two steps?

```
Array => ? => Object 
```

Looks familiar. What if, when the `?` means `String`?  

<figure class="a-illustration">
    <img class="a-illustration__image" src="/assets/img/post-illustration-placeholder.png" data-src="/assets/img/blog/2022/backend/refactoring-the-dependency-injection-container/json.jpg" width="800">
    <figcaption class="a-illustration__caption">Source: <a href="https://imgflip.com/memegenerator" rel="noopener" target="_blank">Meme Generator</a></figcaption>
</figure>

```php
$jsonData = json_encode(value: $config, flags: JSON_THROW_ON_ERROR);
$generalObjectData = json_decode(json: $jsonData, associative: false, flags: JSON_THROW_ON_ERROR);
```

Oh, yes! The `json_encode` eats `mixed` data and produces a `string` (or `false`). The `json_decode`, in the other hand, eats 
a `string` and produces an `array`. **Or an Object!** 

But what kind of object? It's the built-in `stdClass`. And since it's an object, we can use `ReflectionObject` on it, and 
also can feed into the `foreach` construct, because by design the `foreach` works not only with arrays, but also with objects 
that have public properties. And the `stdClass` is not more than public properties.

Great! The most difficult part is done. We go through the data, build the **items**, add them to the **collections**, cast
everything to the right type. Since anything that we have to cast, is for sure can't be an array, therefore we won't have such errors
as `PHP Warning:  Array to string conversion`.

"By any means necessary" - that's what they used to say. And my goal was to achieve strict types. Result?

<figure class="a-illustration">
    <img class="a-illustration__image" src="/assets/img/post-illustration-placeholder.png" data-src="/assets/img/blog/2022/backend/refactoring-the-dependency-injection-container/stan.gif" width="660">
    <figcaption class="a-illustration__caption">PHPStan results</figcaption>
</figure>

### Language features

The `v.1.0` was written in `PHP 7.4`. This, the `v1.1` is written in `PHP 8.2`. Normally it's a huge step, but since I wrote 
the `v.1.0` carefully and paid attention to write a clean and nice code, the refactor from language-wise was not a big deal.

If it had been `PHP 5.3` or older, then I would have definitely sweat into my pants. Anyway, there are a few PHP versions 
between `v.1.0` and `v.1.1`, so just for curiosity, let's take a look of the language features I could add to improve the
new code's value, and also to explain why I require PHP 8.2 for this package...

#### Features from PHP 8.0

There are many good features even in PHP 7.4 I didn't use so far, but our task is not to use all of them, but to use what
we need. So the first new language features I used during the refactor were:

##### Nullsafe operator

With the addition of the <a href="https://stitcher.io/blog/php-8-nullsafe-operator" rel="noopener" target="_blank">Nullsafe operator</a>,
we can now have null coalescing-like behaviour on methods!
```php
$isInstantiable = $reflectionClass->isInstantiable() 
    && ((int) $reflectionClass->getConstructor()?->getNumberOfRequiredParameters()) === 0;
```

##### Named arguments

This is one of my favourite, and long awaited feature. 
<a href="https://stitcher.io/blog/php-8-named-arguments" rel="noopener" target="_blank">Named arguments</a> allow you to 
pass in values to a function, by specifying the value name, so that you don't have to take their order into consideration, 
and you can also skip optional parameters!

```php
$this->serviceLibrary->set(
    id: $id,
    class: $serviceInstance::class,
    shared: $isShared
);
```

However, it's not only good to skip parameters, but also labeling parameters to make it easier to read and understand:

```php
json_decode($parameter, associative: true);
```

##### Match expression

The <a href="" rel="noopener" target="_blank">match</a> can return values, doesn't require break statements, can combine 
conditions, uses strict type comparisons and doesn't do any type coercion.

```php
private function setParameterType(string $parameter, string $type): mixed
{
    return match ($type) {
        'boolean' => (bool) $parameter,
        'integer' => (int) $parameter,
        'double' => (float) $parameter,
        'array' => json_decode($parameter, associative: true),
        'NULL' => null,
        default => $parameter
    };
}
```

##### Constructor property promotion

Oh, yes! Previously you defined properties in the class, then you listed them in the class constructor arguments, then
you made the assignment in the constructor... You had to type almost the same three times. 
<a href="https://stitcher.io/blog/constructor-promotion-in-php-8" rel="noopener" target="_blank">Up till now</a>.

```php
class CallableItem
{
    public function __construct(
        public string $method,
        public ArgumentItemCollection $arguments,
    ) {
    }
}
```

##### The mixed type

When you can't specify what you have, this new <a href="https://stitcher.io/blog/new-in-php-8#new-mixed-type-rfc" rel="noopener" target="_blank">mixed type</a>
comes to help you out.

```php
public function stringifyValue(mixed $value): string
{
    return is_object($value) || is_array($value)
        ? (string)json_encode($value)
        : strval($value);
}
```

##### The throw exception

Previously the `throw` was a statement, now it's an expression. Therefore, we can use it anywhere where expressions are
possible to use. Very, very useful to avoid extra checks.

```php
public function get(string $id): ConfigItem
{
    return $this->items[$id] ?? throw new OutOfBoundsException(
        sprintf($message, $id),
        $code
    );
}
```

##### Allowing `::class` on objects

It's now possible to use `::class` on objects, instead of having to use `get_class()` on them.

```php
$this->serviceLibrary->set(
    id: $id,
    class: $serviceInstance::class,
    shared: $isShared
);
```

#####  Trailing comma in parameter lists

Small but useful improvement. In most cases I try to avoid to leave trailing commas, but now if I forget, I won't get any 
error. Comes in handy, when copy-pasting similar parameters, for example in a `var_dump`:

```php
var_dump(
 $data[0]->getType(),
 $data[1]->getType(),
 $data[2]->getType(),
 $data[3]->getType(),
 $data[4]->getType(),
);
```

There are many useful new features in PHP 8.0 that I didn't use. Check the 
<a href="https://stitcher.io/blog/new-in-php-8" rel="noopener" target="_blank">stitcher.io</a> for details.

#### Features from PHP 8.1

Although the PHP 8.0 shot most of the black powder, the 8.1 still hold some goodies in the back pocket.

##### Enum

The <a href="https://stitcher.io/blog/php-enums" rel="noopener" target="_blank">Enums</a> are great to have. The benefit 
of enums is that they represent a collection of constant values, but most importantly those values can be typed. But what
I really like, is now this constants can have quasi-multiple value from multiple types. Okay probably this is not the most
precise definition. 

I found the enum extremely useful for the errors:
```php
namespace WorstPractice\Component\DependencyInjection;

enum Error
{
    case ERROR_CLASS_NOT_FOUND;
    case ERROR_CLASS_NOT_INSTANTIABLE;
    // ...

    public function getCode(): int
    {
        return match ($this) {
            self::ERROR_CLASS_NOT_FOUND => 1000,
            self::ERROR_CLASS_NOT_INSTANTIABLE => 1001,
            // ...
        };
    }

    public function getMessageTemplate(): string
    {
        return match ($this) {
            self::ERROR_CLASS_NOT_FOUND => 'Class "%s" not found.',
            self::ERROR_CLASS_NOT_INSTANTIABLE => 'The given service (%s) is not an instantiable class.',
            // ...
        };
    }
}
```

Then somewhere else in the code:

```php
try {
    return new $serviceBook->class(...$argumentList);
} catch (Throwable $exception) {
    throw new RuntimeException(
        sprintf(Error::ERROR_CLASS_NOT_INSTANTIABLE->getMessageTemplate(), $id),
        Error::ERROR_CLASS_NOT_INSTANTIABLE->getCode(),
        $exception
    );
}
```

##### `new` in initializers

This <a href="https://stitcher.io/blog/php-81-new-in-initializers" rel="noopener" target="_blank">feature</a> proposes 
to allow use of new expressions inside parameter default values, attribute arguments, static variable initializers and 
global constant initializers. This is a very-very useful feature.

```php
public function set(
    string $id,
    ?string $class = null,
    ArgumentItemCollection $arguments = new ArgumentItemCollection(),
    CallableItemCollection $calls = new CallableItemCollection(),
    bool $shared = true
): void {
    $this->library[$id] = new ServiceBook(
        class: $class ?? $id,
        arguments: $arguments,
        calls: $calls,
        shared: $shared
    );
}
```

##### Readonly properties

The end of an era. An era where you had to define properties as `private` and manually create `getters` because you
wanted to protect them to be overwritten. Now class properties can be marked as <a href="https://stitcher.io/blog/php-81-readonly-properties" rel="noopener" target="_blank">readonly</a>, 
meaning they can only be written once. Either by the constructor, or by any other method. Absolutely love it!

```php
public function __construct(private readonly ConfigParserInterface $configParser)
{
}
```

There are many useful new features in PHP 8.1 that I didn't use. Check the
<a href="https://stitcher.io/blog/new-in-php-81" rel="noopener" target="_blank">stitcher.io</a> for details.

#### Features from PHP 8.2

This one is easy. I used only one new feature specifically from this release: the <a href="https://stitcher.io/blog/new-in-php-82#readonly-classes-rfc" rel="noopener" target="_blank">readonly classes</a>.
It adds syntactic sugar to make all class properties readonly at once.

```php
namespace WorstPractice\Component\DependencyInjection\ConfigModel;

readonly class CallableItem
{
    public function __construct(
        public string $method,
        public ArgumentItemCollection $arguments,
    ) {
    }
}
```

There are many useful new features in PHP 8.2 that I didn't use. Check the
<a href="https://stitcher.io/blog/new-in-php-82" rel="noopener" target="_blank">stitcher.io</a> for details.

### Conclusion

I think it was worth to refactor the old code. In one hand, it was fun to make some useful improvements in code quality, 
but in the other, I learned a lot of new language features, that I can in the future. Except when I have to deal with 
PHP 5 legacy projects.