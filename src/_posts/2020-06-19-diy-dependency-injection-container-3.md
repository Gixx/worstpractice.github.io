---
layout: post
title: "DIY Dependency Injection Container, Part 3"
date: "2020-06-19 17:20:00 +0100"
level: 'intermediate'
expiration: 'none'
illustration: 'dependency-injection.jpg'
illustrationCaption: 'Image by <a target="_blank" rel="noopener" href="https://pixabay.com/photos/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=731198">Free-Photos</a> from <a href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=731198">Pixabay</a>'
illustration_share: 'dependency-injection_600x600.jpg'
category: 'backend'
categoryLabel: 'Backend'
tags:   [php74,dic,clean-code]
tagLabels: ['PHP 7.4', 'DIC', 'Clean code']
excerpt: "It's time to finish our simple dependency injection container, and see if it works as expected."
keywords: "PHP 7.4, dependency injection, Clean code, S.O.L.I.D., SOLID Principles, Interface, PHPUnit"
review: true
published: true
---

In the <a rel="prev" href="/backend/diy-dependency-injection-container-2" title="DIY Dependency Injection Container, Part 2">previous part</a>, 
we defined the structure of the configuration data, and planned the behaviour we want our DI to follow.

### TL;DR

If you don't want to waste your time reading this tutorial, and you only need a working code sample, please check the source code on
<a href="https://github.com/Gixx/worstpractice-dependency-injection/tree/1.0.6" target="_blank" rel="noopener">GitHub</a>.

### to TDD or not to TDD?

This is always a question. Hardcore, fanatical, pop eyed far-side coders will hate me when I say: TDD is not for everyone and is not for every
code. TDD requires a different thinking, a different learning path. For example for me, I'm not yet able to understand how can I do anything in
TDD way. I hope in the future it will change, because a new knowledge always makes me better. I believe TDD helps when you are on the start grid,
and you know what the goal is, but you don't know yet the way to reach it. Like being in the dark room, and you see the exit sign bright in the distance, 
but everything else is dark, so you have to feel the way with your feet to avoid traps, and roadblocks.

But now it's not a dark room. I know the goal, and I clearly see the path. Maybe there will be traps hidden, but I will try to cover not only the happy 
path with tests. Not coding in TDD way doesn't mean I don't write tests. Test are not only important but ought to be mandatory.

### The DI class

Note: Because the class will probably be long, I will add here only the fragments I will talk about and won't include the whole actual source.

#### Declaration, preparation

In part one I wrote very enthusiastically on the strict types, so this should be the first thing we declare, then we implement the Interface too.

```php
<?php

declare(strict_types=1);

namespace WorstPractice\Component\DependencyInjection;

class Container implements ContainerInterface
{
    /**
     * @var array The full raw configuration data
     */
    private array $configuration;

    /**
     * Container constructor.
     *
     * @param array $configuration
     */
    public function __construct(array $configuration)
    {
        $this->configuration = $configuration;
    }

    /**
     * Returns true if the given service is registered.
     *
     * @param  string $identifier
     * @return bool
     */
    public function has($identifier): bool
    {
    
    }

    /**
     * Gets a service instance.
     *
     * @param  string $identifier
     * @return object
     */
    public function get($identifier): object
    {
    
    }

    /**
     * Register a service object instance into the container.
     *
     * @param  string $identifier
     * @param  object $serviceInstance
     * @param  bool   $isShared
     */
    public function set(string $identifier, object $serviceInstance, bool $isShared = true): void
    {
    
    }
}
```

So what we have here? We created the frame of our DI class. Declare the namespace and the class, implement our DI interface
which is an extension of the `Psr\Container\ContainerInterface`. We added a constructor method that accepts an array with the configuration
data. It's a raw data, so basically it can hold anything, no validation added yet. 

In part one I already wrote about my problem with the strict types when you implement an interface which doesn't that strict.
So the methods defined in the `Psr\Container\ContainerInterface` unfortunately are without proper parameter types. 

#### Additional storage properties

The methods are still empty, but before filling them, take a step back and let's think, what we need:

