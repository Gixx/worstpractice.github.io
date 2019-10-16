### Worst Practice

This is the Jekyll and architecture source code of the [Worst Practice](https://www.worstpractice.dev) website. 

## License

The writings under the [_posts](_posts) folder and the image assets are protected by copyright, the rest is free for learning and using.

## Usage
### Requirements
* Make sure, you have Docker installed on your system. I prefer the Docker-Toolbox.
* Create the default docker machine if it not exists:
```
$> docker-machine create --driver virtualbox default
$> eval "$(docker-machine env default)"
```
### Local environment
Set Jekyll version
```
export JEKYLL_VERSION=3.5
```

### Build and Serve
To build the files once and exit, just run the following command:
```
docker run --rm --volume="$PWD:/srv/jekyll" -it jekyll/jekyll:$JEKYLL_VERSION jekyll build
```
To serve the generated content in the browser, and keep the container, run:
```
docker run --name myblog --volume="$PWD:/srv/jekyll" -p 4000:4000 -it jekyll/jekyll:$JEKYLL_VERSION bash
```
...then in the docker prompt run:
```
jekyll serve --watch --drafts
```

### Check the generated site
Get the IP address of the docker machine in a new terminal window (typical result - 192.168.99.100):
```
docker-machine ip default
```
Then look up the website in the browser: `http://192.168.99.100:4000`
