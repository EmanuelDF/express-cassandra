var models = require('express-cassandra');

models.setDirectory( __dirname + '/models').bind(
    {
        clientOptions: {
            contactPoints: ['localhost'],
            authProvider: new models.driver.auth.PlainTextAuthProvider('cassandra', 'cassandra'),
            protocolOptions: { port: 9042 },
            keyspace: 'cassandra',
            queryOptions: {consistency: models.consistencies.one}
        },
        ormOptions: {
            defaultReplicationStrategy : {
                class: 'SimpleStrategy',
                replication_factor: 1
            },
            migration: 'safe'
        }
    },
    function(err) {
        if(err) throw err;
    }
);

var express = require('express');
var app = express();

app.get('/', function (req, res) {
    res.send('Testing Cassandra.');
});

app.get('/insertJohn', function (req, res) {
    var john = new models.instance.Person({
        name: "John",
        surname: "Doe",
        age: 38,
        created: Date.now()
    });

    john.saveAsync()
        .then(function () {
            console.log('John inserted!');
        })
        .catch(function (err) {
            console.log(err);
        });

    res.send('Insert John.');
});

app.get('/insertMary', function (req, res) {
    var john = new models.instance.Person({
        name: "Mary",
        surname: "Lu",
        age: 38,
        created: Date.now()
    });

    john.saveAsync()
        .then(function () {
            console.log('Mary inserted!');
        })
        .catch(function (err) {
            console.log(err);
        });

    res.send('Insert Mary.');
});

app.get('/select', function (req, res) {
    models.instance.Person.findOneAsync({age: 'John'})
        .then(function(john) {
            console.log('Found ' + john.name + ' ' + john.surname + ' to be ' + john.age + ' years old!');
            res.send('Found ' + john.name + ' ' + john.surname + ' to be ' + john.age + ' years old!');
        })
        .catch(function(err) {
            console.log(err);
        });
});

app.get('/all', function (req, res) {
    var query = {
        $limit:10
    };    
    models.instance.Person.find('', function(err, people){
        console.log(JSON.stringify(people));
        res.send('Found: ' + JSON.stringify(people));
    });
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});