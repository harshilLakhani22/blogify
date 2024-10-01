import { Router } from "express";
import multer, { diskStorage } from "multer";
import { resolve } from "path";

import Blog from "../models/blog";
import Comment from "../models/comments";

const router = Router();

const storage = diskStorage({
  destination: function (req, file, cb) {
    cb(null, resolve(`./public/uploads/`));
  },
  filename: function (req, file, cb) {
    const filename = `${Date.now()}-${file.originalname}`;
    cb(null, filename);
  },
});

const upload = multer({ storage: storage });

router.get("/add-new", (req, res) => {
  return res.render("addblog", {
    user: req.user,
  });
});

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const comments = await Comment.find({ blogId: req.params.blogId}).populate("createdBy");
  return res.render("blog", {
    user: req.user,
    blog,
    comments,
  })
})

router.post("/comment/:blogId", async (req, res) => {
  await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id,
  });
  return res.redirect(`/blog/${req.params.blogId}`);
})

router.post("/", upload.single('coverImage'), async (req, res) => {
    const { title, body } = req.body;
    const blog = await Blog.create({
        body,
        title,
        createdBy: req.user._id,
        coverImageURL: `/uploads/${req.file.filename}`,
    });
  return res.redirect(`/blog/${blog._id}`);
});

export default router;
