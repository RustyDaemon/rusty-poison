# Rusty Poison

**Clean** and **professional** Hugo theme built around an excellent Poison theme by [Luke Orth](https://github.com/lukeorth/poison).

It is **tiny**. It has _no external dependencies_. No frameworks, icon packs, or Google fonts. No ads or trackers.

All the static assets for the site (JS files, CSS, and fonts) are located within the theme's _/assets/_ directory.

---

## Contents

- [Rusty Poison](#rusty-poison)
  - [Contents](#contents)
  - [Installation](#installation)
  - [Features](#features)
    - [Light/dark mode](#lightdark-mode)
    - [Table of contents (ToC)](#table-of-contents-toc)
    - [Analytics](#analytics)
    - [Series](#series)
    - [Details](#details)
  - [How to Configure](#how-to-configure)
    - [The sidebar menu](#the-sidebar-menu)
    - [The front page](#the-front-page)
    - [Example config](#example-config)
    - [Custom CSS](#custom-css)
  - [License](#license)

## Installation

Clone the repository into your `themes` directory:

```sh
git clone https://github.com/RustyDaemon/rusty-poison themes/rusty-poison
```

Set `rusty-poison` as the default theme in your `hugo.toml` file:

```toml
theme = "rusty-poison"
```

## Features

### Light/dark mode

Dark mode is the default for first time visitors, but you can change this in your config file.

<p float="left">
  <img src="" width="700" />
  <img src="" width="700" />
</p>

### Table of contents (ToC)

Provide a floating table of contents for large screens.

If you prefer not to display a table of contents, you can disable them site-wide in your `hugo.toml` file.

```toml
[params]
    hideToc = true
```

Alternatively, you can choose to disable it on a per-post basis by putting the flag in the frontmatter of an individual post.

```toml
title = "Simple post with no ToC"
date = 2025-02-16
hideToc = true
tags = ["go"]
```

### Analytics

Rusty Poison support [Plausible](https://plausible.io) and [Umami](https://umami.is/).

To enable analytics, add these lines to your `hugo.toml` file:

```toml
[params]
    plausible = true
    plausible_domain = "myblog.com"
    plausible_script = "https://plausible.myblog.com/js/script.js"
```

```toml
[params]
    umami = true
    umami_script = "https://cloud.umami.is/script.js"
    umami_website_id = "website_id"
```

This will insert the necessary code in the `<head>` on each page and will allow your Plausible and/or Umami instance to collect a limited set of data on your users.

For reference, the configuration above will add the following code to each page.

**Note**: _Enabling analytics will add external dependencies._

### Series

Use series, if you want to combine your content. For example, _Go Tutorial_ or _.NET for beginners_.

This is done with a custom taxonomy - add `series` to the frontmatter on the content you'd like to group together.

```toml
title = "How to use series"
date = 2025-02-16
series = "How to use structs in Go"
tags = ["go"]
```

### Details

There's a shortcode for encoding detail dropdowns into your pages.


<img width="250" alt="details-shortcode" src="https://github.com/user-attachments/assets/75bc0cc1-4099-4113-aebb-1a0afd1bfcd2" />


Here's the code for the detail dropdown above:

```
{{< details summary="Hidden content" >}}
Hello there
{{< /details >}}
```

## How to Configure

### The sidebar menu

Any items you want displayed in your sidebar menu _must_ satisfy two requirements. They must:

1. Have a corresponding markdown file in your _/content/_ directory.
2. Be declared in your _hugo.toml_ file (example below).

There are two types of menu items:

1. **Single Page** -- The _About_ menu item (to the left) is a good example of this. It displays a direct link to an individual page. For arbitrary single pages, the page content must be located at `content/<foo>/_index.md` and the front matter of `_index.md` must contain `layout: single`.
2. **List** -- The _Posts_ menu item is a good example of this. It displays a directory and dynamically lists the contents (i.e. pages) contained by date. List items have two optional configurations: a subheading (like the _Recent_ subheading that appears on the menu to the left), and a maximum number of items to display.

The sidebar menu items are configured with a dictionary value in your _hugo.toml_ file. I've included an example below. Additionally, there is a placeholder for this in the _hugo.toml_ file shown in the next section.

**Important**: You _must_ have a markdown file present at the path specified in order for your menu item to be displayed.

```toml
menu = [
        # Dict keys:
            # Name:         The name to display on the menu.
            # URL:          The directory relative to the content directory.
            # HasChildren:  If the directory's files should be listed.  Default is true.
            # Limit:        If the files should be listed, how many should be shown.

        # SINGLE PAGE
        # Note that you must put your markdown file
        # inside of a directory with the same name.

        # Example:
        # ... /content/about/about.md
        {Name = "About", URL = "/about/", HasChildren = false},

        # ... /content/foo/_index.md
        # {Name = "Foo", URL = "/foo/", HasChildren = false},

        # LIST
        # This example has a subheading of "Recent"
        # and will display up to 5 items.

        # Example:
        # ... /content/posts/introducing-rusty-poison.md
        {Name = "Posts", URL = "/posts/", Pre = "Recent", HasChildren = true, Limit = 5},

        # Example of a list without a subheading or limit.
        {Name = "Projects", URL = "/projects/"},
    ]
```

### The front page

When visiting the base url for the site, i.e. `your.domain.com/`, a paginated feed of your recently added content is displayed in reverse chronological order. By default, only content in the "posts" [page bundle](https://gohugo.io/content-management/page-bundles/) is displayed. You can configure a list of page bundle names to be included on this page by adding the `front_page_content` parameter to your hugo.toml file.

```toml
[params]
  front_page_content = ["posts", "projects"]
```

### Example config

I recommend starting by copying/pasting the following code into your hugo.toml file. Once you see how it looks, play with the settings as needed.

**NOTE**: To display an image in your sidebar, you'll need to uncomment the `remote_brand_image` and set a image URL or the `brand_image` path below and have it point to an image file in your project. The path is relative to the `static` directory. If you don't have an image, just leave both lines commented out.

```toml
baseURL = "https://example.com"
languageCode = "en-us"
theme = "rusty-poison"
pagination.pagerSize = 10
pluralizelisttitles = false

[params]
    brand = "Rusty Poison" # name of your site
    # remote_brand_image = 'https://github.com/USERNAME.png' # path to a remote file
    # brand_image = "/images/_logo_.jpg"    # path to the image shown in the sidebar
    description = "..." # used as default meta description if not specified in front matter
    dark_mode = true                      # optional - defaults to false
    showDarkLight = true                  # optional - defaults to true
    # favicon = "favicon.png"             # path to favicon
    hideToc = false                       # optional

    front_page_content = ["posts"] # Equivalent to the default value, add page bundle names to include them on the front page.

    # MENU PLACEHOLDER
    # Menu dict keys:
        # Name:         The name to display on the menu.
        # URL:          The directory relative to the content directory.
        # HasChildren:  If the directory's files should be listed.  Default is true.
        # Limit:        If the files should be listed, how many should be shown.
    menu = [
        # {Name = "About", URL = "/about/", HasChildren = false},
        {Name = "all posts", URL = "/posts/", Pre = "recent:", HasChildren = true, Limit = 5},
        {Name = "tags", URL = "/tags/", HasChildren = true},
    ]

    # Links to your socials. Comment or delete any you don't need 
    discord_url = "https://discord.com"
    github_url = "https://github.com"
    mastodon_url = "https://mastodon.social"
    x_url = "https://x.com"
    youtube_url = "https://youtube.com"
    bluesky_url = "https://bsky.app"  

    # NOTE: If you don't want to use RSS, comment or delete the following lines
    # Adds an RSS icon to the end of the socials which links to {{ .Site.BaseURL }}/index.xml
    rss_icon = true
    # Which section the RSS icon links to, defaults to all content
    rss_section = "posts"

    # Uncomment and configure to enable umami analytics
    # umami = true
    # umami_script = "https://cloud.umami.is/script.js"
    # umami_website_id = "website_id"

    # Uncomment and configure to enable plausible analytics
    # plausible = true
    # plausible_domain = "myblog.com"
    # plausible_script = "https://plausible.myblog.com/js/script.js"

    # Hex colors for sidebar
    moon_sun_background_color = "#121212"   # default is #121212
    moon_sun_color = "#FAF9F6"              # default is #FAF9F6
    sidebar_a_color = "#FFF"                # default is #FFF
    sidebar_bg_color = "#191919"            # default is #191919
    sidebar_h1_color = "#FFF"               # default is #FFF
    sidebar_img_border_color = "#313131"    # default is #313131
    sidebar_p_color = "#909090"             # default is #909090
    sidebar_socials_color = "#FFF"          # default is #FFF

    # Hex colors for light mode
    code_color = "#000"                     # default is #000
    code_background_color = "#E5E5E5"       # default is #E5E5E5
    code_block_color = "#FFF"               # default is #FFF
    code_block_background_color = "#272822" # default is #272822
    content_bg_color = "#FAF9F6"            # default is #FAF9F6
    date_color = "#515151"                  # default is #515151
    link_color = "#3674B5"                  # default is #3674B5
    list_color = "#5A5A5A"                  # default is #5A5A5A
    post_title_color = "#303030"            # default is #303030
    table_border_color = "#E5E5E5"          # default is #E5E5E5
    table_stripe_color = "#F9F9F9"          # default is #F9F9F9
    text_color = "#222"                     # default is #222

    # Hex colors for dark mode
    code_color_dark = "#FFF"                        # default is #FFF
    code_background_color_dark = "#515151"          # default is #515151
    code_block_color_dark = "#FFF"                  # default is #FFF
    code_block_background_color_dark = "#272822"    # default is #272822
    content_bg_color_dark = "#121212"               # default is #121212
    date_color_dark = "#9A9A9A"                     # default is #9A9A9A
    link_color_dark = "#578FCA"                     # default is #578FCA
    list_color_dark = "#9D9D9D"                     # default is #9D9D9D
    post_title_color_dark = "#DBE2E9"               # default is #DBE2E9
    table_border_color_dark = "#515151"             # default is #515151
    table_stripe_color_dark = "#202020"             # default is #202020
    text_color_dark = "#EEE"                        # default is #EEE

    # NOTE: The following three params are optional and are used to create meta tags + enhance SEO.
    # og_image = ""                       # path to social icon - front matter: image takes precedent, then og_image, then brand_url
                                          # this is also used in the schema output as well. Image is resized to max 1200x630
                                          # For this to work though og_image and brand_url must be a path inside the assets directory
                                          # e.g. /assets/images/site/og-image.png becomes images/site/og-image.png
    # publisher_icon = ""                 # path to publisher icon - defaults to favicon, used in schema

[taxonomies]
    series = 'series'
    tags = 'tags'
```

### Custom CSS

You can override any setting in theme's static CSS files by adding your own
`/assets/css/custom.css` file. For example, if you want to override the title font and
font size, you could add this:

```css
.sidebar-about h1 {
	font-size: 1.4em;
	font-family: 'Terminess Nerd', monospace;
}
```

## License

This theme is licensed under [GNU General Public License v3.0](LICENSE.md).

---
If you want to see the changes made to the original theme, [read it here](diff.md).
