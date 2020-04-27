---
layout: post
title: "DIY Dependency Injection Container, Part 1"
date: "2020-04-26 22:29:00 +0100"
level: 'intermediate'
expiration: 'none'
illustration: 'dependency-injection.jpg'
illustrationCaption: 'Image by <a target="_blank" rel="noopener" href="https://pixabay.com/users/HeungSoon-4523762/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=3902915">HeungSoon</a> from <a target="_blank" rel="noopener" href="https://pixabay.com/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=3902915">Pixabay</a>'
illustration_share: 'dependency-injection_600x600.jpg'
category: 'backend'
categoryLabel: 'Backend'
tags:   [php74,dic,clean-code,solid-principles]
tagLabels: ['PHP 7.4', 'DIC', 'Clean code', 'SOLID Principles']
excerpt: "Like many of my fate companions, I do home office too. And by staying at home, I can save 2-3 hours of travelling every day. So I decided to practice a little bit."
keywords: "PHP 7.4, dependency injection, Clean code, S.O.L.I.D., SOLID Principles, Interface"
review: true
published: true
---

It's very important to clarify: **Do not reinvent the wheel**. There are numerous great, well maintained, continuously
developed solutions on the market written by professional developers, who enjoy the support of their large community. 
I am talking about the big fish like Symfony, Laravel, Zend etc. So if you need a component for your web application,
it's better to look around first.

This article became too long, so I decided to split up to three parts:

* Introduction and the Interface
* The configuration file
* The Dependency Injection Container implementation

### TL;DR

If you don't want to waste your time reading this tutorial, and you only need a working code sample, please check the source code on
<a href="https://github.com/Gixx/worstpractice-dependency-injection" target="_blank" rel="noopener">GitHub</a>.

### Your path is your decision  

Of course nobody can force you to NOT Do It Yourself. It all depend on what your project requires. So let's suppose, you
are not allowed to use third party components for some very mysterious reasons. But you want to write a modern, clean, 
object-oriented code and follow the <a target="_blank" rel="noopener" href="https://medium.com/successivetech/s-o-l-i-d-the-first-5-principles-of-object-oriented-design-with-php-b6d2742c90d7">
<acronym title="Single-responsibility, Open-closed, Liskov substitution, Interface segregation, Dependency Inversion">SOLID</acronym>
Principles</a> as much as possible. 

You look up the books of smart people about smart things. Best practices, software design patterns or just sit on the latest
hype train. Whatever you do - unless you choose to do functional programming - sooner or later you will meet with the 
`Dependency Injection` technique. And you realize it's pretty cool, and you need it. 

But first let's talk about something that is the core of most of the PHP websites in the world today. Even if you are a
*<q cite="https://starwars.fandom.com/wiki/Padawan" title="Jedi student in the Star Wars Universe">young padawan</q>* and
you have never ever heard about it, and you never had to deal with it, it's important.  

#### Autoloader

Not that far in past, only a decade and a half ago, every PHP project was loud about the autoloading of objects. 
There was a kind of race between masterminds who can create the best, more performing, more fool-proof `__autoload` function. 
I talk about the era, when there were no <a target="_blank" rel="noopener" href="https://stackoverflow.com">Stack Overflow</a> 
(2008), not even <a target="_blank" rel="noopener" href="https://symfony.com/">Symfony Framework</a> (2007) or 
<a target="_blank" rel="noopener" href="https://framework.zend.com/">Zend Framework</a> (2006). I talk about the era, when 
everybody was happy to start their green-field projects in the brand new, (and finally but only more-or-less)
Object-Oriented, PHP 5 (2004). 

Later, we got the <a target="_blank" rel="noopener" href="https://www.php-fig.org/psr/psr-0/">PSR-0</a> that was suppose to 
show the way to a better future by giving us a recommendation for the autoloading. But time passes and the PSR-0 became 
obsolete. Today its direct descendant, the <a target="_blank" rel="noopener" href="https://www.php-fig.org/psr/psr-4/">PSR-4</a> 
is in charge.

