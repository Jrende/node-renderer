<!doctype html>
<html class="no-js" lang="">
<head>
    <meta charset="utf-8">
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1, minimal-ui">
    <title>Node Renderer</title>
    <base href="${basePath}">
    <link href="https://fonts.googleapis.com/css?family=Work+Sans" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Roboto+Slab:400,700" rel="stylesheet">
    <link href="static/editor/app.css" rel="stylesheet"></head>
    <style>
        body {
            overflow: hidden
        }
    </style>
<body>
    <div id="root" class="editor"></div>
    <script type="text/javascript">
    <#outputformat "JSON">
        window.initialGraph = ${imageSource};
    </#outputformat>
    </script>
    <script type="text/javascript" src="static/editor/app.js"></script>
</body>
</html>
