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

For the first run this will create a container and install all the necessary packages (jekyll, npm, webpack etc):

The Webpack's purpose is to create and compress the JavaScrip bundle for the website.
The Jekyll's purpose is to build the static website form the provided sources.

Make sure the container is running with the following command:

```
docker ps -a
```

The output should show something like this:

<table>
    <tr>
        <th>CONTAINER ID</th><th>IMAGE</th><th>COMMAND</th><th>CREATED</th><th>STATUS</th><th>PORTS</th><th>NAMES</th>
    </tr>
    <tr>
        <td>a0716aa43fdc</td><td>worstpracticegithubio_alpine</td><td>"tail -f /dev/null"</td><td>2 minutes ago</td><td>Up 2 minutes</td><td>0.0.0.0:4000->4000/tcp</td><td>worst-practice</td>
    </tr>
</table>


### To use the container

To access the container, you need to simply run:

```
$> docker exec -it -u dev worst-practice bash
```

Inside the container for the first time it's worth to make sure everything is up-to-date, so run:

```
bash-5.1# npm install
bash-5.1# sudo bundle install
```
If everything is set up, then build the content with (inside the container):

```
bash-5.1# npm run build
```

Or if you need to check the results in the browser, then use:
```
bash-5.1# npm run develop 
```

Then look up the website in the browser: [http://127.0.0.1:4000](http://127.0.0.1:4000)

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
