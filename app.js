const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
const validDate = require("date-fns/isValid");
const { format } = require("date-fns");

const databasePath = path.join(__dirname, "todoApplication.db");

const app = express();

app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });

    app.listen(3000, () =>
      console.log("Server Running at http://localhost:3000/")
    );
  } catch (error) {
    console.log(`DB Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();
const isValidStatus = (requestQuery) => {
  return requestQuery.status !== undefined;
};
const isValidPriority = (requestQuery) => {
  return requestQuery.priority !== undefined;
};
const isValidStatusAndPriorityProperty = (requestQuery) => {
  return (
    requestQuery.status !== undefined && requestQuery.priority !== undefined
  );
};
const isValidStatusAndCategoryProperty = (requestQuery) => {
  return (
    requestQuery.status !== undefined && requestQuery.category !== undefined
  );
};
const isValidCategoryAndPriorityProperty = (requestQuery) => {
  return (
    requestQuery.category !== undefined && requestQuery.priority !== undefined
  );
};
const isValidCategory = (requestQuery) => {
  return requestQuery.category !== undefined;
};
const isValidDueDate = (requestQuery) => {
  let theDate = format(new Date(requestQuery.date), "yyyy-MM-dd");
  return isValid(theDate);
};
app.get("/todos/", async (request, response) => {
  const { status, priority, category, search_q = "", date } = request.query;
  let data = null;
  let getTodosquery = "";
  switch (true) {
    case isValidStatus(request.query):
      getTodosQuery = `SELECT *  FROM todo
          WHERE status='${status}';`;
      break;
    case isValidPriority(request.query):
      getTodosQuery = `SELECT * FROM
          todo
          WHERE priority = '${priority}';`;
      break;
    case isValidStatusAndPriorityProperty(request.query):
      getTodosQuery = `SELECT * FROM 
          todo
          WHERE status='${status}' AND 
          priority = '${priority}';`;
      break;
    case isValidCategory(request.query):
      getTodosQuery = `SELECT * FROM
          todo WHERE category = '${category}';`;
      break;
    case isValidCategoryAndPriorityProperty(request.query):
      getTodosQuery = `SELECT * FROM 
          todo where category = '${category}' and 
          priority = '${priority}';`;
      break;
    case isValidStatusAndCategoryProperty(request.query):
      getTodosQuery = `SELECT * FROM 
          todo WHERE status = '${status}'
          AND priority = '${priority}';`;
      break;
    default:
      getTodosQuery = `SELECT * FROM todo 
          where todo like '%${search_q}%';`;
  }
  data = await database.all(getTodosQuery);
  response.send(data);
});
module.exports = app;