And if we keep the recommendations of the PSR-4, and we use <a target="_blank" rel="noopener" href="https://getcomposer.org/doc/00-intro.md">composer</a> too, 
we only need to give the path to our namespace, and the rest of the magic is done automatically. No more manual autoloading. 
Here's an example of the `composer.json` configuration:

```json
{
  "autoload": {
    "psr-4": {
      "WorstPractice\\": "./src/WorstPractice"
    }
  },
}
```  
...then all you need to do is to include the composer's autoload file in the entry points of you web application:

```php
require_once __DIR__.'/vendor/autoload.php';

$myObject = new \WorstPractice\Component\MyClass();
```

> Okay, now the classes can load, but what is this dependency thing? 

I already assumed, that you want to write clean code and follow the **S.O.L.I.D.** principles. And what is **D** in this
acronym?
 
#### D is for Dependency Inversion Principle

The Dependency Inversion Principle in a nutshell:

1. High-level modules should not depend on low-level modules. Both should depend on the abstraction.
2. Abstractions should not depend on details. Details should depend on abstractions.

If you don't understand, check <a target="_blank" rel="noopener" title="stackify.com: SOLID Design Principles Explained: Dependency Inversion Principle with Code Examples" href="https://stackify.com/dependency-inversion-principle/">this great tutorial</a>
with explanations and examples.

#### Dependency Injection

Dependency Injection (DI) is a design pattern used to implement Inversion of Control (IoC). Although this shows us a 
causal relationship, actually these terms are generally used interchangeably to describe the same design pattern. 

I hope I could confuse you enough, so let's just use **DI** from now.

#### DI Container

The **DI Container** is a framework/module/component/library for implementing automatic dependency injection. It manages 
object creation, and also injects dependencies to the classes.

### Let's get is started

Up till now you may already used software design patterns, such as <a target="_blank" rel="noopener" href="https://en.wikipedia.org/wiki/Facade_pattern#PHP">Facade</a>,
<a target="_blank" rel="noopener" href="https://en.wikipedia.org/wiki/Singleton_pattern#PHP_implementation">Singleton</a> or
<a target="_blank" rel="noopener" href="https://en.wikipedia.org/wiki/Factory_(object-oriented_programming)#PHP">Factory</a>, etc.

Well, in the world of dependency injection, we can easily get rid of them, making the code cleaner, and more readable for other
human lifeforms. And last but not least it helps a lot to your <acronym title="Integrated Development Environment">IDE</acronym> 
to discover the call chains. One of the primary benefits of DI is the ability to swap implementations of the injected class. That
makes extremely easy to unit test classes.

If you are familiar with the big framework's DI Container solutions, you already know how it works: You create a spooky
configuration where you define the relationship and dependencies between classes and control additional behaviour
such as returning the same instance every time or create new one (Singleton, motherfucker!).

#### DIY DI Container

If we don't want to use third party libraries - and we already clarified this several times -, let's create out own:

* One Interface, because of the <a target="_blank" rel="noopener" href="https://stackify.com/interface-segregation-principle/">Interface Segregation Principle</a>
* A reasonably clean and understandable configuration file
* One single class to rule them all

##### The Interface

I wrote in the beginning of this article that you don't need to reinvent the wheel. Or not completely. There are agreements
on how a DI Container should behave. And there is a quasi standard for it. And a standard is not a library, a standard is a
collection of rules and blueprints. You wouldn't start to build your dream house without a blueprint, would you? I guess no.

So let's grab this blueprint, and take a closer look.

