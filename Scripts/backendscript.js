const fs = require("fs");
const path = require("path");
const { exec } = require("child_process"); // Import child_process to run shell commands

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
  controllers: [`${camelCaseBaseName}Controllers.js`, "userController.js"],
  middleware: ["customMiddleware.js", "requireAuth.js"],
  models: [`${camelCaseBaseName}Model.js`, "userModel.js"],
  routers: [`${camelCaseBaseName}Router.js`, "userRouter.js"],
  rootFiles: [".env", "README.md", "app.js", "server.js", "package.json"], // Added package.json
};

// Function to create directories and files
const createStructure = (basePath, structure) => {
  Object.keys(structure).forEach((key) => {
    if (key === "rootFiles") {
      structure[key].forEach((file) => {
        const filePath = path.join(basePath, file);
        let content = "";
        // Custom content for root files
        if (file === ".env") {
          content =
            "PORT=4000\nMONGO_URI=mongodb://localhost:27017/scripttest\nSECRET=64bytesofrandomness\n";
        } else if (file === "README.md") {
          content = `# ${baseName} API\n\n## Overview\nThis API handles ${baseName} tasks.\n`;
        } else if (file === "server.js") {
          content = `const app = require ('./app');

const port = process.env.PORT || 4000;
// Start the server
app.listen(port, () => {
  console.log(\`Server is running on http://localhost:\${port}\`);
});`;
        } else if (file === "app.js") {
          content = `
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { requestLogger, unknownEndpoint, errorHandler } = require("./middleware/customMiddleware");
const ${camelCaseBaseName}Router = require("./routers/${camelCaseBaseName}Router");
const userRouter = require("./routers/userRouter");

// express app
const app = express();

connectDB();

// middleware
app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.get("/", (req, res) => res.send("API Running!"));

app.use("/api/${camelCaseBaseName}", ${camelCaseBaseName}Router);
app.use("/api/users", userRouter);

app.use(unknownEndpoint);
app.use(errorHandler);
          `;
        } else if (file === "package.json") {
          // Dynamically create the package.json file with no specific versions to always get the latest
          content = `
{
  "name": "${camelCaseBaseName}-api",
  "version": "1.0.0",
  "description": "API for managing ${camelCaseBaseName} tasks",
  "main": "app.js",
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  },
  "dependencies": {
    "bcryptjs": "*",
    "cors": "*",
    "dotenv": "*",
    "express": "*",
    "jsonwebtoken": "*",
    "mongoose": "*",
    "validator": "*"
  },
  "devDependencies": {
    "nodemon": "*"
  },
  "author": "",
  "license": "ISC"
}
          `;
        }

        fs.writeFileSync(filePath, content.trim(), "utf8");
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
        let content = "";

        // Custom content for each specific file
        if (file === "db.js") {
          content = `
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(\`MongoDB Connected: \${conn.connection.host}\`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
          `;
        } else if (file === `${camelCaseBaseName}Controllers.js`) {
          content = `
const ${pascalCaseBaseName} = require('../models/${camelCaseBaseName}Model');

const getAll${pascalCaseBaseName}s = async (req, res) => {
  try {
    const ${pascalCaseBaseName.toLowerCase()}s = await ${pascalCaseBaseName}.find();
    res.status(200).json(${pascalCaseBaseName.toLowerCase()}s);
  } catch (error) {
    res.status(500).json({ message: "Server error: Unable to fetch ${pascalCaseBaseName.toLowerCase()}s" });
  }
};

const get${pascalCaseBaseName}ById = async (req, res) => {
  try {
    const ${pascalCaseBaseName.toLowerCase()} = await ${pascalCaseBaseName}.findById(req.params.id);
    if (!${pascalCaseBaseName.toLowerCase()}) {
      return res.status(404).json({ message: "${pascalCaseBaseName} not found" });
    }
    res.status(200).json(${pascalCaseBaseName.toLowerCase()});
  } catch (error) {
    res.status(500).json({ message: "Server error: Unable to fetch ${pascalCaseBaseName.toLowerCase()}" });
  }
};

const add${pascalCaseBaseName} = async (req, res) => {
  const { title, type, location, description, salary, company, postedDate, status  } = req.body;

  if (!title || !type || !description|| !location  || !salary || !company || !postedDate || !status ) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  try {
    const new${pascalCaseBaseName} = new ${pascalCaseBaseName}({
      title,
      type,
      description,
      company,
      location,
      salary,
      postedDate,      
      status,
    });

    const created${pascalCaseBaseName} = await new${pascalCaseBaseName}.save();
    res.status(201).json(created${pascalCaseBaseName});
  } catch (error) {
    res.status(500).json({ message: "Server error: Unable to create ${pascalCaseBaseName.toLowerCase()}" });
  }
};

const update${pascalCaseBaseName} = async (req, res) => {
  const { title, type, location, description, salary, company, postedDate, status } = req.body;

  try {
    const ${pascalCaseBaseName.toLowerCase()} = await ${pascalCaseBaseName}.findById(req.params.id);

    if (!${pascalCaseBaseName.toLowerCase()}) {
      return res.status(404).json({ message: "${pascalCaseBaseName} not found" });
    }

    // Update fields
    ${pascalCaseBaseName.toLowerCase()}.title = title || ${pascalCaseBaseName.toLowerCase()}.title;
    ${pascalCaseBaseName.toLowerCase()}.type = type || ${pascalCaseBaseName.toLowerCase()}.type;
    ${pascalCaseBaseName.toLowerCase()}.description = description || ${pascalCaseBaseName.toLowerCase()}.description;
    ${pascalCaseBaseName.toLowerCase()}.location = location || ${pascalCaseBaseName.toLowerCase()}.location;
    ${pascalCaseBaseName.toLowerCase()}.salary = salary || ${pascalCaseBaseName.toLowerCase()}.salary;
    ${pascalCaseBaseName.toLowerCase()}.company = company || ${pascalCaseBaseName.toLowerCase()}.company;
    ${pascalCaseBaseName.toLowerCase()}.postedDate = postedDate || ${pascalCaseBaseName.toLowerCase()}.postedDate;
    ${pascalCaseBaseName.toLowerCase()}.status = status || ${pascalCaseBaseName.toLowerCase()}.status;

    const updated${pascalCaseBaseName} = await ${pascalCaseBaseName.toLowerCase()}.save();
    res.status(200).json(updated${pascalCaseBaseName});
  } catch (error) {
    res.status(500).json({ message: "Server error: Unable to update ${pascalCaseBaseName.toLowerCase()}" });
  }
};

const delete${pascalCaseBaseName} = async (req, res) => {
  try {
    const ${pascalCaseBaseName.toLowerCase()} = await ${pascalCaseBaseName}.findById(req.params.id); // Correct the model usage here

    if (!${pascalCaseBaseName.toLowerCase()}) {
      return res.status(404).json({ message: "${pascalCaseBaseName} not found" });
    }

    await ${pascalCaseBaseName}.findByIdAndDelete(req.params.id); // Delete the ${pascalCaseBaseName.toLowerCase()}
    res.status(200).json({ message: "${pascalCaseBaseName} removed successfully" });
  } catch (error) {
    console.error("Error deleting ${pascalCaseBaseName.toLowerCase()}:", error); // Log the error for debugging
    res.status(500).json({ message: "Server error: Unable to delete ${pascalCaseBaseName.toLowerCase()}" });
  }
};

module.exports = {
  getAll${pascalCaseBaseName}s,
  get${pascalCaseBaseName}ById,
  add${pascalCaseBaseName},
  update${pascalCaseBaseName},
  delete${pascalCaseBaseName},
};
          `;
        } else if (file === "userController.js") {
          content = `
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

// Generate JWT
const generateToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, {
    expiresIn: "3d",
  });
};

// @desc    Register new user
// @route   POST /api/users/signup
// @access  Public
const signupUser = async (req, res) => {
  const {
    name,
    email,
    password,
    phone_number,
    gender,
    date_of_birth,
    membership_status,
  } = req.body;

  try {
    const user = await User.signup(
      name,
      email,
      password,
      phone_number,
      gender,
      date_of_birth,
      membership_status
    );

    // create a token
    const token = generateToken(user._id);

    res.status(201).json({ email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.login(email, password);

    if (user) {
      // create a token
      const token = generateToken(user._id);
      res.status(200).json({ email, token });
    } else {
      res.status(400);
      throw new Error("Invalid credentials");
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @desc    Get user data
// @route   GET /api/users/me
// @access  Private
const getMe = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  signupUser,
  loginUser,
  getMe,
};
          `;
        } else if (file === "customMiddleware.js") {
          content = `
const requestLogger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  response.status(500).json({ message: error.message });
};

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
          `;
        } else if (file === "userRouter.js") {
          content = `const express = require("express");
const router = express.Router();
const { loginUser, signupUser } = require("../controllers/userController");

// login route
router.post("/login", loginUser);

// signup route
router.post("/signup", signupUser);

module.exports = router;`;
        } else if (file === "requireAuth.js") {
          content = `
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const requireAuth = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: "Authorization token required" });
  }

  const token = authorization.split(" ")[1];

  try {
    const { _id } = jwt.verify(token, process.env.SECRET);
    req.user = await User.findOne({ _id }).select("_id");
    next();
  } catch (error) {
    res.status(401).json({ error: "Request is not authorized" });
  }
};

module.exports = requireAuth;
          ;`;
        } else if (file === `${camelCaseBaseName}Router.js`) {
          content = `const express = require("express");
const requireAuth = require("../middleware/requireAuth");
const {
  getAll${pascalCaseBaseName}s,
  get${pascalCaseBaseName}ById,
  add${pascalCaseBaseName},
  update${pascalCaseBaseName},
  delete${pascalCaseBaseName},
} = require("../controllers/${pascalCaseBaseName.toLowerCase()}Controller");

const router = express.Router();

// Define routes for react${pascalCaseBaseName}
router.get("/", getAll${pascalCaseBaseName}s);

router.get("/:id", get${pascalCaseBaseName}ById);

// require auth for editing purpose
router.use(requireAuth);

router.post("/", add${pascalCaseBaseName});

router.put("/:id", update${pascalCaseBaseName});

router.delete("/:id", delete${pascalCaseBaseName});

// Export the router
module.exports = router;
`;
        } else if (file === "userModel.js") {
          content = `
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone_number: { type: String, required: true },
    gender: { type: String, required: true },
    date_of_birth: { type: Date, required: true },
    membership_status: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// static signup method
userSchema.statics.signup = async function (
  name,
  email,
  password,
  phone_number,
  gender,
  date_of_birth,
  membership_status
) {
  // validation
  if (
    (!name,
    !email ||
      !password ||
      !phone_number ||
      !gender ||
      !date_of_birth ||
      !membership_status)
  ) {
    throw Error("All fields must be filled");
  }
  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  }
  if (!validator.isStrongPassword(password)) {
    throw Error("Password is not strong enough");
  }

  const exists = await this.findOne({ email });

  if (exists) {
    throw Error("Email already in use");
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    name,
    email,
    password: hash,
    phone_number,
    gender,
    date_of_birth,
    membership_status,
  });

  return user;
};

// static login method
userSchema.statics.login = async function (email, password) {
  if (!email || !password) {
    throw Error("All fields must be filled");
  }

  const user = await this.findOne({ email });
  if (!user) {
    throw Error("Incorrect email");
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw Error("Incorrect password");
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);
          `;
        }

        fs.writeFileSync(filePath, content.trim(), "utf8");
        console.log(`Created file: ${filePath}`);
      });
    }
  });
};

// Function to run npm install
const installDependencies = (targetDir) => {
  console.log("Installing dependencies...");
  exec("npm install", { cwd: targetDir }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error during npm install: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.log("Dependencies installed successfully.");
  });
};

// Get the target directory from the command line arguments
const targetDir = process.argv[3] || __dirname;

// Create the structure
createStructure(targetDir, structure);

// Install dependencies
installDependencies(targetDir);
