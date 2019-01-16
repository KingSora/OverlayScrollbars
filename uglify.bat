:: npm install uglify-js -g
call uglifyjs ./js/OverlayScrollbars.js        -o ./js/OverlayScrollbars.min.js        -c -m --mangle-props regex="/^_/" --ie8 --config-file uglify.json 
call uglifyjs ./js/jquery.overlayScrollbars.js -o ./js/jquery.overlayScrollbars.min.js -c -m --mangle-props regex="/^_/" --ie8 --config-file uglify.json 
pause