```php
namespace Psr\Container;

/**
 * Describes the interface of a container that exposes methods to read its entries.
 */
interface ContainerInterface
{
    /**
     * Finds an entry of the container by its identifier and returns it.
     *
     * @param string $id Identifier of the entry to look for.
     *
     * @throws NotFoundExceptionInterface  No entry was found for **this** identifier.
     * @throws ContainerExceptionInterface Error while retrieving the entry.
     *
     * @return mixed Entry.
     */
    public function get($id);

    /**
     * Returns true if the container can return an entry for the given identifier.
     * Returns false otherwise.
     *
     * `has($id)` returning true does not mean that `get($id)` will not throw an exception.
     * It does however mean that `get($id)` will not throw a `NotFoundExceptionInterface`.
     *
     * @param string $id Identifier of the entry to look for.
     *
     * @return bool
     */
    public function has($id);
}
```

Now we have a nice blueprint, but this blueprint unfortunately isn't perfect. A good start, but there are some problems: 

* It's backward compatible with earlier PHP editions, which means no type hinting: 
    * no parameter type hints, and we can't add them for the implementation either.
    * no return types, but luckily we can override this.    
* It suggests to create new Exceptions that implement these two `NotFoundExceptionInterface` and `ContainerExceptionInterface`.  
  Honestly I always preferred the use the built-in ones. Those cover most of our needs.
* There is no declaration of adding instances to the container, but sometimes you can't set up everything in the configuration. 

We have two chances:
1. Use the `Psr\Container\ContainerInterface` and extend it, but we will loose on the type hinting.
2. Create our own interface but whenever somebody requires the DI to be `instanceof Psr\Container\ContainerInterface`, ours will fail.

And because of implementation interchangeability - though reluctantly -, I still choose the first option. Let's extend, and
create the possibility to add instantiated objects to the container. Since this interface has a repository, we don't 
- what's more, we shouldn't - copy it but import it. Run the following in the command line in your project's document root:

```bash
composer require psr/container
```

...or add it manually to your `composer.json` file:

```json
  "require": {
    "php": ">=7.4",
    "psr/container": "1.0.0"
  },
```

Additionally we set a requirement on the PHP version too. Now it's time to create our interface: 
`src/WorstPractice/Component/DependencyInjection/ContainerInterface.php`

```php

<?php

declare(strict_types=1);

namespace WorstPractice\Component\DependencyInjection;

use Psr\Container\ContainerInterface as PsrContainerInterface;
use RuntimeException;

/**
 * Interface ContainerInterface
 * @package WorstPractice\Component\DependencyInjection
 */
interface ContainerInterface extends PsrContainerInterface
{
    /**
     * Register the service object instance.
     *
     * @param string $identifier
     * @param object $serviceInstance
     * @param bool   $isShared
     * @throws RuntimeException
     */
    public function set(string $identifier, object $serviceInstance, bool $isShared = true): void;
}
``` 

As you can see, I really mean to use the strict types. I think that is the most important feature improvement in PHP lately.
However, a DI Container is typically NOT a service that can be typed pretty well, unless we call the `object` a precise
type hint.

So what does this Interface do? It extends the `Psr\Container\ContainerInterface` to keep its benefits. Then we declared
our extravagant method: `set`. It has three parameters, two is mandatory, the third is optional.

* `$identifier`: String. It's the instance's class name, or just an alias of your choice. It's important that the value 
  to be unique, or match to a configuration definition, that has not been initialized yet.
* `$instance`: Object. It's an object that have been initialized already but not destructed yet. 
* `$isShared`: Boolean. It will tell the DI container how this instance should be handled upon getting it: return a clone (new 
  instance every time) or the same instance (be like a singleton, but without the hateful `::getInstance();`)
  
The method in normal case should not return anything. Why it should? Do we wait any kind of response? The only response 
should be an exception, that is thrown when we try to add an instance with an alias that is already instantiated.
This show how important is to use this method wisely. It's not a common case when we need this, and that is why it's not part
of the PSR Interface. 
However other implementations, like the <a target="_blank" rel="noopener" href="https://github.com/symfony/dependency-injection/blob/master/ContainerInterface.php">Symfony DI</a>
(just to pick one) also feels it important to have this `set` method. So ours won't be that renitent.
    

In the next part we will plan the configuration file.
