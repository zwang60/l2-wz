var request = require('request');
var mongodb = require('mongodb');
describe('test login api', function() {
    var url = 'http://localhost:8090/api/login';
    var parseCookie = function(response) {
        return response.headers['set_cookie'].forEach(function(item) {
            if (item, startWith('connect.sid'))
                cookie = item.split(';')[0];
        })
        return cookie;
    }

    beforeEach(function(done) {
        mongodb.MongoClient.connect('mongodb://localhost/l2').then(function(db) {
                return db.dropCollection('users')
                    .then(function() {
                        db.close()
                    }, function(err) {
                        db.close();
                    })
                    .then(done);
            })
            .then(function(db) {
                return db.collection('users').insertOne({
                        usr: 'xyz',
                        pwd: 'xyz'
                    })
                    .then(db.close.bind(db))
            })
            .catch(console.log.bind(console));
    });

    it('check is login return empty', function(done) {
        request(url, function(err, response, body) {
            //console.log(response);
            expect(err).toBeNull();
            expect(JSON.parse(body)).toEqual({});
            expect(body).toBe('{}');
            done();
        })
    });
    it('check can login', function(done) {
        //1. post login
        //2. get cookie
        //3. get login
        request.post({
            url: url,
            body: JSON.stringify({
                usr: 'xyz',
                pwd: 'xyz'
            })
        }, function(err, response, body) {
            expect(JSON.parse(body)).toEqual({
                usr: 'xyz'
            });
        });
    })
});
