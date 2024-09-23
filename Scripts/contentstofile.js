const fs = require("fs");
const path = require("path");

// Get the base name for the todo task files from the command line arguments
const baseName = process.argv[2];
if (!baseName) {
  console.error("Please provide a base name as an argument.");
  process.exit(1);
}

// Convert the base name to camel case
const toCamelCase = (str) => {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^(.)/, (c) => c.toLowerCase());
};

// Convert the base name to Pascal case
const toPascalCase = (str) => {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^(.)/, (c) => c.toUpperCase());
};

const camelCaseBaseName = toCamelCase(baseName);
const pascalCaseBaseName = toPascalCase(baseName);

// Define the directory and file structure
const structure = {
  config: ["db.js"],
  controllers: [`${camelCaseBaseName}Controllers.js`, "userControllers.js"],
  middleware: ["customMiddleware.js", "requireAuth.js"],
  models: [`${camelCaseBaseName}Model.js`, "userModel.js"],
  routers: [`${camelCaseBaseName}Router.js`, "userRouter.js"],
  rootFiles: [".env", "README.md", "app.js"],
};

// Function to create directories and files
const createStructure = (basePath, structure) => {
  Object.keys(structure).forEach((key) => {
    if (key === "rootFiles") {
      structure[key].forEach((file) => {
        const filePath = path.join(basePath, file);
        try {
          fs.writeFileSync(filePath, "", "utf8");
          console.log(`Created file: ${filePath}`);
        } catch (err) {
          console.error(`Error creating file ${filePath}:`, err);
        }
      });
    } else {
      const dirPath = path.join(basePath, key);
      if (!fs.existsSync(dirPath)) {
        try {
          fs.mkdirSync(dirPath);
          console.log(`Created directory: ${dirPath}`);
        } catch (err) {
          console.error(`Error creating directory ${dirPath}:`, err);
        }
      }
      structure[key].forEach((file) => {
        const filePath = path.join(dirPath, file);
        try {
          if (file === `${camelCaseBaseName}Controller.js`) {
            const content = `
const mongoose = require('mongoose');
const ${pascalCaseBaseName} = require('../models/${camelCaseBaseName}Model');

// get all ${pascalCaseBaseName}s
const get${pascalCaseBaseName}s = async (req, res) => {
  res.status(200).json({ message: 'Hello from get${pascalCaseBaseName}s' });
}

// Add one ${pascalCaseBaseName}
const add${pascalCaseBaseName} = async (req, res) => {
  res.status(200).json({ message: 'Hello from add${pascalCaseBaseName}' });
}

// Get ${pascalCaseBaseName} by ID
const get${pascalCaseBaseName} = async (req, res) => {
  res.status(200).json({ message: 'Hello from get${pascalCaseBaseName}' });
}

// Delete ${pascalCaseBaseName} by ID
const delete${pascalCaseBaseName} = async (req, res) => {
  res.status(200).json({ message: 'Hello from delete${pascalCaseBaseName}' });
}

// Update ${pascalCaseBaseName} by ID
const update${pascalCaseBaseName} = async (req, res) => {
  res.status(200).json({ message: 'Hello from update${pascalCaseBaseName}' });
}

module.exports = {
  get${pascalCaseBaseName}s,
  add${pascalCaseBaseName},
  get${pascalCaseBaseName},
  delete${pascalCaseBaseName},
  update${pascalCaseBaseName},
};
            `;
            fs.writeFileSync(filePath, content.trim(), "utf8");
          } else {
            fs.writeFileSync(filePath, "", "utf8");
          }
          console.log(`Created file: ${filePath}`);
        } catch (err) {
          console.error(`Error creating file ${filePath}:`, err);
        }
      });
    }
  });
};

// Get the target directory from the command line arguments
const targetDir = process.argv[3] || __dirname;

// Create the structure
createStructure(targetDir, structure);