* We need an internal storage for the parsed config, let's call it Service Library.
 
```php
  /**
   * @var array The instantiation-ready library with all necessary data.
   */
  private array $serviceLibrary;
```

* We need an internal storage for the instantiated services, this is the Service Container.

```php
/**
 * @var array The instantiated services.
 */
private array $serviceContainer;
```

The Service Container is a simple key-value array, where the key is the service identifier and the value is the service instance.

The Service Library is a bit complex. It's a parsed version of the raw configuration data. Like for the Service Container, the key
here is the service identifier, and the value is an array similar to the configuration. First we create some constants to always
refer the correct key and don't have to deal with accidental, hidden typos:

```php
private const SERVICE_CLASS = 'class';
private const SERVICE_ARGUMENTS = 'arguments';
private const SERVICE_METHOD_CALL = 'calls';
private const SERVICE_SHARE = 'shared';
private const SERVICE_INHERIT = 'inherits';
private const SERVICE_INITIALIZED = 'initialized';
```  

Mostly they are the same as in the configuration, except the `SERVICE_INITIALIZED` which is there to flag that we already instantiated a service.

### The `has` method

After this how can we decide whether a service exists or not? Or with other words, how we check whether the DI has a service or not?
The answer is pretty simple. The DI has a service if:

* the service is instantiated and registered into the Service Container.
* the service is not instantiated yet but registered into the Service Library.
* the service is not registered into any internal storage but exists in the raw configuration, or it's a loadable class.

Be clean and simple, create three additional checker methods to cover these cases:

```php
/**
 * Checks if the service has been already registered into the container
 *
 * @param string $identifier
 * @return bool
 */
private function isServiceRegisteredIntoContainer(string $identifier): bool
{
    return isset($this->serviceContainer[$identifier]);
}

/**
 * Checks if the service has been already registered into the library
 *
 * @param string $identifier
 * @return bool
 */
private function isServiceRegisteredIntoLibrary(string $identifier): bool
{
    return isset($this->serviceLibrary[$identifier]);
}

/**
 * Checks if the service name is a valid class, or it's in the raw configuration.
 *
 * @param string $identifier
 * @return bool
 */
private function isServiceRegistrableIntoLibrary(string $identifier): bool
{
    return class_exists($identifier) || isset($this->configuration[$identifier]);
}
```

Now we have these beauties, we can finish the `has` method:

```php
/**
 * Returns true if the given service is registered.
 *
 * @param  string $identifier
 * @return bool
 */
public function has($identifier): bool
{
    return $this->isServiceRegisteredIntoContainer($identifier)
        || $this->isServiceRegisteredIntoLibrary($identifier)
        || $this->isServiceRegistrableIntoLibrary($identifier);
}
```

If we code like this, we can keep the <a target="_blank" rel="noopener" href="https://en.wikipedia.org/wiki/Cyclomatic_complexity">Cyclomatic complexity</a>
low, and after we cover them with unit tests, also the <acronym title="Change Risk Anti Pattern">CRAP</acronym> Score.

### The `set` method

Let's continue with the `set` method since it's almost as simple as the `has`. The `get` will be the most complex, so leave it last.
The `set` method basically injects an instance into the container, so instead of building up an instance from the configuration, we go
the opposite way and build up the configuration from the instance. What question need to asked first? This:

* What should happen if a service with the given identifier already exists?

Well, I am a guy who is not afraid of raise errors when there is a use case we don't want to allow. So my answer is: throw an exception.

And again to reduce complexity, first create another checker method:

```php
/**
 * Checks if the service has been already initialized.
 *
 * @param  string $identifier
 * @return bool
 */
private function isServiceInitialized(string $identifier): bool
{
    return $this->serviceLibrary[$identifier][self::SERVICE_INITIALIZED] ?? false;
}
```

So the `set` method will look like:

