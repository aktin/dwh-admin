<?php $title = isset($title)? $title : "DWH Administration Page"; ?>

<!DOCTYPE html>
<html>
<head>
    <title><?php echo $title;?></title>

    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
    <link href="/images/favicon.ico" rel="shortcut icon" type="image/x-icon">

    <link rel="stylesheet" href="/css/main.css">
    <script src="/js/jquery-2.2.1.js"></script>
    

    <link rel="stylesheet" type="text/css" href="/semantic/semantic.css">
    <script src="/semantic/semantic.js"></script>

    <!-- <script src="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/1.2.0/semantic.min.js"></script> -->
    <!-- <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/semantic-ui/1.2.0/semantic.min.css"> -->

</head>
<body rel="0">

    <div id="header">
        <h2 class="ui red inverted header huge">
            <div class="content">Aktin</div>
        </h2>
        <div id="menuDiv">
            <nav class="ui inverted fluid four item menu" id="menu">

                <a href="index.php" class="red item navitem">
                    <i class="home icon"></i>Home
                </a>

                <a href="reporting.php" class="red item navitem">
                    <i class="area chart icon"></i>Reporting
                </a>

                <a href="config.php" class="red item navitem">
                    <i class="settings icon"></i>Konfigurationen
                </a>

                <a href="querying.php" class="red item navitem">
                    <i class="checkmark box icon"></i>Anfragen
                </a>

            </nav>
        </div>
    </div>
    <div id="content">