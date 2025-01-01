const express = require('express');
const { resolve } = require('path');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite'); // Import `open` from `sqlite`

const app = express();
const port = 3010;

app.use(cors());
app.use(express.json());

let db;

// Initialize the database
(async () => {
  try {
    db = await open({
      filename: 'database.sqlite', // Ensure the database path is resolved
      driver: sqlite3.Database,
    });
    console.log('Database connection established.');
  } catch (err) {
    console.error('Error initializing the database:', err);
  }
})();
// Start the server
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

async function findAllRestaurants(){
  let query = "SELECT * FROM restaurants"
  let dd = await db.all(query,[])
  return dd;
}

//find all restaurants
app.get('/restaurants', async (req,res) => {
  try{
    let respo = await findAllRestaurants();
    if(respo.length === 0){
      res.status(404).json({error:"No restaurants found."})
    }
    res.status(200).json({restaurants:respo})
  }
  catch(error){
    res.status(500).json({error:error})
  }
})

async function findAllDishes(){
  let query = "SELECT * FROM dishes"
  let dd = await db.all(query,[])
  return dd;
}

//find all restaurants
app.get('/dishes', async (req,res) => {
  try{
    let respo = await findAllDishes();
    if(respo.length === 0){
      res.status(404).json({error:"No dishes found."})
    }
    res.status(200).json({dishes:respo})
  }
  catch(error){
    res.status(500).json({error:error})
  }
})

async function findRestaurantById(id){
  let query = "SELECT * FROM RESTAURANTS WHERE id = ?";
  let dd = await db.all(query,[id])
  return dd;
}

app.get('/restaurants/details/:id', async (req,res) => {
  try{
    let id = parseInt(req.params.id)
    let respo = await findRestaurantById(id);
    if(respo.length === 0){
      res.status(404).json({error:"No restaurants found."})
    }
    res.status(200).json({restaurant:respo})
  }
  catch(error){
    res.status(500).json({error:error})
  }
})

async function findDishesById(id){
  let query = "SELECT * FROM dishes WHERE id = ?";
  let dd = await db.all(query,[id])
  return dd;
}

app.get('/dishes/details/:id', async (req,res) => {
  try{
    let id = parseInt(req.params.id)
    let respo = await findDishesById(id);
    if(respo.length === 0){
      res.status(404).json({error:"No dishes found."})
    }
    res.status(200).json({dish:respo})
  }
  catch(error){
    res.status(500).json({error:error})
  }
})


async function findRestaurantByCusine(cuisine){
  let query = "SELECT * FROM RESTAURANTS WHERE cuisine = ?";
  let dd = await db.all(query,[cuisine])
  return dd;
}

app.get('/restaurants/cuisine/:cuisine', async (req,res) => {
  try{
    let cuisine = req.params.cuisine
    let respo = await findRestaurantByCusine(cuisine);
    if(respo.length === 0){
      res.status(404).json({error:"No restaurants found."})
    }
    res.status(200).json({restaurants:respo})
  }
  catch(error){
    res.status(500).json({error:error})
  }
})

async function fetchByFilter(isVeg,hasOutdoorSeating,isLuxury){
  let query = "SELECT * FROM RESTAURANTS WHERE isVeg = ? AND hasOutdoorSeating = ? AND isLuxury = ?"
  let dd = await db.all(query,[isVeg,hasOutdoorSeating,isLuxury])
  return dd;
}

app.get('/restaurants/filter', async (req,res) => {
  try{
    let isVeg = req.query.isVeg
    let hasOutdoorSeating = req.query.hasOutdoorSeating
    let isLuxury = req.query.isLuxury
    let respo = await fetchByFilter(isVeg,hasOutdoorSeating,isLuxury);
    if(respo.length === 0){
      res.status(404).json({error:"No restaurants found."})
    }
    res.status(200).json({restaurants:respo})
  }
  catch(error){
    res.status(500).json({error:error})
  }
})

async function fetchDishesByFilter(isVeg){
  let query = "SELECT * FROM dishes WHERE isVeg = ?"
  let dd = await db.all(query,[isVeg])
  return dd;
}

app.get('/dishes/filter', async (req,res) => {
  try{
    let isVeg = req.query.isVeg
    let respo = await fetchDishesByFilter(isVeg);
    if(respo.length === 0){
      res.status(404).json({error:"No dishes found."})
    }
    res.status(200).json({dishes:respo})
  }
  catch(error){
    res.status(500).json({error:error})
  }
})

async function sortByRating(){
  let query = "SELECT * FROM RESTAURANTS ORDER BY rating DESC"
  let dd = db.all(query,[])
  return dd
}

app.get("/restaurants/sort-by-rating", async (req,res) => {
  try{
    let respo = await sortByRating()
    if(respo.length === 0){
      res.status(404).json({error:"No restaurants found."})
    }
    res.status(200).json({restaurants:respo})
  }
  catch(error){
    res.status(500).json({error:error})
  }
})

async function sortByPrice(){
  let query = "SELECT * FROM dishes ORDER BY price"
  let dd = db.all(query,[])
  return dd
}

app.get("/dishes/sort-by-price", async (req,res) => {
  try{
    let respo = await sortByPrice()
    if(respo.length === 0){
      res.status(404).json({error:"No dishes found."})
    }
    res.status(200).json({dishes:respo})
  }
  catch(error){
    res.status(500).json({error:error})
  }
})