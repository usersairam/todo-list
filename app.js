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
  return (
    requestQuery.status === "TO DO" ||
    requestQuery.status === "IN PROGRESS" ||
    (requestQuery.status === "DONE" && requestQuery.status !== undefined)
  );
};
const isValidPriority = (requestQuery) => {
  return (
    requestQuery.priority === "HIGH" ||
    requestQuery.priority === "MEDIUM" ||
    (requestQuery.priority === "LOW" && requestQuery.priority !== undefined)
  );
};
const isdefinedPriority = (requestQuery) => {
  return requestQuery.priority !== undefined;
};
const isdefinedStatus = (requestQuery) => {
  return requestQuery.status !== undefined;
};
const isdefinedCategory = (requestQuery) => {
  return requestQuery.category !== undefined;
};
const isValidCategory = (requestQuery) => {
  return (
    requestQuery.category === "WORK" ||
    requestQuery.category === "HOME" ||
    (requestQuery.category === "LEARNING" &&
      requestQuery.category !== undefined)
  );
};
const isValidDueDate = (requestQuery) => {
  let theDate = format(new Date(requestQuery.date), "yyyy-MM-dd");
  return validDate(theDate);
};
app.get("/todos/", async (request, response) => {
  const { status, priority, category, todo, search_q } = request.query;
  let getTodosList = "";
  let data = null;
  if (isValidStatus(request.query) && isValidPriority(request.query)) {
    getTodosList = `SELECT id,todo,priority,category,status,due_date as dueDate
     FROM todo WHERE priority = '${priority}'
         AND status = '${status}';`;
    data = await database.all(getTodosList);
    response.send(data);
  } else if (isValidCategory(request.query) && isValidPriority(request.query)) {
    getTodosList = `SELECT id,todo,priority,category,status,due_date as dueDate
     FROM todo WHERE category = '${category}'
         AND priority = '${priority}';`;
    data = await database.all(getTodosList);
    response.send(data);
  } else if (isValidStatus(request.query) && isValidCategory(request.query)) {
    getTodosList = `SELECT id,todo,priority,category,status,due_date as dueDate
     FROM todo WHERE category = '${category}'
         AND status = '${status}';`;
    data = await database.all(getTodosList);
    response.send(data);
  } else if (isdefinedStatus(request.query)) {
    if (isValidStatus(request.query)) {
      getTodosList = `SELECT id,todo,priority,category,status,due_date as dueDate 
      FROM todo WHERE status = '${status}';`;
      data = await database.all(getTodosList);
      response.send(data);
    } else {
      response.status(400);
      response.send("Invalid Todo Status");
    }
  } else if (isdefinedPriority(request.query)) {
    if (isValidPriority(request.query)) {
      getTodosList = `SELECT id,todo,priority,category,status,due_date as dueDate
       FROM todo WHERE priority = '${priority}';`;
      data = await database.all(getTodosList);
      response.send(data);
    } else {
      response.status(400);
      response.send("Invalid Todo Priority");
    }
  } else if (isdefinedCategory(request.query)) {
    if (isValidCategory(request.query)) {
      getTodosList = `SELECT id,todo,priority,category,status,due_date as dueDate
       FROM todo WHERE category = '${category}';`;
      data = await database.all(getTodosList);
      response.send(data);
    } else {
      response.status(400);
      response.send("Invalid Todo Category");
    }
  } else {
    getTodosList = `SELECT id,todo,priority,category,status,due_date as dueDate
     from todo where todo like '%${search_q}%';`;
    data = await database.all(getTodosList);
    response.send(data);
  }
});
app.get("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  let todoIdQuery = `SELECT id,todo,priority,category,status,due_date as dueDate
   from todo where id = ${todoId};`;
  let theTodo = await database.get(todoIdQuery);
  response.send(theTodo);
});
app.post("/todos/", async (request, response) => {
  const {id,todo,priority,status,category,dueDate} = request.body
  
});
app.put("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  const { status, priority, todo, category, dueDate } = request.body;
  if (isdefinedStatus(request.body)) {
    if (isValidStatus(request.body)) {
      let updatedQuery = `update todo 
      set status = ${status} where id = ${todoId};`;
      await database.run(updatedQuery);
      response.send("Status Updated");
    } else {
      response.status(400);
      response.send("Invalid Todd Status");
    }
  } else if (isdefinedPriority(request.body)) {
    if (isValidPriority(request.body)) {
      let updatedQuery = `update todo 
      set priority = ${priority} where id = ${todoId};`;
      await database.run(updatedQuery);
      response.send("Priority Updated");
    } else {
      response.status(400);
      response.send("Invalid Todo Priority");
    }
  } else if (isdefinedCategory(request.body)) {
    if (isValidCategory(request.body)) {
      let updatedQuery = `update todo 
      set category = ${category} where id = ${todoId};`;
      await database.run(updatedQuery);
      response.send("Category Updated");
    } else {
      response.status(400);
      response.send("Invalid Todo Category");
    }
  } else {
    let updatedQuery = `update todo 
      set due_date = ${dueDate} where id = ${todoId};`;
    await database.run(updatedQuery);
    response.send("Due Date Updated");
  }
});
app.delete("/todos/:todoId/", async (request, response) => {
  const { todoId } = request.params;
  let deleteQuery = `delete from todo where id = ${todoId};`;
  await database.run(deleteQuery);
  response.send("Todo Deleted");
});
module.exports = app;
