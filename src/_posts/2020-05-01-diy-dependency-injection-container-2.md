---
layout: post
title: "DIY Dependency Injection Container, Part 2"
date: "2020-05-12 09:37:00 +0100"
level: 'intermediate'
expiration: 'none'
illustration: 'dependency-injection.jpg'
illustrationCaption: 'Image by Gábor Iván, edited with <a target="_blank" rel="noopener" href="https://www.gimp.org/">Gimp</a>"'
illustration_share: 'dependency-injection_600x600.jpg'
category: 'backend'
categoryLabel: 'Backend'
tags:   [php74,dic,clean-code,yaml]
tagLabels: ['PHP 7.4', 'DIC', 'Clean code', 'YAML']
excerpt: "The second step on our journey to create a stand-alone Dependency Injection Container. Discuss about the configuration doesn't sound too interesting, but it can hold us some surprises."
keywords: "PHP 7.4, dependency injection, Clean code, S.O.L.I.D., SOLID Principles, Interface"
review: true
published: true
---

In the <a rel="prev" href="/backend/diy-dependency-injection-container">previous part</a>, we talked about software engineering principles,
about the dependency injection and its benefits, and we started to create our own implementation. We've finished with the
Interface so far. In this article we will configuration the configuration data.

### TL;DR

If you don't want to waste your time reading this tutorial, and you only need a working code sample, please check the source code on
<a href="https://github.com/Gixx/worstpractice-dependency-injection" target="_blank" rel="noopener">GitHub</a>.

### Choose the right weapon

You have probably met with the world wide popular <acronym title="YAML Ain't Markup Language">YAML</acronym> file format. If not,
then I tell you that the YAML is a human friendly data serialization standard for all programming languages. It can look
something like this:

```yaml
services:
  queue:
    class: \Namespace\To\Messaging\Queue
    arguments: 
      - '%config.host%'
      - '%config.user%'
      - '%config.password%'

  queu.builder:
    class: \Namespace\To\Messaging\Queue\Builder
    public: false

  some.spooky.service:
    class: \Namespace\To\Spooky\Service
    factory: ['@queue.builder', queue]
    calls: [someMethod, ['some parameter']]
``` 

In general, that would be good for us. But unfortunately it ain't. Because the PHP has no native support for it. Now I 
see five options to choose from:

1. Use the Symfony package, that supports the latest YAML 1.2 standard.
2. Use the <acronym title="PHP Extension Community Library">PECL</acronym> extension, that supports only the YAML 1.1 standard.
3. Use another third-party PHP library.
4. Write our own YAML parser.
5. Give a damn and use associative arrays.

Well, we already discussed in the previous part, that we don't want to use any third-party libraries, so option 1 and 3 fell off. 
Maybe we can't add PECL extensions to our current setup, so option 2 also fell off. Write an own parser? Waste time to 
create a complex a codebase that covers the full YAML standard and we maybe don't even need the half of the YAML's knowledge?
And when we think about it, in the end, deep inside all the parsers the whole thing will end up in an average associative 
array or Iterable class. Then why should we waste our time on this?

#### Pros of the array-based configuration

* No need to parse: better performance, lower memory consumption. Theoretically.
* It's raw PHP, you don't have to learn another syntax.
* You can add closures, which I really hate, but many developers love closures, so it's a benefit.

#### Cons of the array-based configuration

* The return types probably won't be recognized by the IDE.
* Difficult to overview the structure.
* For multiple configurations we have to take care of their proper merge. 

### Define the required structure

In the previous section the YAML code is a perfect example to draw inspiration from it. It describes a clean 
structure with several behaviours that we will try more or less copy. The YAML is good for many things and not only 
for dependency injections, which in the most common use-case (Symfony of course) defined under the `services` block. 
But since our configuration will be a PHP array, and we want it to use only for the DI, we skip this level:

```php
$config = [
    // services
];
```

#### Service identifier

A service identifier is a string of characters. Oh GOD, you didn't belive it, did you? It can be a fantasy name as well 
as a real class name including the `::class` constant:

