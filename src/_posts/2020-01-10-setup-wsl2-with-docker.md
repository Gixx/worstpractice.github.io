---
layout: post
title: "Setup WSL2 with Docker"
date: "2020-01-10 10:00:00 +0100"
level: 'Beginner'
expiration: "2020-06-01"
illustration: 'fishing.jpg'
illustrationCaption: ''
illustration_share: 'fishing_600x600.jpg'
category: wsl
categoryLabel: 'WSL'
tags:   [docker,wsl2,poweline-shell,phpstorm,windows]
tagLabels: ['Docker','WSL2', 'Powerline Shell','PHPStorm','Windows']
excerpt: 'I collected all the steps I had to make to build a full-value (web)development environment on Windows 10.'
review: true
---

### Prolog

For this experiment I used my own desktop PC which was recently upgraded after 7 years. New motherboard, new CPU, new
RAM, new VGA. The upgradable components are the benefits, when you have an old-fashioned workstation. And for the new
hardware, I installed a brand new Windows 10 Professional. Please don't start flame war about operating systems, I
have my own reasons to choose this.

With the clean install I found it to be the perfect time to use all the knowledge I gathered during the years, and bring
together a smooth, easy-to-use and maintainable workspace for web development, that sucks less to set up and feels better
to use than ever before.

### // @TODO follow the trail

#### Before you start

The following list will change soon, as Microsoft will ship all the new features in Q2 2020 (if they can keep the deadlines).
That is why I set the expiration day of this article to the upcoming months. So this tutorial is for those who don't want to
wait and are not afraid of taking a little bit of risk.

#### The list

It might be too long to write a step-by-step tutorial, and we all know, that when we need something, we only need to search
for it on the Internet, and there's a high chance to find the right solution. No need to reinvent the wheel.

In fact, the following links cover most part of the setup process, so I just had to put them in the right order. But since some of them are
not so recent, I unintentionally made <a href="#additional-discoveries">new discoveries</a>. Don't forget to read them before you
take the actions described on the linked pages.

So here are the sources you will need to have a nice DIY-day:

1. <a href="https://www.microsoft.com/en-gb/software-download/windows10ISO" target="_blank">Install Windows 10</a>.
2. <a href="https://winaero.com/blog/enable-openssh-client-windows-10/" target="_blank">Enable the built-in OpenSSH Client</a> if it's not present by default.
3. <a href="https://insider.windows.com/en-us/" target="_blank">Join the Insider Program</a>.
4. <a href="https://www.windowscentral.com/how-switch-between-fast-and-slow-rings-windows-10-insider-preview" target="_blank">Change your Insider settings to the "Fast Ring"</a>, to get the Windows **build 18917** or higher.
5. <a href="https://gitforwindows.org/" target="_blank">Install Git for Windows</a>.
6. <a href="https://docs.microsoft.com/en-us/windows/wsl/install-win10" target="_blank">Install WSL1</a>.
7. <a href="https://docs.microsoft.com/en-us/windows/wsl/wsl2-install" target="_blank">Install WSL2</a>.
8. <a href="https://docs.docker.com/docker-for-windows/edge-release-notes/" target="_blank">Install the Edge release of the Docker Desktop Community</a>, version 2.1.7.0 or higher
9. <a href="https://devblogs.microsoft.com/commandline/share-environment-vars-between-wsl-and-windows/" target="_blank">Share ENV variables between WSL and Windows</a>
10. <a href="https://blog.joaograssi.com/windows-subsystem-for-linux-with-oh-my-zsh-conemu/" target="_blank">Set up a more productive shell</a>
11. <a href="https://blog.anaisbetts.org/using-github-credentials-in-wsl2/" target="_blank">Fix the "git push to GitHub from WSL" issue</a>

From this point you can start your work with docker, it's easy and fun. If you use PHPStorm for your work, <a href="#phpstorm">I have some tips</a>
to make your life a little bit easier.

### <a name="additional-discoveries"></a>Additional discoveries