```php
/**
 * Register a service object instance into the container.
 *
 * @param  string $identifier
 * @param  object $serviceInstance
 * @param  bool   $isShared
 * @throws RuntimeException
 */
public function set(string $identifier, object $serviceInstance, bool $isShared = true): void
{
    // Check if the service is initialized already.
    if ($this->isServiceInitialized($identifier)) {
        throw new RuntimeException(
            sprintf('Another service with this identifier (%s) is already initialized.', $identifier)
        );
    }

    // Register service.
    $this->serviceContainer[$identifier] = $serviceInstance;

    // Overwrite any previous settings.
    $this->serviceLibrary[$identifier] = [
        self::SERVICE_INITIALIZED => true,
        self::SERVICE_ARGUMENTS => [],
        self::SERVICE_METHOD_CALL => [],
        self::SERVICE_SHARE => $isShared,
        self::SERVICE_CLASS => get_class($serviceInstance),
    ];
}
```   

**Note:** in PHP 8.0 we will be able to use `$serviceInstance::class` instead of `get_class($serviceInstance)`.

I was not sure which of my most used exceptions fits here best:

* RuntimeException
* InvalidArgumentException
* OutOfBoundsException

Of course I could introduce new exceptions too, but frankly I am not big fan of unnecessarily create files. The built-in 
exception classes are more than enough to cover any cases. So why we don't use them? Ok, I agree there's a beauty in throw
an `OhNoAnotherIdiotUsesMyCodeWithoutReadingTheFuckingManualException`, but hey... Do we really win anything with it? I guess no.
We can add error codes for the exceptions if we want to target them more precisely.  

### The `get` method

This one is a beast, with sometimes weird and twisted logic. The goal is simple: if we have the given service registered, return its
instance or throw an exception otherwise. But since it's the most crucial part of the whole DI, let's stop again to summarize
the problems we need to face and solve.

This DI follows a "_build-on-the-fly_" strategy:  

* Do not parse the configuration until a service is not requested.
* Register the corresponding service configuration into the Service Library, resolve inheritance to have all the information prepared
  for the instantiation.
* Check the class arguments and the method call arguments for other service references and initialized them first. 
* Initialize the service and register it into the Service Container.

#### What pitfalls we need to handle? 
##### Reference loops

* Inheritance loop: when services reference each other as they are inherited from:

```php
$config = [
    'form.service' => [
        'inherits' => 'shared.form.service',
        'shared' => false
    ],
    'shared.form.service' => [
        'inherits' => 'form.service',
        'shared' => true
    ],
];
```

* Argument Reference loop: when services reference each other. Even one service can reference itself on configuration level:

```php
$config = [
    'form.service' => [
        'class' => Namespace\To\Form\Service::class,
        'arguments' => [
            'form.service'
        ],
        'calls' => [
            ['addSubForm', ['form.service']]
        ],       
        'shared' => true
    ],
];
``` 

* Mixed variations of the two cases above.

##### Invalid configuration data

* Missing or invalid class constructor arguments.
* Missing or invalid called method arguments.
* Reference to a non existing class.
* Reference to a non existing method to call.
* Other semantic errors in the configuration data. 

So in the first place we need to build the line of defense. To deal with the different reference loop cases we will introduce a
new internal storage to store all the services which are involved in the current retrieval. Let's call it simply Loop Detector.  

```php
/**
 * @var array An array to detect reference loops.
 */
private array $referenceLoopDetector = [];
```

When we handle references we also use the same `get` logic for the referenced classes. But since we can't change the `get` method's 
declaration to add proper type hinting, I prefer to create a new method:

```php
/**
 * Gets a service instance.
 *
 * @param  string $identifier
 * @return object
 */
public function get($identifier): object
{
    return $this->getFromContainer((string) $identifier);
}

/**
 * @param string $identifier
 * @return object
 */
private function getFromContainer(string $identifier): object
{

}
``` 

As you can see, the public entry point remain the `get` method which simply proxies the call to an internal function with
casting the parameter. In the `getFromContainer` to save time and resources the first thing we must do is to check the loop:

