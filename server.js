const http = require('http')

const server = http.createServer((req, res) => {
    console.log('server is working perfectly')

    // database is db
    var db = [
        {
            title: 'The Office',
            comedian: 'Steve Carell',
            year: 2005,
            id: 1
        },
        {
            title: 'Parks and Recreation',
            comedian: 'Amy Poehler',
            year: 2009,
            id: 2
        },
        {
            title: 'Brooklyn Nine-Nine',
            comedian: 'Andy Samberg',
            year: 2013,
            id: 3
        }
    ]
    if (req.url == '/') {
        if (req.method == 'POST') {
            const body = []
            req.on('data', (chunk) => {
                body.push(chunk)
            })
            req.on('end', () => {
                try {
                    const convertedBuffer = Buffer.concat(body).toString();
                    const jsonData = JSON.parse(convertedBuffer);
                    jsonData.id = db.length + 1;
                    db.push(jsonData);

                    res.writeHead(201);
                    res.write(JSON.stringify(db));
                    res.end();
                } catch (error) {
                    console.error('Error parsing data:', error);
                    res.writeHead(400);
                    res.end('Invalid data format');
                }
            });
        }
        else if (req.method == 'GET') {
            res.writeHead(200)
            res.write(JSON.stringify(db))
            res.end()
        }

        else {
            res.writeHead(400)
            res.end('invalid request')
        }
    }
    else if (req.url.startsWith('/users/')) {
        // Extract ID from URL (assuming numerical ID)
        const id = parseInt(req.url.split('/')[2]);

        // Check if ID is a valid number and exists in the database
        if (isNaN(id) || db.findIndex((element) => element.id === id) === -1) {
            res.writeHead(404);
            res.end('User not found');
            return;  // Exit this handler if ID is invalid or not found
        }

        const entry = db.findIndex((element) => element.id === id);

        if (req.method === 'DELETE') {
            try {
              // Remove the element from the database (might return an empty array)
              let deletedRecord = db.splice(entry, 1)
            //   console.log(deletedRecord)
          
              res.writeHead(202);  // No content
              res.end(JSON.stringify(deletedRecord));
            } catch (error) {
              // Handle unexpected errors during request processing
              console.error('Unexpected error:', error);
              res.writeHead(500);  // Internal Server Error
              res.end('An internal server error occurred.');
            }
          
        } else if (req.method === 'GET') {
            res.writeHead(200);
            res.write(JSON.stringify(db[entry]));
            res.end();
        } else if (req.method === 'PUT') {
            const body = [];
            req.on('data', (chunk) => {
                body.push(chunk);
            });
            req.on('end', () => {
                try {
                    const convertedBuffer = Buffer.concat(body).toString();
                    const jsonRes = JSON.parse(convertedBuffer);
                    jsonRes['id'] = db.length + 1
                    db[entry] = jsonRes; // Replace entire entry with new data
                    res.writeHead(202);  // Accepted
                    res.write(JSON.stringify(db[entry]));
                    res.end();
                } catch (error) {
                    console.error('Error parsing data:', error);
                    res.writeHead(400);
                    res.end('Invalid data format');
                }
            });
        } else if (req.method === 'PATCH') {
            const body = [];
            req.on('data', (chunk) => {
                body.push(chunk);
            });
            req.on('end', () => {
                try {
                    const convertedBuffer = Buffer.concat(body).toString();
                    const jsonRes = JSON.parse(convertedBuffer);
                    for (let key in jsonRes) {
                        if (jsonRes.hasOwnProperty(key) && db[entry].hasOwnProperty(key)) {
                            db[entry][key] = jsonRes[key];
                        }
                    }
                    res.writeHead(202);  // Accepted
                    res.write(JSON.stringify(db[entry]));
                    res.end();
                } catch (error) {
                    console.error('Error parsing data:', error);
                    res.writeHead(400);
                    res.end('Invalid data format');
                }
            });
        } else {
            res.writeHead(400);
            res.end('Invalid request method');
        }
    }

    else {
        res.statusCode = 404
        res.statusMessage = 'Page not found'
        res.end('Page not found')
    }
})

const PORT = 5500

server.listen(PORT, '127.0.0.1', () => {
    console.log(`Server is listening on port ${PORT}`)
})