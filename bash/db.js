var dbConn = require('mongodb').MongoClient.connect('mongodb://localhost/l2');

function saveInterview(interview) {
    return dbConn.then(function(db) {
        return db.collection('interview').insert(interview);
    })
}

module.exports = {
    dbConn: dbConn,
    saveInterview: saveInterview,
    saveInterviews: function(interviews) {
        var interviewPromises = [];
        interviews.forEach(function(interview) {
            interviewPromises.push(saveInterview(interview));
        })
        return Promise.all(interviewPromises);
    }
}
