---
layout: post
title: "Start web development on Windows"
date: "2020-01-05 14:38:00 +0100"
expiration: "2020-06-01"
illustration: ''
illustrationCaption: ''
illustration_share: ''
category: docker
categoryLabel: 'Docker'
tags:   [docker,wsl2,phpstorm]
tagLabels: ['Docker','WSL2','PHPStorm']
excerpt: 'I collected all the steps I had to make to build a full-value web development environment on Windows 10.'
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
12. And in the end, I wrote about <a href="#phpstorm">how I set up the PHPStorm terminal</a>

### <a name="additional-discoveries"></a>Additional discoveries

#### In step 2: About the OpenSSH

In my Windows 10 build the OpenSSH Client was enabled by default. It's a luck, because I missed the release notes that
Microsoft actually added it to the Windows at all. Otherwise I would install some third party solution. But the built-in
is just as good as any other or even better. 

#### In step 8: Issues with the Docker Desktop

After installing the Edge release, start the application (look for it in the system tray), right click on the icon and
choose the settings. There **you MUST uncheck** the _Start Docker Desktop when you log in_ option to avoid to start automatically
earlier than the WSL2 engine. Because when it happens, none of your local drives will be mounted in any of the Docker containers 
and mounting manually always sucks.

<figure class="a-illustration">
    <img class="a-illustration__image" src="/assets/img/post-illustration-placeholder.jpg" data-src="/assets/img/blog/2020/docker/start-web-development-on-windows/docker-desktop.png">
    <figcaption class="a-illustration__caption">Settings of the Docker Desktop</figcaption>
</figure>

Under the _Resources_ menu, enable the WSL integration by selecting the Linux distribution you have.  

<figure class="a-illustration">
    <img class="a-illustration__image" src="/assets/img/post-illustration-placeholder.jpg" data-src="/assets/img/blog/2020/docker/start-web-development-on-windows/docker-desktop-2.png">
    <figcaption class="a-illustration__caption">Choose your WSL distribution</figcaption>
</figure>

And in the future, first always start the wsl first, and then the Docker Desktop app.

#### In step 10: Skip the terminal emulator part

Many tutorial pages devote a whole chapter to the terminal emulators, particularly to the ConEmu. No doubt, that is a marvellous application,
but let's stop a little bit and think. Do we really need it? What will we win with another terminal? Okay, the **CMD.exe** is not enough, the 
**PowerShell** has a different purpose, the Git for windows shipped the **BASH.exe** which is a good start, but now we have the **WSL.exe**. 
We need that, we work with that, we work in that.

### <a name="phpstorm"></a>Fine tuning the PHPStorm terminal

<a href="https://www.jetbrains.com/" target="_blank">JetBrains</a> is an amazing company, which develops some really fantastic and without-only tools
for the developer community. I am a PHP developer, so I use the <a href="https://www.jetbrains.com/phpstorm/" target="_blank">PHPStorm</a>, but if
you feel more comfortable on the frontend side, the <a href="https://www.jetbrains.com/webstorm/" target="_blank">WebStorm</a> is also a perfect choice.
I believe, the common root makes this tutorial valid for the WebStorm as well.   