```php
$config = [
    'fantasy service name' => [
        // ...
    ],
    "\\Namespace\\To\\MyClass" => [
        // ...
    ],
    \Namespace\To\Another\Service::class => [
        // ...
    ],
];
```

The identifiers are the first level keys in the configuration array.

#### Class reference

A second level key, with single string value. It is a class name or class constant string that points to an instantiatable 
class. If the service identifier already points to such class, then this sub-key is optional.   

```php
$config = [
    \Namespace\To\MyService::class => [
        // no need the 'class` key here
    ],
    \Namespace\To\Some\ServiceInterface::class = [
        'class' => \Namespace\To\Some\Service::class,
    ],
    "\\Namespace\\To\\AbstractService" => [
        'class' => \Namespace\To\Another\Service::class,
    ],   
];
```

This class reference can't point to another service identifier, because that would be some kind of inheritance, and we
will handle it in a separate key to make the DIC more fool-proof. So the following code should raise an error:

```php
// WRONG !!!
$config = [
    'some.service' = [
        'class' => \Namespace\To\Some\Service::class,
    ],
    \Namespace\To\Some\ServiceInterface::class = [
        'class' => 'some.service',
    ],
];
```

#### Class constructor arguments

Of course the dependency injection makes no sense, when all our services are simple objects without any initial data.
Yes, we can use `setters` instead of constructor arguments, but I think it should be a matter of our own taste. 
Both the constructor arguments and the setter methods have tops and flops, I won't discriminate one for the other. I 
used to keep myself to a simple rule: under a sane amount of parameters I prefer to use constructor arguments.

```php
$config = [
    \Namespace\To\Some\ServiceInterface::class = [
        'class' => \Namespace\To\Some\Service::class,
        'arguments' => [
            'some parameter'
        ],       
    ],
];
```

That's all nice, but we want to **inject** classes too. How to separate scalar values from service references? Let's
suppose we have the following class:

```php
namespace Namespace\To\My\Service;

use Namespace\To\Some\Service;

class MakesNoSense {
    /** @var string */
    private $serviceIdentifier;
    /** @var SomeService */
    private $service;

