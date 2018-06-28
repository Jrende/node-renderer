<!doctype html>
<html class="no-js" lang="">
<head>
    <meta charset="utf-8">
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1, minimal-ui">
    <title>Node Renderer overview</title>
    <base href="${basePath}">
    <link href="/static/overview/style.css" rel="stylesheet">
</head>
<body>
<h1>Overview</h1>
<a href="/0">Create new image</a>
<div class="images">
<#list images as image>
    <div>
        <a href="${image}">
            <img src="${'/static/thumbnails/thumb-' + image + '.png'}">
        </a>
    </div>
</#list>
</div>
</body>
</html>