```php
/**
 * @param string $identifier
 * @throws RuntimeException
 * @return object
 */
private function getFromContainer(string $identifier): object
{
    if (in_array($identifier, $this->referenceLoopDetector, true)) {
        throw new RuntimeException(
            sprintf('Reference loop detected! Reference chain: %s', implode(' -> ', $this->referenceLoopDetector))
        );
    }

    $this->referenceLoopDetector[] = $identifier;

    // Todo retrieve the service instance or throw exception.
    
    array_pop($this->referenceLoopDetector);
    
    // Todo return the service instance.
}
```

If we have a loop in a reference node, the process must be stopped and throw an exception. Otherwise we add 
the identifier to the loop detector, then process config, instantiate the service, whatever. Then, before return the service 
instance, we remove the identifier from the loop detector, to allow already used references on other nodes starting from this level.

To extend my language skills with some visual explanation, I made a shitty illustration to demonstrate the valid and invalid 
reference:

<figure class="a-illustration">
    <img class="a-illustration__image" src="/assets/img/post-illustration-placeholder.png" data-src="/assets/img/blog/2020/backend/diy-dependency-injection-container-3/references.png" width="700">
    <figcaption class="a-illustration__caption">Valid and invalid references</figcaption>
</figure>

In this example referencing `Service C` twice is valid, as they are on different nodes, but referencing `Service A` again will throw an error.
If we split this up, we can instantiate `Service C` alone, and `Service B` (with `Service C` in the argument), but we can never instantiate
`Service A` and `Service D`... 

#### Return the service or die

This `getFromContainer` will do nothing else, just prepare the service, and get it back if it exists. It can return in two ways:

* the same instance for the same identifier every time
* a new instance for the same identifier every time

For the second option I prefer to use the `clone` technique, because we can benefit from the use of `__clone` magic method, which is
much better than re-instantiate a class every time. The way of return controlled by the `shared` configuration option.

If the service does not exist, we simply throw an exception. There's always a big argument about the good behaviour: in case of not
find something is a `return null` or an Exception. I would say it always depends on the context. In this case I would prefer the exception, 
because it's not a database query controlled by user input to list something, and it can happen that there will be no result for the 
search expressions. No.

In this case we **must** have a result. If the configuration is wrong, or the autoloader is not configured well, or some PHP extension is
not loaded, and we want the DI to return the given instance, then it's a big fucking exception when it can't.

So here we go: 

```php
/**
 * @param string $identifier
 * @throws RuntimeException
 * @return object
 */
private function getFromContainer(string $identifier): object
{
    // ...

    $this->referenceLoopDetector[] = $identifier;

    if (!$this->isServiceRegisteredIntoLibrary($identifier)) {
        throw new OutOfBoundsException(
            sprintf('The given service (%s) is not defined service or class name.', $identifier)
        );
    }
    
    array_pop($this->referenceLoopDetector);

    return $this->serviceLibrary[$identifier][self::SERVICE_SHARE]
        ? $this->serviceContainer[$identifier]
        : clone $this->serviceContainer[$identifier];
}
```

That is all nice, but if you remember I wrote that we build the library on the fly. So in this for the DI won't return 
anything, since it's still empty. So it's time to dig deeper in the hole, and prepare the service.

#### Preparing the service

Preparing the service is a two step check:

1. If the service is not yet in the Service Library, then register it.
2. If the service in the Service Library but not in the Container, then add it to the container.

```php
private function getFromContainer(string $identifier): object
{
    // ...

    $this->referenceLoopDetector[] = $identifier;

    $this->prepareService($identifier); // <-- the new thing here

    if (!$this->isServiceRegisteredIntoLibrary($identifier)) {
        // exception
    }
    
    // ...
}

private function prepareService(string $identifier): void
{
    // Not registered in the library but it's a valid class name, or it's in the raw configuration: register.
    if (
        !$this->isServiceRegisteredIntoLibrary($identifier)
        && $this->isServiceRegistrableIntoLibrary($identifier)
    ) {
        $this->registerServiceToLibrary($identifier);
    }

    // Registered in the library but not in the container, so register it there too.
    if (
        $this->isServiceRegisteredIntoLibrary($identifier)
        && !$this->isServiceRegisteredIntoContainer($identifier)
    ) {
        $this->registerServiceToContainer($identifier);
    }
}
```

