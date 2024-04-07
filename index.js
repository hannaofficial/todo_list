import express from "express";
import bodyParser from "body-parser";
import pg from "pg"
const app = express();
const port = 3000;

const db = new pg.Client({
        
  user: "postgres",
  host: "localhost",
  database: "todo",
  password: "12345",
  port: 5432,

});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

async function getTodos() {
  const result = await db.query("SELECT * FROM todo_list ORDER BY id ASC;");
  return result.rows;
  
}

app.get("/", async (req, res) => {
  try{
  const data = await getTodos();
  console.log(data)
  res.render("index.ejs", {
    listTitle: "Todo List",
    listItems: data,
  });
  }catch(error){
    console.error(error);
    res.status(500).send("Error fetching data");
  }
});

app.post("/add", async (req, res) => {
  const item = req.body.newItem;
try{
  const result = await db.query("INSERT INTO todo_list (title) VALUES ($1) ;",[item])
  res.redirect("/");
}catch(error){
  console.error(error);
  res.status(500).send("Error fetching data");
}
});

app.post("/edit", async (req, res) => {
  const item = req.body.updatedItemTitle;
  const idx = req.body.updatedItemId;
  try{
  const result =  await db.query("UPDATE todo_list SET title=$1 WHERE id = $2 RETURNING *; ",[item,idx])
  res.redirect("/");
}catch(error){
  console.error(error);
  res.status(500).send("Error fetching data");
}
});

app.post("/delete", (req, res) => {
  
 const id  = req.body.deleteItemId
 db.query("DELETE FROM todo_list WHERE id=$1;",[id]);
 res.redirect("/")
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
