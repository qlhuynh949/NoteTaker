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


app.delete('api/notes/:id', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) { console.log(err) }
    const notes = JSON.parse(data)
    notes.filter(note => note.title !== req.params.item[0])
    fs.writeFileSync('./db/db.json', JSON.stringify(notes, null, 2));
    console.log(notes)
    // res.json(notes.filter(note => note.title === req.params.item)[0])
    // console.log(notes)
  })
})

app.post('/api/notes', (req, res) => {
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) { console.log(err) }
    const notes = JSON.parse(data)
    notes.push(req.body)
    fs.writeFile('./db/db.json', JSON.stringify(notes), err => {
      if (err) { console.log(err) }
      res.sendStatus(200)
    })
  })
})

app.listen(process.env.PORT || 3000)
