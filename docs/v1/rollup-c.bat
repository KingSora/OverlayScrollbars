call rollup -c
call uglifyjs ./index.bundle.js -o ./index.min.js -c -m --ie8
del "./index.bundle.js"
del "./index.bundle.js.map"
pause