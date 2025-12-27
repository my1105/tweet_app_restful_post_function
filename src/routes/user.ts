import express, {RequestHandler} from "express";
import {join} from "node:path";
import multer from "multer";
import {nanoid} from "nanoid";
import {User} from "@/models/user";
import {
  isUniqueEmail,
  ensureAuthUser,
  forbidAuthUser,
} from "@/middlewares/authentication";
import {ensureCorrectUser} from "@/middlewares/current_user";
import {body, validationResult} from "express-validator";
import {HashPassword} from "@/lib/hash_password";

export const userRouter = express.Router();

/** A page to list all users */
userRouter.get("/", ensureAuthUser, async (req, res) => {
  const users = await User.all();
  res.render("users/index", {
    users,
  });
});

/** An endpoint to create a new user */
userRouter.post(
  "/",
  forbidAuthUser,
  body("name", "Name can't be blank").notEmpty(),
  body("email", "Email can't be blank").notEmpty(),
  body("password", "Password can't be blank").notEmpty(),
  body("email").custom(isUniqueEmail),
  async (req, res) => {
    const {name, email, password} = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render("users/new", {
        user: {
          name,
          email,
          password,
        },
        errors: errors.array(),
      });
    }
    const hashPassword = await new HashPassword().generate(password);
    const user = new User(name, email, hashPassword);
    await user.save();

    req.authentication?.login(user);
    req.dialogMessage?.setMessage("You have signed up successfully");
    res.redirect(`/users/${user.id}`);
  },
);

/** A page to show user details */
userRouter.get("/:userId", ensureAuthUser, async (req, res, next) => {
  const {userId} = req.params;
  const user = await User.find(Number(userId));
  if (!user) return next(new Error("Invalid error: The user is undefined."));
  const posts = await user.posts();
  const postsWithUser = await Promise.all(
    posts.map(async post => {
      const user = await post.user();
      return {
        ...post,
        user,
      };
    }),
  );
  res.render("users/show", {
    user,
    posts: postsWithUser,
    activeTab: "posts",
  });
});

/** A page to list all tweets liked by a user */
userRouter.get("/:userId/likes", ensureAuthUser, async (req, res, next) => {
  const {userId} = req.params;
  const user = await User.find(Number(userId));
  if (!user) return next(new Error("Invalid error: The user is undefined."));
  const posts = await user.likedPosts();
  const postsWithUser = await Promise.all(
    posts.map(async post => {
      const user = await post.user();
      return {
        ...post,
        user,
      };
    }),
  );
  res.render("users/show", {
    user,
    posts: postsWithUser,
    activeTab: "likes",
  });
});

/** A page to edit a user */
userRouter.get(
  "/:userId/edit",
  ensureAuthUser,
  ensureCorrectUser,
  async (req, res) => {
    const {userId} = req.params;
    const user = await User.find(Number(userId));
    res.render("users/edit", {
      user,
      errors: [],
    });
  },
);

const storage = multer.diskStorage({
  destination: join("public", "image", "users"),
  filename: (req, file, cb) => {
    const outFileName = `${nanoid()}.${file.mimetype.split("/")[1]}`;
    cb(null, outFileName);
  },
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const ACCEPTABLE_SUBTYPES = ["png", "jpeg"] as const;
    type AcceptableSubtype = (typeof ACCEPTABLE_SUBTYPES)[number];
    const toAcceptableImageMediaType = (
      fullMimeType: string,
    ): ["image", AcceptableSubtype] | null => {
      const isAcceptableSubtype = (
        subtype: string,
      ): subtype is AcceptableSubtype => {
        return (ACCEPTABLE_SUBTYPES as readonly string[]).includes(subtype);
      };
      const [mediaType, mediaSubtype] = fullMimeType.split("/");
      if (!mediaType || !mediaSubtype) return null;
      if (mediaType !== "image") return null;
      if (!isAcceptableSubtype(mediaSubtype)) return null;
      return ["image", mediaSubtype];
    };
    const mediaType = toAcceptableImageMediaType(file.mimetype);
    if (mediaType === null)
      return cb(
        new Error("Only image files in png or jpeg format can be uploaded"),
      );
    cb(null, true);
  },
});

const uploadHandler: RequestHandler = (req, res, next) => {
  const name = "image";
  upload.single(name)(req, res, err => {
    if (err instanceof Error) {
      req.uploadError = {
        type: "field",
        path: name,
        msg: err.message,
        location: "body",
        value: req.file,
      };
    }
    next();
  });
};
/** An endpoint to update a user */
userRouter.patch(
  "/:userId",
  ensureAuthUser,
  ensureCorrectUser,
  uploadHandler,
  body("name", "Name can't be blank").notEmpty(),
  body("email", "Email can't be blank").notEmpty(),
  async (req, res, next) => {
    const {userId} = req.params;
    const {name, email} = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty() || req.uploadError) {
      const validationErrors = errors.array();
      if (req.uploadError) {
        validationErrors.push(req.uploadError);
      }
      return res.render("users/edit", {
        user: {
          id: userId,
          name,
          email,
        },
        errors: validationErrors,
      });
    }

    const user = await User.find(Number(userId));
    if (!user) return next(new Error("Invalid error: The user is undefined."));
    Object.assign(user, {name, email});
    if (req.file) {
      user.imageName = req.file.path.replace("public", "");
    } else {
      console.log("no file");
    }

    await user.update();
    req.dialogMessage?.setMessage("Your account has been updated successfully");
    res.redirect(`/users/${user.id}`);
  },
);
