# Worst Practice

This is the Jekyll and architecture source code of the [Worst Practice](https://www.worstpractice.dev) website. 

## License

The writings under the [_posts](./src/_posts) folder and the image assets are protected by copyright, the rest is free for learning and using.

## Usage

### To create and run the work environment

You need [Docker for Desktop](https://www.docker.com/products/docker-desktop) to be able to build the static website. 

After you installed the Docker for Desktop, you need to simply run:

```
docker compose up -d
```

For the first run this will create tho docker containers (otherwise it will just start them):

- Jekyll 3.8
- Webpack

The Webpack's purpose is to create and compress the JavaScrip bundle for the website.
The Jekyll's purpose is to build the static website form the provided sources.

Make sure the containers are running with the following command:

```
docker ps -a
```

The output should show something like this:

<table>
    <tr>
        <th>CONTAINER ID</th><th>IMAGE</th><th>COMMAND</th><th>CREATED</th><th>STATUS</th><th>PORTS</th><th>NAMES</th>
    </tr>
    <tr>
        <td>d2e7e9b864f4</td><td>jekyll/jekyll:3.8</td><td>"/usr/jekyll/bin/ent…"</td><td>8 minutes ago</td><td>Up 8 minutes</td><td>0.0.0.0:4000->4000/tcp, 35729/tcp</td><td>jekyll</td>
    </tr>
    <tr>
        <td>7cf0ac694204</td><td>jmfirth/webpack</td><td>"tail -f /dev/null"</td><td>8 minutes ago</td><td>Up 8 minutes</td><td>3000/tcp</td><td>webpack</td>
    </tr>
</table>


### To use the Webpack container

To access the container, you need to simply run:

```
docker exec -it webpack bash 
```

Inside the container for the first time it's worth to make sure everything is up to date, so run:

```
npm install --no-bin-links
```

Then just build (and watch for the changes) the JS bundle:

```
webpack -w --watch-poll
```

### To use the Jekyll container

Access the container is the same as before:

```
docker exec -it jekyll bash
```

Then in the container's prompt first you need to init the project:

```
bundle install
```

Then just build, look for the changes and serve the content:

```
jekyll serve -w --drafts --force_poll
```

### Check the generated site

Then look up the website in the browser: `http://127.0.0.1:4000`

### Have a break, go to sleep

If you want to stop with the work, but plan to continue it later, use:

```
docker-compose stop
```

**IMPORTANT** Choose the parameter wisely, you can have some unwanted accident, if you use the `docker-compose down` instead.

## Go back to the start line 

If something went wrong with the containers and you want a hard reset, run:

```
docker-compose down -v
```

## How the containers work together?

The concept is simple. The Webpack is watching for changes in the `./webpack` folder. If there's any, 
it will immediately build the new minimized script into the `./src/assets/js/site.min.js` file.

But the whole `./src` folder is under the survillance of the Jekyll, which is also waiting for changes.
When the Webpack generates the new file, Jekyll will catch it, and rebuilds the website.

That's simple.