As you can see, for the checks we use those methods we already used for the `has` method. 

##### Register the service into the Container.

I start this one, because it's the simpler one. Register a service into the container means:

* Resolve the class constructor argument references
* Instantiate the given service with the arguments
* Resolve the argument references for the methods to be called
* Call the methods 
* Save the instance into the Container
* Mark the service as initialized in the Service Library

Sound complex first, but it ain't. Let's go step-by-step. 

###### 1. Resolve argument references

Here we just pass the configured arguments array to a new function (always focus on to reduce complexity), then we just 
iterate through this list, and when the give key in the array is numeric, we try to get the service for it, otherwise
just simply store the value. In the end, return the new argument list with the resolved references.

Do you remember the <a href="/backend/diy-dependency-injection-container-2#indexes">previous part</a> when I explained the
way I will separate literal argument values from the service references? Here it is.

```php
private function registerServiceToContainer(string $identifier): void
{
    // Check arguments.
    $argumentList = $this->setArgumentListReferences($this->serviceLibrary[$identifier][self::SERVICE_ARGUMENTS]);
}

private function setArgumentListReferences(array $argumentList): array
{
    $resolvedArgumentList = [];

    foreach ($argumentList as $key => $value) {
        // Numeric keys marks reference values
        if (is_numeric($key)) {
            $value = $this->getFromContainer($value);
        }

        $resolvedArgumentList[] = $value;
    }

    return $resolvedArgumentList;
}
```

Later, when we will prepare the Service Library, we will make sure that the structure is always consistent, so here and now 
we don't have to check whether the indexes are existing, because they are. 

###### 2. Instantiate the service

Earlier every framework and library used that annoying `ReflectionClass` to workaround the problem of passing arguments to the
constructor, but since PHP 5.6 already we can use an array as arguments with the `... $args` syntax. Brilliant. We will just do it:

```php
private function registerServiceToContainer(string $identifier): void
{
    // Check arguments.
    // $argumentList = ...

    // Create new instance.
    $className = $this->serviceLibrary[$identifier][self::SERVICE_CLASS];
    $serviceInstance = new $className(...$argumentList);
}
```

Again, when we will prepare the Service Library later, the value under the `self::SERVICE_CLASS` index will always be a validated
classname, and not an alias. 

###### 3. Call methods after service instantiation

If you remember, in the <a href="/backend/diy-dependency-injection-container-2#post-init-calls">previous part</a> I described
how the method call list must be structured. Every element must contain the method name, and its argument list.

So we have to iterate through on this list, check if the method exists, and handle its arguments the same way we did for the 
class constructor, then perform the call.

```php
private function registerServiceToContainer(string $identifier): void
{
    // ...
    $serviceInstance = new $className(...$argumentList);

    // Perform post init method calls.
    foreach ($this->serviceLibrary[$identifier][self::SERVICE_METHOD_CALL] as $methodCallList) {
        $method = $methodCallList[0];

        if (!method_exists($serviceInstance, $method)) {
            throw new RuntimeException(
                sprintf('The method "%s::%s" does not exist or not public.', $className, $method)
            );
        }

        $methodArgumentList = $this->setArgumentListReferences($methodCallList[1] ?? []);
        $serviceInstance->$method(...$methodArgumentList);
    }
}
```

If the method does not exist, we again throw an exception. Anyway it will be a fatal error (`Throwable`), if the configuration
is wrong and we pass too few arguments, or with wrong type, order etc.

###### 4. Register the instance into the Container

... and mark it as initialized in the Library.

```php
private function registerServiceToContainer(string $identifier): void
{
    // ...

    // Register service.
    $this->serviceContainer[$identifier] = $serviceInstance;

    // Mark as initialized.
    $this->serviceLibrary[$identifier][self::SERVICE_INITIALIZED] = true;
}
```

##### Register the service into the Library.

As the last brick in our beautiful house is to build the library. This means:

* Parse the raw config and prepare the values. 
* Resolve configuration inheritance. And detect inheritance loops.
* Validate the service class belongs to the identifier. Also handle the case when the identifier itself a valid class.
* Fill missing information with defaults.

