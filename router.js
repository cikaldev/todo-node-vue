'use strict';

// database
const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('todo.db');
db.once('open', () => console.log('# db:connected'))

// router
const router = require('express').Router()

router.post('/create', (req, res, next) => {
  const { title, description } = req.body
  
  db.serialize(() => {
    const rawQuery = 'insert into my_todo(title, description) values(?,?)';
    db.run(rawQuery, [title, description], (err1, row) => {
      if (err1) throw err1;
      db.all('select * from my_todo order by updated_at desc', (err2, data) => {
        if (err2) throw err2;
        res.json(data)
      })
    })
  })
});

router.get('/read', async (req, res, next) => {
  db.serialize(() => {
    db.all('select * from my_todo order by updated_at desc', (err, data) => {
      if (err) throw err;
      res.json(data)
    })
  })
});

router.post('/update/:id', (req, res, next) => {
  const { title, description } = req.body
  const id = req.params.id

  db.serialize(() => {
    db.run('update my_todo set title=?, description=? where id=?', [title, description, id], (err1) => {
      if (err1) throw err1;
      db.all('select * from my_todo order by updated_at desc', (err2, data) => {
        if (err2) throw err2;
        res.json(data)
      })
    })
  })
});

router.get('/delete/:id', (req, res, next) => {
  const id = req.params.id

  db.serialize(() => {
    db.run('delete from my_todo where id=?', [id], (err1) => {
      if (err1) throw err1;
      db.all('select * from my_todo order by updated_at desc', (err2, data) => {
        if (err2) throw err2;
        res.json(data)
      })
    })
  })
});


module.exports = router