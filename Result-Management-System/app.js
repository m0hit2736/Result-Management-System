const express = require("express");
//express app
const app = express();

const port = 8080;

//register view engine
app.set('view engine', 'ejs');

//middleware and static files
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded());

//express layouts
var expressLayouts = require('express-ejs-layouts');
app.use(expressLayouts);
app.set('layout', 'layouts/layout');

//teacher and student routes
const teachRoutes = require("./routes/teacherRoutes")
const studRoutes = require("./routes/studentRoutes")
app.use("/teacher", teachRoutes);
app.use("/student", studRoutes);

//routes
app.get("/", (req, res) => {
  res.render("index");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});