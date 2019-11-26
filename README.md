### Worst Practice

This is the Jekyll and architecture source code of the [Worst Practice](https://www.worstpractice.dev) website. 

## License

The writings under the [_posts](_posts) folder and the image assets are protected by copyright, the rest is free for learning and using.

## Usage

### To create the work environment

To build the files once and exit, just run the following command:
```
docker run --rm --volume="${PWD}:/srv/jekyll" -it jekyll/jekyll:3.8 jekyll build
```

To create a permanent container and make the site ready, run:
```
docker run --name myblog --volume="${PWD}:/srv/jekyll" -p 4000:4000 -it jekyll/jekyll:3.8 bundle install
```

### When you already have the container

When you already have the container created **without** the `--rm` and **with** the `--name myblog`,
the next time you try the `docker run` command, you will get an error.

Try just starting it, and get access into it:
```
docker start myblog
```
...then
```
docker exec -it myblog bash
```
...then in the container's prompt:
```
jekyll serve --watch --drafts --force_poll
```


### Check the generated site

Then look up the website in the browser: `http://127.0.0.1:4000`
