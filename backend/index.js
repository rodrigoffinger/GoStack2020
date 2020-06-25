const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const server = express();
server.use(express.json());
server.use(cors());

const projects = [];

let reqCount = 0;

server.use(logRequests);

function logRequests(req, res, next) {
  console.time("Request");

  reqCount++;
  console.log(
    `Request Count: ${reqCount}; HTTP Method: ${req.method}; URL: ${req.url}`
  );

  next();

  console.timeEnd("Request");
}

function validateProjectId(req, res, next) {
  const { id } = req.params;

  if (!isUuid(id)) {
    return res.status(400).json({ error: "Invalid project ID." });
  }

  next();
}

function checkProjectTitleExists(req, res, next) {
  if (!req.body.title) {
    return res.status(400).json({ error: "Project title is required" });
  }

  return next();
}

function checkProjectInArray(req, res, next) {
  const { id } = req.params;
  const project = projects.find((project) => project.id === id);

  if (!project) {
    return res.status(400).json({ error: "Project does not exists" });
  }

  req.project = project;

  return next();
}

function checkProjectExistsInArray(req, res, next) {
  const { id } = req.params;
  const project = projects.find((project) => project.id === id);

  if (project) {
    return res.status(400).json({ error: "Project already exists" });
  }

  req.project = project;

  return next();
}

server.get("/projects", (req, res) => {
  const { title } = req.query;

  const results = title
    ? projects.filter((project) => project.title.includes(title))
    : projects;

  return res.json(results);
});

server.get(
  "/projects/:id",
  validateProjectId,
  checkProjectInArray,
  (req, res) => {
    const { id } = req.params;

    return res.json(projects[id]);
  }
);

server.post(
  "/projects",
  checkProjectTitleExists,
  checkProjectExistsInArray,
  (req, res) => {
    const { title, owner } = req.body;

    projects.push({ id: uuid(), title, owner });

    return res.json(projects);
  }
);

server.put(
  "/projects/:id",
  validateProjectId,
  checkProjectTitleExists,
  checkProjectInArray,
  (req, res) => {
    const { id } = req.params;
    const { title, owner } = req.body;

    const projectIndex = projects.findIndex((project) => project.id === id);

    const project = {
      id,
      title,
      owner,
    };

    projects[projectIndex] = project;

    return res.json(project);
  }
);

server.delete(
  "/projects/:id",
  validateProjectId,
  checkProjectInArray,
  (req, res) => {
    const { id } = req.params;

    const projectIndex = projects.findIndex((project) => project.id === id);

    projects.splice(projectIndex, 1);

    return res.status(204).send();
  }
);

server.listen(3000, () => {
  console.log("Back-end started!");
});
