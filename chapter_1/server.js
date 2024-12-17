// The address of this server connected to the network is: http://localhost:8383
// URL : http://localhost:8383
// IP : 172.0.0.1:8083

const express = require('express')
const app = express();
const PORT = 8383;

// let data = {
//     name: "HuuHungNguyen",
//     address: "Ha Noi",
//     country: "Viet Nam",
//     age: 23
// }
let data = ['james']

// Middle ware
app.use(express.json())

// Type-1
app.get('/', (req,res) => {
    // console.log('Yay I hit an  endpoint', req.method);
    // res.sendStatus(201)
    // res.send('<h1>home page<h1>')
    res.send(`
        <body style="background:pink; color:blue" >
            <h1>DATA:</h1>
            <p>${JSON.stringify(data)}<p>
              <a href="/dashboard">Dashboard</a>
        </body>
        <script>console.log('This is my script')</script`)
})
app.get('/dashboard', (req,res) => {
    // console.log('Ohh now I hit the /dashboard endpoint');
    // res.send('Hi')
    res.send(`
        <body>
            <h1>dashboard</h1>
            <a href="/">Home Page</a>
        <body>
    `)
})
// CRUD: Create-Post Read-Get Update-Put and Delete-delete
// Type-2 API ENDPOINTS (non visual);

app.get('/api/data', (req,res) => {
    console.log('This one was for data')
    res.status(599).send(data);
})

app.post('/api/data', (req,res) => {
    const newEntry = req.body; 
    console.log(newEntry)
    data.push(newEntry.name)
    res.sendStatus(201)
})

app.delete('/api/endpoint', (req,res) => {
    data.pop();
    console.log('We deleted the element off the end of the array');
    res.sendStatus(203)
})

app.listen(PORT, () => console.log(`Server hasted port: ${PORT}`))