###### 1. Parse the config

Because we go deeper and deeper, and try to keep the code as clean as possible, we again start the "Register..." function
with a call to another method to collect data. This method is the `getServiceConfiguration`:

```php
/**
 * @var array An intermediate store for partially prepared data.
 */
private array $serviceConfiguration;

private function registerServiceToLibrary(string $identifier): void
{
    $serviceConfiguration = $this->getServiceConfiguration($identifier);
}

private function getServiceConfiguration(string $identifier): array
{
    if (isset($this->serviceConfiguration[$identifier])) {
        return $this->serviceConfiguration[$identifier];
    }
    
    // In case of classes without config, we provide an empty array
    $configuration = $this->configuration[$identifier] ?? [];

    // Resolve inheritance.
    $this->resolveInheritance($configuration, $identifier);

    // Save the configuration.
    $this->serviceConfiguration[$identifier] = $configuration;

    return $configuration;
}
```
First we check if we already have a half-ready data in the new, temporary storage: `serviceConfiguration`. This is a half-ready state 
between the raw configuration and the Service Library. Why we need this? Just for safety. We should never mess up the raw configuration, 
and we should never store half-ready information in the Service Library. We can call it temp data if you like.

So if we already have this temp data for the given service, we return it. If we don't, then  pick up the raw configuration for the give
service and go on. It's no problem, if we don't have a configuration for the requested class, until the identifier is an instantiable 
class, and the object can be created without arguments. Otherwise we will throw an exception in the `getFromContainer` 
<a href="#preparing-the-service">as I wrote earlier</a>.

###### 2. Resolve the inheritance

The `getServiceConfiguration` will call the `resolveInheritance` method, which will modify the temporary config data if needed.
Let's see, how it does:

* Check if there's inheritance configuration for the service at all. No means no change.
* Check if the inheritance doesn't get into a loop. Yes means exception.
* Get the configuration of the parent service.
* Overwrite the parent's copied configuration with the given ones.
* Set the class name definition if not given. 

This whole concept will look like this. It's a bigger code sample, but makes no sense to split into more calls. Only to reduce the 
complexity I put the inheritance loop check into a different method.

```php
private array $inheritanceLoopDetector = [];

private function resolveInheritance(array &$configuration, string $identifier): void
{
    if (!isset($configuration[self::SERVICE_INHERIT])) {
        return;
    }

    $this->checkForInheritanceLoop($configuration[self::SERVICE_INHERIT], $identifier);

    $this->inheritanceLoopDetector[] = $identifier;
    $parentConfiguration = $this->getServiceConfiguration($configuration[self::SERVICE_INHERIT]);

    // not needed any more
    unset($configuration[self::SERVICE_INHERIT]);

    // Overwrite the parent service's config with the current service's config
    foreach ($configuration as $key => $value) {
        $parentConfiguration[$key] = $value;
    }

    // If the class name is not explicitly defined but the identifier is a valid class name,
    // the inherited class name should be overwritten.
    if (!isset($configuration[self::SERVICE_CLASS]) && class_exists($identifier)) {
        $parentConfiguration[self::SERVICE_CLASS] = $identifier;
    }

    $configuration = $parentConfiguration;
}

private function checkForInheritanceLoop(string $parentIdentifier, string $identifier): void
{
    if ($parentIdentifier === $identifier) {
        throw new RuntimeException(
            sprintf('Self referencing is not allowed: %s', $identifier),
            1004
        );
    }

    if (in_array($identifier, $this->inheritanceLoopDetector, true)) {
        throw new RuntimeException(
            sprintf('Inheritance loop detected for service: %s', $identifier),
            1005
        );
    }
}
```

To detect an inheritance loop, we add a new class property `inheritanceLoopDetector` and it works the same way as the 
`referenceLoopDetector`. But here, we dont need to remove the added identifier before the end of the function, because
at once we discover only one and exactly one node. No support for multi-inheritance yet.

