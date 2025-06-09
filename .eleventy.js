import { feedPlugin } from "@11ty/eleventy-plugin-rss";
import syntaxHighlight from "@11ty/eleventy-plugin-syntaxhighlight";

export default function (eleventyConfig) {
    // add the rss plugin mentioned in the docs
    eleventyConfig.addPlugin(feedPlugin, {
        type: "rss",
        outputPath: "/feed.xml",
        collection: {
            name: "posts",
            limit: 0, // 0 means no limit
        },
        metadata: {
            base: "https://macroscopicentric.net",
            subtitle: "This is a tech blog on the internet.",
            language: "en",
            title: "Macroscopicentric",
        },
    });

    // ditto, add the syntax highlighting plugin
    eleventyConfig.addPlugin(syntaxHighlight);

    // define a posts collection for all blog posts
    // this is also used for rss
    eleventyConfig.addCollection("posts", function (collectionAPI) {
        return collectionAPI.getFilteredByGlob("_posts/*.md");
    });

    // add css files to the reload watching, for sass
    eleventyConfig.setBrowserSyncConfig({
        files: "./_site/css/**/*.css",
    });

    // pass through assets
    eleventyConfig.addPassthroughCopy("assets");

    // call a layouts a layouts
    eleventyConfig.setLayoutsDirectory("_layouts");
}