#### In step #2: About the OpenSSH

In my Windows 10 build the OpenSSH Client was enabled by default. It's a luck, because I missed the release notes that
Microsoft actually added it to the Windows at all. Otherwise I would install some third party solution. But the built-in
is just as good as any other or even better.

#### In step #8: Issues with the Docker Desktop

After installing the Edge release, start the application (look for it in the system tray), right click on the icon and
choose the settings. There **you MUST uncheck** the _Start Docker Desktop when you log in_ option to avoid to start automatically
earlier than the WSL2 engine. Because when it happens, none of your local drives will be mounted in any of the Docker containers
and mounting manually always sucks.

<figure class="a-illustration">
    <img class="a-illustration__image" src="/assets/img/post-illustration-placeholder.png" data-src="/assets/img/blog/2020/wsl/setup-wsl2-with-docker/docker-desktop.png" width="700" height="410">
    <figcaption class="a-illustration__caption">Settings of the Docker Desktop</figcaption>
</figure>

Under the _Resources_ menu, enable the WSL integration by selecting the Linux distribution you have.

<figure class="a-illustration">
    <img class="a-illustration__image" src="/assets/img/post-illustration-placeholder.png" data-src="/assets/img/blog/2020/wsl/setup-wsl2-with-docker/docker-desktop-2.png" width="700" height="410">
    <figcaption class="a-illustration__caption">Choose your WSL distribution</figcaption>
</figure>

And in the future, first always start the WSL first, and then the Docker Desktop app.

#### In step #10: Skip the terminal emulator part

Many tutorial pages devote a whole chapter to the terminal emulators, particularly to the ConEmu. No doubt, that is a marvellous application,
but let's stop a little bit and think. Do we really need it? What will we win with another terminal? Okay, the **CMD.exe** is not enough, the
**PowerShell** has a different purpose, the Git for windows shipped the **BASH.exe** which is a good start, but now we have the **WSL.exe**.
We need that, we work with that, we work in that.

### <a name="phpstorm"></a>Fine tuning the PHPStorm terminal

<a href="https://www.jetbrains.com/" target="_blank">JetBrains</a> is an amazing company, which develops some really fantastic and without-only tools
for the developer community. I am a PHP developer, so I use the <a href="https://www.jetbrains.com/phpstorm/" target="_blank">PHPStorm</a>, but if
you feel more comfortable on the frontend side, the <a href="https://www.jetbrains.com/webstorm/" target="_blank">WebStorm</a> is also a perfect choice.
I believe, the common root makes this tutorial valid for the WebStorm as well.

I don't really like the endless path of the Documents folder in Windows, so I usually store my projects on my secondary hard drive: <code>D:\Project</code>.
For the sake of clarity I create an example project: <code>MyTestProject</code>. The PHPStorm sets the built-in terminal's path to the project root, so the
Terminal will look something like this:

<figure class="a-illustration">
    <img class="a-illustration__image" src="/assets/img/post-illustration-placeholder.png" data-src="/assets/img/blog/2020/wsl/setup-wsl2-with-docker/phpstorm.png" width="800" height="571">
    <figcaption class="a-illustration__caption">The default state of the Terminal tool in PHPStorm</figcaption>
</figure>

The PHPStorm uses the <code>CMD.exe</code> by default, but luckily we can change that at our own will.

<figure class="a-illustration">
    <img class="a-illustration__image" src="/assets/img/post-illustration-placeholder.png" data-src="/assets/img/blog/2020/wsl/setup-wsl2-with-docker/phpstorm-2.png" width="800" height="574">
    <figcaption class="a-illustration__caption">Terminal settings in PHPStorm</figcaption>
</figure>

If the we change the <code>Shell path</code>'s value to <code>C:\Windows\System32\wsl.exe</code>, we see our beautiful PowerlineShell prompt we had
set up in the step #10. First you need to close any opened PHPStorm Terminal window to make the changes take affect.

