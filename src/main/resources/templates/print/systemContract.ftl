<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title></title>
    <link href="/plugins/pdfjs/artDialog/skins/chrome.css" rel="stylesheet"/>
    <script type="text/javascript" src="/plugins/pdfjs/artDialog/artDialog.js"></script>
    <script type="text/javascript" src="/plugins/pdfjs/artDialog/artDialog.iframeTools.js"></script>
    <script src="/js/jquery-3.1.1.min.js"></script>
</head>
<body>
    <form id="printContract">
        <input type="hidden" id="data" name="data" value='${data?default('')}'/>
    </form>
    <script type="text/javascript" language="javascript" class="init">
        $(document).ready(function () {
            var datas = $("input[type=hidden][name=data]").val();
            var encodeUrl = encodeURIComponent("/printContract/printSystemContract?data=" + encodeURI(datas));
            var urlSrc = "/plugins/pdfjs/web/viewer.html?file=" + encodeUrl;
            (function () {
                art.dialog.defaults.drag = false;
                art.dialog.defaults.background = '#000';
                art.dialog.defaults.opacity = 0.7;
                art.dialog.open(urlSrc, {title: '市场分析表', width: 800, height: 700});

            })();
        });
    </script>
</body>
</html>