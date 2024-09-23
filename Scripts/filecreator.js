const fs = require("fs");
const path = require("path");

// Get the base name for the todo task files from the command line arguments
const baseName = process.argv[2];
if (!baseName) {
  console.error(
    "Please provide a base name for the todo task files as an argument."
  );
  process.exit(1);
}

// Convert the base name to camel case
const toCamelCase = (str) => {
  return str.replace(/-./g, (match) => match.charAt(1).toUpperCase());
};

const camelCaseBaseName = toCamelCase(baseName);

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
        fs.writeFileSync(filePath, "", "utf8");
        console.log(`Created file: ${filePath}`);
      });
    } else {
      const dirPath = path.join(basePath, key);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath);
        console.log(`Created directory: ${dirPath}`);
      }
      structure[key].forEach((file) => {
        const filePath = path.join(dirPath, file);
        fs.writeFileSync(filePath, "", "utf8");
        console.log(`Created file: ${filePath}`);
      });
    }
  });
};

// Get the target directory from the command line arguments
const targetDir = process.argv[3] || __dirname;

// Create the structure
createStructure(targetDir, structure);
