---
layout: post
title:  'Start web development on Windows'
date:   2020-01-05 15:00:00 +0100
expiration: 2020-06-01
illustration: ''
illustrationCaption: ''
illustration_share: ''
category: docker
categoryLabel: 'Docker'
tags:   [docker,wsl2,jekyll,webpack,phpstorm]
tagLabels: ['Docker','WSL2','Jekyll','Webpack','PHPStorm']
excerpt: 'A simple tutorial on how to turn your Windows&trade; 10 system into a competitive tool for web development.'
review: true
---

## Prolog

For this experiment I used my own desktop PC which was recently upgraded after 7 years. New motherboard, new CPU, new 
RAM, new VGA. The upgradable components are the benefits, when you have an old-fashioned workstation. And for the new
hardware, I installed a brand new Windows&trade; 10 Professional. Please don't start flame war about operating systems, I 
have my own reasons to choose this. 

One of my very first act after finishing the Windows&trade; install was to join the <a href="https://insider.windows.com/en-us/" target="_blank">Insider Program</a>.
This allowed me to install the Windows Subsystem for Linux 2<sup>nd</sup> edition. The great trick in WSL2 is that now it
can used directly with the Docker Desktop. You don't need to install the VirtualBox for this any more. 

## Table of Contents

* [Requirements](/docker/start-web-development-on-windows.html#requirements)
* [Installing the WSL2](/docker/start-web-development-on-windows.html#install-wsl2)

## <a name="requirements"></a>Requirements

1. First of all you will need a Windows&trade; 10 **build 18917** or higher.
2. You will need the <a href="https://docs.microsoft.com/en-us/windows/wsl/install-win10" target="_blank">WSL1</a> to be installed as well.
3. Then you can install the <a href="https://docs.docker.com/docker-for-windows/edge-release-notes/" target="_blank">Docker Desktop Community 2.1.7.0</a>.

## <a name="install-wsl2"></a>Installing the WSL2

The guys at Microsoft&trade; created a pretty <a href="https://docs.microsoft.com/en-us/windows/wsl/wsl2-install" target="_blank">straightforward tutorial</a> 
about the WSL2 install process. All you need to do is to follow it, step-by-step.

## <a name="docker-desktop"></a>Installing the Docker for Desktop

The one on the Docker website will not be good until the Microsoft&trade; doesn't take out the WSL2 from the insider program
and put it into the normal system update flow. You will need an "<a href="https://docs.docker.com/docker-for-windows/edge-release-notes/" target="_blank">Edge release</a>"
form the Docker Desktop (this Edge is not that Edge) to work together with WSL2.

After installing the Edge release, start the application (look for it in the system tray), right click on the icon and
choose the settings. There **you MUST uncheck** the _Start Docker Desktop when you log in_ option to avoid to start it
earlier than the WSL2 engine. When that happens, none of your local drives will be mounted in the Docker containers.

And of course you have to check the _Enable the experimental WSL2 based engine_ option.

<figure>
    <img src="/assets/img/blog/2020/docker/start-web-development-on-windows/docker-desktop.png">
    <figcaption>Settings of the Docker Desktop</figcaption>
</figure>
