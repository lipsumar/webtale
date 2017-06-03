# WebTale

> Write interactive stories for the web


WebTale is a Web-based interactive fiction engine. That means it lets you write interactive stories and publish them on the web.

Stories are made of web pages, connected with links. It's basically a website, but easy to make.

Optionnaly you can also use emails. This is a great way to keep readers engaged and deliver a story piece by piece over time.


## How it works

As the story writer, you'll mainly work with simple text files. That means all your story will be stored in a folder on your computer. It could look like this:

```
-- My story
 |- Chapter 1
 | |- intro.html
 | |- the-man.html
 | |- the-eye.html
 | |- choice-1.html
 | |- choice-2.html
 | |- next-chapter.html
 |- Chapter 2
 | |- intro.html
 | |- beyond.html
 | |- good-choice.html
 | |- bad-choice.html
 | |- end.html
 |- index.html
 |- email.md
```

Each file is a web page, they look like this:

```handlebars
---
layout: dark
---
<p>
  Once upon a midnight dreary, while I pondered, weak and weary,
  Over many a quaint and curious volume of forgotten lore—
    While I nodded, nearly napping, suddenly there came a tapping,
  As of some one gently rapping, rapping at my chamber door.
</p>

<p>
    <a href="{link "Chapter 1/choice-1"}">Open the door</a> or
    <a href="{link "Chapter 1/choice-2"}">stay inside</a>
</p>

```


At the moment there is only 1 layout that comes with WebTale: `html`. It's the simplest layout containing the WebTale javascript and [Bootstrap](http://getbootstrap.com/)

You can define your own layouts. Simply place them in a folder called `_layouts` inside your story folder.

Your own custom templates should always extend the `html` layout. Here is an example:

```handlebars
---
mainBlock: main
---
{{#extend "html" title="Custom page title" bodyClass="grey"}}
    {{#content "style"}}
    <style>
        .grey{
            background-color: #ccc;
        }
    </style>
    {{/content}}

    {{#content "body"}}
    <div class="container">
        {{#block "main"}}{{/block}}
    </div>
    {{/content}}

{{/extend}}
```


