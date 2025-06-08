---
title: "Migrating from Jekyll to Eleventy"
date: 2025-06-08 18:36:00
categories: how_things_work
---

## TL;DR: Just the Migration Steps
1. add package.json and eleventy.config.cjs (see above)
2. point layouts to `_layouts` in eleventy.config.cjs
3. convert `_config.yml` to `_data/site.json`
4. delete config.rb
5. add .eleventyignore to ignore this readme
6. replace my `jekyll-feed` RSS plugin with eleventy's [`rss`](https://www.11ty.dev/docs/plugins/rss/) plugin
7. add `_posts.json` and a permalink to the about page
8. delete a bunch of js and sass install eleventy's syntax highlighting plugin and update my code blocks
9. for eleventy 3: update the page links for the index + pagination
10. add a GH workflow, .nojekyll file, update repo settings in GH
11. verify domain through GH user settings

## The Longer Version
_For context: I started this process in January 2024 and finished in June 2025, hurrah personal projects, so there are references to Eleventy 2.0 below from before I migrated to 3.0._

I don't think there's a super clean config migration path from Jekyll to Eleventy but I might've also been underusing Jekyll's config. Per [this blog post](https://alex.pearwin.com/2020/06/jekyll-to-eleventy/) I moved my `_config.yml` (site-wide config) to `_data/site.json`, and then had to decide what to do about build config, which I didn't really have an equivalent for in Jekyll (I did have a config.rb, but it was minimal and I just deleted it). Eleventy currently (as of January 2024) [has three config filename options](https://www.11ty.dev/docs/config/) for build config. I tried using `eleventy.config.js` and specifying `"type": "module"` in my package.json settings per the recommendation of a friend, but that caused Eleventy to fatal. [It looks like Eleventy is trying to migrate away from CJS](https://www.11ty.dev/blog/canary-eleventy-v3/#new-features-and-a-short-upgrade-guide) but that work isn't yet complete, so I was able to leave the module type but did have to change to a `.cjs` extension for the config file.

Layouts are called layouts in 11ty's config and Jekyll's default pathing, but 11ty's path for them points to `_includes/` by default, which honestly seems kind of weird to me as a design choice. I've configured it in the general config file to just point to `_layouts/` as it did in Jekyll.

I also, for some reason I don't remember, had separate `_layouts` AND `_includes` directories, and my html page fragments (head, header, footer) were in `_includes`, which made this especially confounding. It's at this point that I started enthusiastically copying from Alex Pearce's [blog code](https://github.com/alexpearce/home) and I realized the syntax within the Liquid templating was different so I copied his and it just worked.

I then got stuck on my included scripts, which are probably absolute garbage and definitely include a fair amount of jquery (a combo of what's included by default by Jekyll and the theme I'd picked) but while commenting them out did finally make the blog serve locally, it also changed the location of my header text as well as the font used for the header and headings. (No posts appear yet.) So at this point I want to make this just work with my existing jquery for the theme and then update this later.

There's also some pathing wonkiness happening. Eleventy is turning my pathing for posts (which was "/blog/{page slug}/") into "/blog/{page slug}/index.html", which I think was my fault for the trailing slash, as Eleventy seems to turn those into directories. Removing the trailing slash makes the files end up in `_site` in the expected location, although they now have no file extension and I'm not sure if that's what Eleventy expects (even though they're properly formatted HTML). Similarly, my about page was going to "/about/index.html". Deleting that file/directory and adding a permalink to about.md's front matter does fix the pathing, but now Eleventy can't seem to find the top-level (also without a file extension) about page. This is fixed now and then there were also some surprising things about front matter namespacing. I gained a lot by simply copying from [Alex Pearwin's code](https://github.com/alexpearce/home/tree/eb2dfb5d20d5f1d59c278e57de453280f74aa252) for _his_ Eleventy blog. My original (Jekyll's original?) pathing choices were even wackier, though, as my blog home _is_ my index.html but then every next page of blog posts is at "/blog/page{number}", so I had to make a pretty goofy conditional to ensure the permalinks.

