const express = require("express");
const bodyParser = require("body-parser");
const {Pool} = require("pg");

const cors = require("cors");

const app = express();
const port = 3001;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "blog_post",
  password: "postgres",
  port: 5432,
});

app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Welcome to my API");
});

app.get("/api/fetch/posts", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM posts");
    const posts = result.rows;
    client.release();

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts from database:", error);
    res.status(500).json({error: "Internal Server Error"});
  }
});

app.get("/api/fetch/users", async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query("SELECT * FROM users");
    const users = result.rows;
    client.release();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching posts from database:", error);
    res.status(500).json({error: "Internal Server Error"});
  }
});

app.post("/api/add/posts", async (req, res) => {
  const {title, body, userid} = req.body;

  try {
    const client = await pool.connect();
    const result = await client.query(
      "INSERT INTO posts ( title, body,userid ) VALUES ($1, $2, $3) RETURNING *",
      [title, body, userid]
    );

    client.release();
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating new post:", error);
    res.status(500).json({error: "Internal Server Error"});
  }
});

app.put("/api/update/posts/:id", async (req, res) => {
  const postId = req.params.id;
  const {title, body, userId} = req.body;
  try {
    const client = await pool.connect();
    const result = await client.query(
      "UPDATE posts SET title = $1, body = $2, userid = $3 WHERE id = $4 RETURNING *",
      [title, body, userId, postId]
    );
    const updatedPost = result.rows[0];
    client.release();
    res.json(updatedPost);
  } catch (error) {
    console.error("Error updating post in database:", error);
    res.status(500).json({error: "Internal Server Error"});
  }
});

app.delete("/api/delete/posts/:id", async (req, res) => {
  const postId = req.params.id;
  try {
    const client = await pool.connect();
    const result = await client.query(
      "DELETE FROM posts WHERE id = $1 RETURNING *",
      [postId]
    );
    const deletedPost = result.rows[0];
    client.release();
    res.json(deletedPost);
  } catch (error) {
    console.error("Error deleting post from database:", error);
    res.status(500).json({error: "Internal Server Error"});
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
