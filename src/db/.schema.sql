BEGIN;
CREATE TABLE IF NOT EXISTS "users" ("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "email" varchar NOT NULL UNIQUE, "image_name" varchar NOT NULL, "password" varchar NOT NULL, "created_at" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE IF NOT EXISTS "posts" ("id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "content" varchar NOT NULL, "user_id" integer NOT NULL, "created_at" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, "updated_at" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE);
CREATE TABLE IF NOT EXISTS "likes" ("user_id" integer NOT NULL, "post_id" integer NOT NULL, "created_at" datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, UNIQUE(user_id, post_id), FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE);
COMMIT;