<figure class="a-illustration">
    <img class="a-illustration__image" src="/assets/img/post-illustration-placeholder.png" data-src="/assets/img/blog/2020/wsl/setup-wsl2-with-docker/phpstorm-3.png" width="800" height="180">
    <figcaption class="a-illustration__caption">The Terminal tool with the WSL prompt</figcaption>
</figure>

It's simple, isn't it? Then why am I wasting your previous time on write about a straightforward process? The answer is:

> Because in some cases - which I can't identify - the Docker gives an extra twist to the simplicity.

Yes, we want to use Docker. So let's create a simple Docker machine. Personally I like the <code>docker-compose up -d</code> command more than the
<code>docker run --one --billion --different --spooky --parameters</code>. So let's create a simple Docker composition for webpack :

```yaml
version: '3.7'
services:
  my_webpack:
    build:
      context: .
      dockerfile: docker.my_webpack
    container_name: 'my_webpack'
    volumes:
      - './:/app'
```

...and a <code>DOCKERFILE</code>, named <code>docker.my_webpack</code>:

```docker
FROM node:13.4.0-alpine

WORKDIR /app

RUN npm install webpack@4.41.2 -g
RUN npm install webpack-cli@3.3.10 -g
RUN apk add bash
CMD tail -f /dev/null
```

After finish the set up, the Terminal prompt may - but not necessarily - change from the project's folder to WSL mounting point, and will look something like this:

<figure class="a-illustration">
    <img class="a-illustration__image" src="/assets/img/post-illustration-placeholder.png" data-src="/assets/img/blog/2020/wsl/setup-wsl2-with-docker/phpstorm-4.png" width="800" height="120">
    <figcaption class="a-illustration__caption">The Terminal tool with wrong default path</figcaption>
</figure>

I am not sure why it happens if it happens at all, and not sure why it doesn't happen for others with the same setup. But it's a fact, it happened to me.
And one thing is sure: this is definitely not good. So how can we fix it? We need to use the environment variable in the PHPStorm we have seen
in step #9, and modify the <code>.zshrc</code> file in the WSL interface.

#### Add custom ENVIRONMENT variable to PHPStorm's Terminal

Open up the Terminal's settings window in PHPStorm again, and in the <code>Environment variables</code> field add the following:

```
PROJECT=MyTestProject;PATH=%PATH%\;D:\Projects;WSLENV=PROJECT/u
```

Let me explain what we added:
* <code>PROJECT=MyTestProject</code> - we define a new environment variable, PROJECT and its value is the folder name of our project
* <code>PATH=%PATH%\;D:\Projects</code> - we add the project's parent folder to the PATH
* <code>WSLENV=PROJECT/u</code> - we pass the PROJECT variable to the WSLENV. The <code>\u</code> flag indicates the value should only be included when invoking WSL from Win32.

As you see, the PATH variable is not included in the WSLENV, however if we don't present it here, the WSL won't start.

So, in theory when the PHPStorm opens its Terminal emulator and calls the <code>wsl.exe</code>, it should pass all these variables to it.

####  Change the ZShell init script

Let's get into the <code>WSL</code> command line and edit the <code>.zshrc</code> file in the "_home_" folder:

```bash
vim ~/.zshrc
```

Add the following lines to the end of the file:

```bash
# correct the initial path
cd /mnt/d/Projects

# correct the project path
if [[ -v PROJECT ]]; then
    cd $PROJECT
fi
```

First we enforce the <code>WSL</code> to go into our general project root folder's mounted equivalent: <code>/mnt/d/Projects</code>. I think it's
not a bad idea to start our work in WSL always in the same folder to not mess up the whole system.

Second, we look for the <code>PROJECT</code> environment variable. Remember, we've just passed it through the WSLENV. If this variable exists, it
tries to use it as a folder name, and additionally to the previous, it tries to enter into it. If we set it up correctly, this should work.

### That's all for now

Am I right? Am I not? Please feel free to share your opinions.
