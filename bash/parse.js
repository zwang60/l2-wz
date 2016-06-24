var fs = require('fs');
//var db = require('./db');

//var interviews = [];

function parseLine(l, interview, interviews) {
    var line = l.trim();
    if (line.startsWith('---')) {
        //TODO, add each 'interview' info to list 'interviews'
        if (!!interview.Client) interviews.push(interview);
        return {};
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
        if (!!matchRes) {
            if (!interview.questions) interview.questions = [];
            interview.questions.push(matchRes[1]);
        }
    }
    return interview;
}

function parseFile(file) {
    console.log('read file', file);
    var interviews = [];
    return new Promise(function(resolve, reject) {
            fs.readFile(file, 'utf8', function(err, cnt) {
                console.log(err, cnt.length);
                if (err) {
                    reject(err);
                    return;
                }
                var lines = cnt.split('\n');
                var interview = {};
                lines.forEach(function(l) {
                    interview = parseLine(l, interview, interviews);
                })

                if (!!interview.Client) interviews.push(interview);
                resolve(interviews);
            })

        })
        /*
        db.saveInterviews(interviews)
            .then(function(info) {
                console.log(info);
                return db.dbConn.then(function(db) {
                    return db.close();
                });
            })
        */

}

function parseDir(dir) {
    var promises = [];
    return new Promise(function(resolve, reject) {
        fs.readdir(dir, function(err, files) {
            console.log('read dir', err, files.length);
            if (err) return;
            files.forEach(function(file) {
                var filePath = dir + '/' + file;
                var fsStat = fs.statSync(filePath);
                if (fsStat.isDirectory()) promises.push(parseDir(filePath));
                else if (fsStat.isFile && file.endsWith('.txt'))
                    promises.push(parseFile(filePath));
                else console.log('ignore', filePath);
            })
            Promise.all(promises).then(function(interviewses){
                var interviews = [];
                interviewses.forEach(function(its){
                    interviews = interviews.concat(its);
                })
                resolve(interviews);
            });
            console.log('read dir finish', dir);            
        })

    });
}

module.exports = {
    parseFile: parseFile,
    parseDir: parseDir
}