So we passed the checks, then we get the parent's configuration. There's a recursion, - as the `getServiceConfiguration` 
calls the `resolveInheritance` and it calls the `getServiceConfiguration` back and so on. And that's why we need to loop detection,
to avoid the infinite loops.

When we have the parent's configuration data, we iterate through on the current service's config and overwrite anything 
in the parent config we explicitly set for our service. Except the `self::SERVICE_INHERIT` key. The parent configuration
for sure doesn't have this key, since it's already finished this resolve process.

And to handle the weird case when the class name is not explicitly defined but the service identifier is a valid class name, then
we should overwrite the inherited class name too.

So the inheritance chain is resolved, the class definition is corrected, we are ready to register the service into the Library. 
Almost. 

###### 3. Validate service class name

Let's get back to the `registerServiceToLibrary` method. After we have the service configuration, we can check if the class
we have defined there is a valid, instantiable class or not. If not, as before we throw an exception.

```php
private function registerServiceToLibrary(string $identifier): void
{
    $serviceConfiguration = $this->getServiceConfiguration($identifier);
    $className = $serviceConfiguration[self::SERVICE_CLASS] ?? $identifier;
    
    if (!class_exists($className)) {
        throw new RuntimeException(
            sprintf('The resolved class "%s" cannot be found.', $className)
        );
    }
}
```

###### 4. Register service into the library

Now we have all the information to register the service to the Service Library.

```php
private function registerServiceToLibrary(string $identifier): void
{
    // ...

    $this->serviceLibrary[$identifier] = [
        self::SERVICE_INITIALIZED => false,
        self::SERVICE_CLASS => $className,
        self::SERVICE_ARGUMENTS => $serviceConfiguration[self::SERVICE_ARGUMENTS] ?? [],
        self::SERVICE_METHOD_CALL => $serviceConfiguration[self::SERVICE_METHOD_CALL] ?? [],
        self::SERVICE_SHARE => $serviceConfiguration[self::SERVICE_SHARE] ?? true,
    ];
}
```

Of course we set the `self::SERVICE_INITIALIZED` flag to `false` until the service instance is not really created. The
rest of the information are either already there, so it's a simple assignment, or just fall back to defaults. 

And pretty much that's is.

### Code quality

In the beginning of this article I wrote that for this development I don't need TDD. And yet, during write the article, I 
had to modify the working code several times, add new unit test cases. So in fact I was wrong. And in fact when I had once an
idea of a "maybe fail" use case, I definitely wrote the unit test first for it to see if it really fails. And when it did, 
I improved the code. So in the end **I fuckin' did TDD!** Hell yeah.

But unit tests are one thing. I tried to keep my code clean and nice all the time, and I used a bunch of tool to help me 
achieve this noble goal:

* `phplint` to detect syntax errors.
* `PHP Mess Detector` to detect the mess (hahahaha).
* `PHP Code Sniffer` to validate against <a target="_blank" rel="noopener" href="https://www.php-fig.org/psr/psr-12/">PSR-12</a>.
* `CS-Fixer` to automatically fix code style glitches.
* `PHP Unit` to verify my theory and find failures in the logic.
* `PHPStan` turned up to level 7 check, to make sure my code can't be any better.
* `PHP7.4 docker image` to run all these tests

Unfortunately the latest `PHPStan` started crying if I use array as a parameter or a return type, and I don't super precisely define
it's structure in the PHPDoc. I understand the concept behind the idea, it's just simply don't work in this case. So I ignore these checks:

```
    ignoreErrors:
        - '#return type has no value type specified in iterable type array#'
        - '#with no value type specified in iterable type array#'
        - '#type specified in iterable type (array|iterable)#'
```

### Conclusion

It was a fun to create this simple and small DI class. But even if it works well - I am pretty sure about that - I don't recommend to
use it in production, because I will probably won't maintain it too long. I made it for practice, to improve my skill and to 
do something I can write about on this blog.  

You can get the full source code with the unit tests and docker setup and instruction at 
<a href="https://github.com/Gixx/worstpractice-dependency-injection" target="_blank" rel="noopener">GitHub</a>.

I hope, you enjoyed this miniseries, maybe others will follow.
