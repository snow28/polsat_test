const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // core module
const request = require('request');

//init app
const app = express();
// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));









app.post('/getData', function(req, res) {
    var stringData = "{\n" +
        "\t\"id\": 1,\n" +
        "\t\"jsonrpc\": \"2.0\",\n" +
        "\t\"method\": \"getCategoryContentWithFlatNavigation\",\n" +
        "\t\"params\": {\n" +
        "\t\t\"ua\": \"www_iplatv/12345 (Mozilla/5.0 Macintosh; Intel Mac OS X 10_10_5 AppleWebKit/537.36 KHTML, like Gecko Chrome/69.0.3497.100 Safari/537.36)\",\n" +
        "\t\t\"catid\": 829,\n" +
        "\t\t\"limit\": 300,\n" +
        "\t\t\"offset\": 0,\n" +
        "\t\t\"clientId\": \"c921d668-1fdc-4e71-b15ee8338d2c9bb2\"\n" +
        "\t}\n" +
        "}";

    var url = "https://b2c-www.redefine.pl/rpc/navigation/";

    request({
        headers: {
            Accept: 'application/json'
        },
        uri: url,
        body: stringData,
        method: 'POST'
    }, function (err, body) {
        res.send(body);
    });


});



// Start Server
app.listen(3000, function(req, res){
    console.log('Server started on port 3000...');
});






















