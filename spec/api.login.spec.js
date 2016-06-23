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

    var login = function(usr) {
        return new Promise(function(resolve, reject) {
            request.post({
                url: url,
                body: usr,
                json: true,
            }, function(err, response, body) {
                if (err) reject(err);
                else resolve(body);
            });
        });
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
        login({
            usr: 'xyz',
            pwd: 'xyz'
        }).then(function(body) {
            expect(body).toEqual({
                usr: 'xyz'
            });
        }), function(err) {
            expect(err).toBeNull();
        }.then(done).catch(console.log))
    })
});
