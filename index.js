const mongoose = require('mongoose')
const express = require('express')
const app = express()
const port = 3000
var methodOverride = require('method-override')

//middleware to to accept from views
app.use(express.urlencoded({extended : true}))
app.use(methodOverride('X-HTTP-Method-Override'))

mongoose.connect('mongodb://localhost:27017/UserData')
.then(() => {
    console.log("connection successful")
}).catch(() => {
    console.log("Something went wrong")
})


const User = require("./model/user")

app.set("view engine", "ejs")

//rendering a index.ejs to index.js
app.get('/', (req, res) => {
    res.render('index')
  })

  //post request accept from ejs to database
  app.post("/", async(req, res) => {
     const data = new User(req.body)
     await data.save()
     res.send("Save Data")
    //console.log(req.body)
  })
  
  app.get("/show", async(req,res) =>{
    const items =await User.find({})
    res.render('show', {items : items})
  })

  app.get("/show/:id/edit", async(req,res) =>{
    const {id} = req.params;
    const items = await User.findById(id)
    res.render('edit', {items})
  })

  app.put("/show/:id", async(req, res) =>{
    const {id} = req.params;
    const items = await User.findByIdAndUpdate(id, req.body, {runValidators : true, new : true })
    res.redirect("/")
  })

  app.delete('/show/:id',async (req, res) => {
    const {id} = req.params
    const deleteItem = await User.findByIdAndDelete(id)
    res.redirect("/show")
  })

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })

// const Cat = mongoose.model('Cat', { name: String });

// const kitty = new Cat({ name: 'Zildjian' });
// kitty.save().then(() => console.log('meow'));