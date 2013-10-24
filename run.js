export map_input_file=pagecounts-20081001-000000
cat pagecounts-20081001-000000 | ./mapper.js > temp1
export map_input_file=pagecounts-20100212-040000
cat pagecounts-20100212-040000 | ./mapper.js > temp2
sort temp1 temp2 | ./reducer.js