    public function __construct(string $serviceIdentifier, Service $service) {
        $this->serviceIdentifier = $serviceIdentifier;
        $this->service = $service;
    }
    // ...
}
```

...and we have the corresponding config: 

```php
$config = [
    'some.service' => [
        'class' => Namespace\To\Some\Service::class
    ],
    Namespace\To\My\Service\MakesNoSense::class => [
        'arguments' => [
            'some.service',
            'some.service'
        ]   
    ]
];
```

... then how we should write our DIC to handle this case? 
* We can use Reflection class to find out the parameter types, but that would go too far, and would make the code 
    unnecessarily complex. And maybe slow too.
* We could use some special character (like `@`) to mark class references, as they do in the Symfony YAML configs: 
    ```yaml
    services:
        makes.no.sence.service:
            class: \Namespace\To\Service\MakesNoSense
            arguments:
                - 'some.service'
                - '@some.service'
    ``` 
    ... but this would require an extra `substr` or `strpos` check.
* Or we can use a straightforward trick to mark which parameter is scalar and which is not.

Let's think about the third option. What do we have in PHP that can differentiate two identical values in an array?

##### INDEXES!

What's more: **associative indexes**. And since class names are more-or-less self descriptive parameter values, 
I would say, let's use an explicit string index (key) for the scalar parameters only. So our previous config will look 
like this:

```php
$config = [
    'some.service' => [
        'class' => Namespace\To\Some\Service::class
    ],
    Namespace\To\My\Service\MakesNoSense::class => [
        'arguments' => [
            'Service identifier parameter' => 'some.service',
            'some.service'
        ]   
    ]
];
```
Amazing! Then in the DIC we only have to check whether the argument definition's current index is numeric or not, 
and we will immediately know if we need to keep resolve the dependency for the parameter or just pass it as is.         

#### Post-init calls

Sometimes, to fully prepare a service, we need to call a method or to do an additional setup that we can't necessarily
do upon initializing the service. A typical example was the NySQL's `charset` option which was ignored prior to PHP 5.3.6
so we had to set it explicitly:

```php
$connection = new PDO("mysql:host=$host;dbname=$db;charset=utf8",  $user, $password);
if (!defined('PHP_VERSION_ID') || PHP_VERSION_ID <= 50306) {
    $connection->exec("set names utf8");
}
```

And since we plan to use PHP 7.4, this example doesn't valid. Honestly I can't bring any live example right now. But this
doesn't mean there aren't any. So let's support it:

```php
$config = [
    'form.service' => [
        'class' => Namespace\To\Form\Service::class,
        'argument' => [
            'action' => 'login.php',
            'method' => 'POST'
        ],
        'calls' => [           
            ['addElement', ['name' => 'username', 'value' => '', \Namespace\To\Form\Element\TextInput::class]],
            ['addElement', ['name' => 'password', 'value' => '', \Namespace\To\Form\Element\PasswordInput::class]],
            ['addElement', ['name' => 'submit',  'value' => 'Login', \Namespace\To\Form\Element\SubmitButton::class]],
            ['addValidator', [\Namespace\To\Form\Validator\CredentialValidator::class]],
        ],
    ],  
];
```

So in this example we define the config for a HTML Form service. There are constructor scalar parameters, and instead of
creating the form by injecting all the necessary elements, we instead add them with public methods. This is just a very
simple example, but it shows pretty well, how the `calls` sub-key is built up:

* Every element of the `calls` sub-key is an array that defines one single method call.
* The first item of each array is the method name. It must exists as a public method within the class.
* The second item is an array again. It's the argument list of the method and it's optional in those cases when the 
    method doesn't require any parameters. This list behaves the same way as the `argument` list for the class.
* One method can be called multiple times.

#### Singleton

This one is a simple boolean key, called `shared`. If it's TRUE, it means that the instance will be shared along the 
runtime whenever we need it. Otherwise a new instance will be returned by the DIC.

```php
$config = [
    'some.service' => [
        'class' => Namespace\To\Some\Service::class,
        'shared' => true,
    ],
    Namespace\To\My\Service\MakesNoSense::class => [
        'shared' => false   
    ]
];
```

If the `shared` sub-key does not present, it will be considered as TRUE by default.

#### Inheritance

In some cases we want to inherit configuration to avoid unnecessary code repeats, and apply only the differences. We
will be able to do this with the `inherits` key. The value must be an existing `service identifier`, other than the 
current one. Both self- of invalid referencing should raise an error.

To make it less complex, let's say, if any of the sub-key's value is changed, the full sub-key should be presented. 
Also, the `shared` key must present if differs form the ancestor's. So if for the ancestor the shared is FALSE, and 
the descendant should be TRUE, then it must present explicitly, the default behaviour will not applied in this case.

```php
$config = [
    'form.service' => [
        'class' => Namespace\To\Form\Service::class,
        'argument' => [
            'action' => '/login.php',
            'method' => 'POST'
        ],
        'calls' => [           
            ['addElement', ['name' => 'username', 'value' => '', \Namespace\To\Form\Element\TextInput::class]],
            ['addElement', ['name' => 'password', 'value' => '', \Namespace\To\Form\Element\PasswordInput::class]],
            ['addElement', ['name' => 'submit',  'value' => 'Login', \Namespace\To\Form\Element\SubmitButton::class]],
            ['addValidator', [\Namespace\To\Form\Validator\CredentialValidator::class]],
        ],
        'shared' => false,   
    ],
    'shared.form.service' => [
        'inherits' => 'form.service',
        'shared' => true
    ],
    'new.form.service' => [
        'inherits' => 'form.service',
        'argument' => [
            'action' => '/customer/login',
            'method' => 'POST'
        ],
    ],
];
```

And that is all. We covered all the options we need from our DIC implementation to support. And it's only a very small
subset of what the YAML is capable of, yet enough for us.

In the next part we will create our DIC implementation.
