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
  const { status, priority, category, todo } = request.query;
  let getTodosList = "";
  let data = null;
  if (isValidStatus(request.query)) {
    getTodosList = `SELECT * FROM todo WHERE status = '${status}';`;
    data = await database.all(getTodosList);
    response.send(data);
  } else if (isValidPriority(request.query)) {
    getTodosList = `SELECT * FROM todo WHERE priority = '${priority}';`;
    data = await database.all(getTodosList);
    response.send(data);
  } else if (isValidCategory(request.query)) {
    getTodosList = `SELECT * FROM todo WHERE category = '${category}';`;
    data = await database.all(getTodosList);
    response.send(data);
  } else if (isValidStatusAndPriorityProperty(request.query)) {
    getTodosList = `SELECT * FROM todo WHERE priority = '${priority}'
       AND status = '${status}';`;
    data = await database.all(getTodosList);
    response.send(data);
  } else if (isValidCategoryAndPriorityProperty(request.query)) {
    getTodosList = `SELECT * FROM todo WHERE category = '${category}'
       AND priority = '${priority}';`;
    data = await database.all(getTodosList);
    response.send(data);
  } else if (isValidStatusAndCategoryProperty(request.query)) {
    getTodosList = `SELECT * FROM todo WHERE category = '${category}'
       AND status = '${status}';`;
    data = await database.all(getTodosList);
    response.send(data);
  } else {
    getTodosList = `SELECT * FROM todo WHERE todo = '%${search_q}%';`;
    data = await database.all(getTodosList);
    response.send(data);
  }
    switch (false) {
      case isValidStatus(request.query):
        response.status(400);
        response.send("Invalid Todo Status");
        break;
      case isValidCategory(request.query):
        response.status(400);
        response.send("Invalid Todo Category");
        break;
      case isValidPriority(request.query):
        response.status(400);
        response.send("Invalid Todo Priority");
    }
});
module.exports = app;
