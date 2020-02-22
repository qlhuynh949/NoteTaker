const express = require('express')
const path = require('path')
const fs = require('fs')
const app = express()

app.use(express.static(path.join(__dirname, 'public')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, notes) => {
    if (err) { console.log(err) }
    res.json(JSON.parse(notes))
  })
})

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, './public/notes.html'))

})




app.delete('/api/notes/:id', (req, res) => {

  data = fs.readFileSync('./db/db.json', 'utf8')
  const notes = JSON.parse(data)
  let newData = notes.filter(note => {
    return note.id == req.params.id;
  })[0];

  const index = notes.indexOf(newData);

  notes.splice(index, 1);
  fs.writeFile('./db/db.json', JSON.stringify(notes), err => {
    if (err) { console.log(err) }
    res.sendStatus(200)
  })


})

app.post('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) { console.log(err) }
    const notes = JSON.parse(data)
    let lastItem = notes[notes.length - 1]
    let item = { title: req.body.title, text: req.body.text, id: lastItem.id + 1 }
    notes.push(item)
    fs.writeFile('./db/db.json', JSON.stringify(notes), err => {
      if (err) { console.log(err) }
      res.sendStatus(200)
    })
  })
})

app.listen(process.env.PORT || 3000)
