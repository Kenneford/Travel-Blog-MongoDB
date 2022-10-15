// import { dotenv } from "dotenv";
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const crypto = require("crypto");
crypto.randomBytes(64);
const {
  userSignup,
  getRegUsers,
  validateUser,
  // userLogin,
  authenticateToken,
  // authUserRole,
} = require("./usersController/users");
const {
  getUserById,
  createBlog,
  getUsersBlogs,
  getBlogByID,
  updateBlog,
  deleteBlog,
} = require("./usersController/userBlogs");
const VerifiedUsersBlog = require("./model/verifiedUsersBlog");

const { authRole, adminCheck } = require("./permissions/authUserRoles");

const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.set("view engine", "ejs");
app.use(express.static("public"));

function sendErrorOutput(err, res) {
  res.status(400).send({
    errors: [err.message],
  });
}

app.post("/api/signup", async (req, res) => {
  console.log(req.body);
  res.send(await userSignup(req.body));
  res.json({ Status: "You're successfully signed up!" });
});

app.get("/api/signedup-users", async (req, res) => {
  res.send(await getRegUsers());
});
app.get("/api/signedup-user/:id", async (req, res) => {
  const { id } = req.params;
  getUserById(id)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => sendErrorOutput(err, res));
});

//Signing In a User
app.post("/api/login", async (req, res) => {
  const result = await validateUser(req.body);
  console.log(result);
  if (!result) {
    res.status(403).send({ error: "Authentication failed" });
    return;
  }
  res.send(result);
});

app.get("/api/log-out", async (req, res) => {
  const result = await logOutUser(req.body);
  console.log(result);
  if (!result) {
    return res.send("Error logging out!");
  }
  res.json({ Status: "You successfully logged out" });
});

//Posting a Blog By a Validated User
app.post("/api/blog", async (req, res) => {
  console.log(req.body);
  const result = await validateUser(req.body);
  if (result) {
    return res.send("Not Authorized!");
  }
  const usersBlog = await createBlog(req.body);
  res.cookie("access_token", result, {
    httpOnly: true,
    secure: false,
  });
  res.json({ Status: "Your blog is posted successfully!" }).send(usersBlog);
});

app.get("/api/admins", async (req, res) => {
  res.send(await adminCheck());
});

//Getting All Blogs
app.get(
  "/api/blog",
  // authenticateToken,
  // authRole(adminCheck()),
  async (req, res) => {
    res.send(await getUsersBlogs());
  }
);

//Getting a Blog By ID
app.get("/api/blog/:id", (req, res) => {
  const { id } = req.params;
  getBlogByID(id)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => sendErrorOutput(err, res));
});

// app.patch("/api/blog/:id", (req, res) => {
//   const { id } = req.params;
//   updateBlog(id)
//     .then((data) => {
//       res.json({ Status: "Blog successfully updated!" });
//     })
//     .catch((err) => sendErrorOutput(err, res));
// });

//Patching/Updating One
app.patch("api/blog/:id", async (req, res) => {
  const { id } = req.params;
  const updateBlog = await VerifiedUsersBlog.findByIdAndUpdate(
    { _id: id },
    {
      set: {
        // userName: req.body.userName,
        title: req.body.title,
        richText: req.body.richText,
        blogImage: req.body.blogImage,
      },
    }
  );
  res.send(updateBlog);
});
//Patching/Updating Many
// app.patch("api/blog/:id", async (req, res) => {
//   const { id } = req.params;
//   const criteria = req.query;
//   const updateBlog = await VerifiedUsersBlog.updateMany(
//     { criteria },
//     {
//       set: {
//         userName: req.body.userName,
//         title: req.body.title,
//         richText: req.body.richText,
//       },
//     }
//   );
//   res.send(updateBlog);
// });

//Updating via PUT method by ID
// app.put("api/blog/:id", async (req, res) => {
//   const { id } = req.params;
//   const updateBlog = await VerifiedUsersBlog.updateOne(
//     { _id: id },
//     {
//       set: {
//         userName: req.body.userName || "",
//         title: req.body.title || "",
//         richText: req.body.richText || "",
//       },
//     }
//   );
//   res.send(updateBlog);
// });

app.delete("/api/blog/:id", (req, res) => {
  const { id } = req.params;
  deleteBlog(id)
    .then((data) => {
      res.json({ Status: "Blog successfully deleted!" });
    })
    .catch((err) => sendErrorOutput(err, res));
});

// app.get(
//   "/api/managecountry",
//   authenticateToken,
//   authUserRole(),
//   async (req, res) => {
//     res.send();
//   }
// );
// app.get(
//   "/api/managecountry",
//   authenticateToken,
//   authRole({ userRole: "admin" }),
//   async (req, res) => {
//     res.send("Manage Country Page");
//   }
// );

// app.get("/blog", authenticateToken, async (req, res) => {
//   const users = await getRegUsers();
//   console.log(users);
//   res.render("pages/blog", { users });
// });

app.listen(port, () => console.log(`conncted to Database at port ${port}`));
