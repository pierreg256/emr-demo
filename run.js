export map_input_file=pagecounts-20081001-000000
head -n 1000 pagecounts-20081001-000000 | ./mapper.js > temp1
head -n 1000 pagecounts-20081005-000000 | ./mapper.js > temp2
sort temp1 temp2 | ./reducer.js