I don't think I fully understand Eleventy's assumed pathing because making an html file called "about" at the top level meant Eleventy couldn't find it. But making the permalink "about.html" but linking to it everywhere else in the templates as "/about" seems to work just fine (the URL is just "/about").

There was also definitely something wonky happening with Sass, which worked out of the box with Jekyll, but in this way where I have no idea what Ruby libraries it was using and I think I deleted all my Ruby config, so I needed to go look those up. I've installed the npm versions of Compass and Normalize but something had troubles finding Compass anyway. This is probably worth just blowing away and redoing from scratch since I have the final CSS I currently care about anyway. Also, I'm terrible at SASS. I was able to just delete Compass altogether and move to a NPM package for vanilla Normalize CSS, but Susy will need to get converted into native CSS as well.

A later update the above: this definitely isn't everything but Compass was Ruby code that is totally unsupported and no longer works with modern Ruby so I've excised that entirely, but my understanding of CSS and SASS isn't good enough to figure out where it was being used and how extensively. So I've just started with deleting the import. [This blog post](https://jkc.codes/blog/using-sass-with-eleventy/) for using Sass with Eleventy was extremely helpful for setting everything up in the interim.

The last major thing was that I think either the entire template engine for Markdown or some of its config is different than what Jekyll used, because posts look mostly fine except for code blocks. The docs were pretty useful on this once I realized [it's a plugin](https://www.11ty.dev/docs/plugins/syntaxhighlight/), but I got there via [yet another blog post](https://nicolashery.com/moving-a-blog-from-jekyll-to-eleventy/#syntax-highlighting), and then I had to go to the Prism docs to figure out file pathing off of one of the CDNs for the theme I wanted.

Interestingly, although I did a lot of work earlier to maintain my pathing from Jekyll, upgrading to Eleventy 3 actually caused build errors because I have so many pages that don't have extensions, which Eleventy really doesn't seem to like but (IIRC, because I don't think I would've changed it) was a default in Jekyll. I've compromised by removing the very silly conditional I mentioned above to try to maintain the pathing on the paginated blog pages after the index, but have exempted all posts via additional config in `_posts.json` to try to keep the links consistent. I may regret this in the future, we'll see, but I'd really like to not break the historical blog links.

_Narrator's voice from 30 minutes into the future: She did regret this. (I solved it by going back to look at Alex Pearce's config for his posts, which has a trailing slash. I removed the exemption and added the trailing slash to my posts permalink config and now everything works great.)_

Finally, I had a bunch of issues deploying this via Github actions because I'd been using Jekyll for so long that the entire pipeline was automagical to me. In general [the Eleventy deployment docs](https://www.11ty.dev/docs/deployment/) were extremely helpful and have specific config for your workflow since that's such a common use case. The one thing they didn't mention was that you also needed a `.nojekyll` file at the top level of your repo if you were coming from Jekyll, but there are a plethora of blog posts mentioning this (ex: [Lea Tortay's blog post](https://www.linkedin.com/pulse/eleventy-github-pages-lea-tortay/), which is commonly referenced, so that was easy to fix. I did miss an incredibly important step the first time, which was updating my repo settings to deploy from the gh-pages branch and not main. I also did not use `--pathprefix`, which is included in a lot of the guides, because I deploy this at the top level of my GH pages. I do recommend adding `workflow_dispatch` into your GH workflow triggers so you can retry it from the GH actions UI. Ex:

```yaml
on:
  push:
    branches:
      - main
  workflow_dispatch:
```

I then had an incredibly confusing DNS issue, where I could see the blog at macroscopicentric.github.io but my own domain (macroscopicentric.net) gave me a Github Pages 404 instead. I'm truly not sure what actually caused this to go away, because I already had CNAME config set up in my GH workflow and that didn't seem to be working (where the same CNAME had worked with Jekyll). But I did two things: I verified the domain through my user settings on Github and added the domain to the repo's GH Pages settings, and then I deleted the domain from the repo's GH Pages settings and re-ran my action, which recreated it. I'm assuming it was the domain verification that solved my problem, but it also feels possible that there was some sort of bizarro caching problem at the DNS level from GH because my blog has been around so long with an unchanged CNAME. If anyone has a better idea of what might've happened here, I'd love to hear it!