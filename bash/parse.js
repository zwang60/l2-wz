var fs = require('fs');
var db = require('./db');

var interviews = [];

fs.readFile(__dirname + '/data/Barclays.txt', 'utf8', function(err, cnt) {
    console.log(err, cnt.length);
    var lines = cnt.split('\n');
    var interview = {};
    lines.forEach(function(l) {
        var line = l.trim();
        if (line.startsWith('---')) {
            //TODO, add each 'interview' info to list 'interviews'
            if (!!interview.Client) interviews.push(interview);
            interview = {};
            return;
        }

        var isHeader = false;
        ['Client', 'Candidate', 'Date', 'Type'].forEach(function(k) {
            if (line.startsWith(k)) {
                interview[k] = line.split(':')[1].trim();
                isHeader = true;
            }
        })

        if (!isHeader) {
            var matchRes = /^\d+\.\s*(.*)/.exec(line.trim());
            if (!matchRes) return;
            if (!interview.questions) interview.questions = [];
            interview.questions.push(matchRes[1]);
        }
    })

    if (!!interview.Client) interviews.push(interview);
    console.log(interviews.length, interviews[0].questions[0]);

    db.saveInterviews(interviews)
        .then(function(info){
            console.log(info);
            return db.dbConn.then(function(db){return db.close();});
        })
})
