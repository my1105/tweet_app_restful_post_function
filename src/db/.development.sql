BEGIN;
-- users
INSERT INTO users (id, name, email, image_name, password, created_at, updated_at) VALUES(1,'Ken the Ninja','ninja@progate.com','/image/users/default_user.jpg','$2b$10$eWozvPlv.OwVm3TUeZifjOsu5ylPs1727cnR7AzmRsNe/DD2UOOtq','2021-04-18 08:06:52.739','2021-04-18 08:06:52.739');
INSERT INTO users (id, name, email, image_name, password, created_at, updated_at) VALUES(2,'Master Wooly','master@progate.com','/image/users/2.jpg','$2b$10$eWozvPlv.OwVm3TUeZifjOsu5ylPs1727cnR7AzmRsNe/DD2UOOtq','2021-04-23 11:41:53.913','2021-04-23 11:41:53.913');
INSERT INTO users (id, name, email, image_name, password, created_at, updated_at) VALUES(3,'Ben the Baby Ninja','baby@progate.com','/image/users/3.jpg','$2b$10$eWozvPlv.OwVm3TUeZifjOsu5ylPs1727cnR7AzmRsNe/DD2UOOtq','2021-04-23 11:43:49.518','2021-04-23 11:43:49.518');
INSERT INTO users (id, name, email, image_name, password, created_at, updated_at) VALUES(4,'Mike','mike@progate.com','/image/users/4.jpg','$2b$10$eWozvPlv.OwVm3TUeZifjOsu5ylPs1727cnR7AzmRsNe/DD2UOOtq','2021-04-23 11:44:06.890','2021-04-23 11:44:06.890');
INSERT INTO users (id, name, email, image_name, password, created_at, updated_at) VALUES(5,'Kate','kate@progate.com','/image/users/5.jpg','$2b$10$eWozvPlv.OwVm3TUeZifjOsu5ylPs1727cnR7AzmRsNe/DD2UOOtq','2021-04-23 11:44:18.073','2021-04-23 11:44:18.073');
-- posts
INSERT INTO posts (id, content, user_id, created_at, updated_at) VALUES(1,'Looking for a good book to read.',1,'2021-03-31 05:24:15.529','2021-03-31 05:24:15.529');
INSERT INTO posts (id, content, user_id, created_at, updated_at) VALUES(2,'Today''s lunch was great!',2,'2021-03-31 05:24:32.004','2021-03-31 05:24:32.004');
INSERT INTO posts (id, content, user_id, created_at, updated_at) VALUES(3,'Master Wooly taught me how to use Git! Now I can teach my little brother Ben.',1,'2021-03-31 06:00:32.004','2021-03-31 06:00:32.004');
INSERT INTO posts (id, content, user_id, created_at, updated_at) VALUES(4,'My brother Ken is studying so hard! Apparently he wants to become an engineer. Maybe I should also give it a shot.',3,'2021-04-15 07:24:32.004','2021-04-15 07:24:32.004');
INSERT INTO posts (id, content, user_id, created_at, updated_at) VALUES(5,'Learning to code on Progate. I just completed Rails/Study/3!',4,'2021-03-31 09:24:32.004','2021-03-31 09:24:32.004');
INSERT INTO posts (id, content, user_id, created_at, updated_at) VALUES(6,'I went to a programming workshop at Progate! Learned so much & got a really cute sticker :)',5,'2021-03-31 09:24:32.004','2021-03-31 09:24:32.004');
INSERT INTO posts (id, content, user_id, created_at, updated_at) VALUES(7,'Almost done with our TweetApp!',1,'2021-06-01 02:32:59.458','2021-06-01 02:32:59.458');
-- likes
INSERT INTO likes (user_id, post_id, created_at) VALUES(1,2,'2021-06-15 11:08:17.693');
INSERT INTO likes (user_id, post_id, created_at) VALUES(1,4,'2021-06-23 02:55:59.682');
INSERT INTO likes (user_id, post_id, created_at) VALUES(1,5,'2021-06-23 02:56:19.331');
INSERT INTO likes (user_id, post_id, created_at) VALUES(1,6,'2021-06-23 02:56:26.741');
INSERT INTO likes (user_id, post_id, created_at) VALUES(2,7,'2021-06-23 02:57:59.387');
INSERT INTO likes (user_id, post_id, created_at) VALUES(2,5,'2021-06-23 02:58:05.392');
INSERT INTO likes (user_id, post_id, created_at) VALUES(2,3,'2021-06-23 02:58:14.214');
INSERT INTO likes (user_id, post_id, created_at) VALUES(2,6,'2021-06-23 02:58:19.997');
INSERT INTO likes (user_id, post_id, created_at) VALUES(3,7,'2021-06-23 02:58:47.299');
INSERT INTO likes (user_id, post_id, created_at) VALUES(3,5,'2021-06-23 02:58:59.211');
INSERT INTO likes (user_id, post_id, created_at) VALUES(3,3,'2021-06-23 02:59:08.061');
INSERT INTO likes (user_id, post_id, created_at) VALUES(3,1,'2021-06-23 02:59:16.910');
INSERT INTO likes (user_id, post_id, created_at) VALUES(3,2,'2021-06-23 02:59:22.134');
INSERT INTO likes (user_id, post_id, created_at) VALUES(5,7,'2021-06-23 02:59:42.179');
INSERT INTO likes (user_id, post_id, created_at) VALUES(5,4,'2021-06-23 02:59:49.338');
INSERT INTO likes (user_id, post_id, created_at) VALUES(5,6,'2021-06-23 03:00:06.638');
INSERT INTO likes (user_id, post_id, created_at) VALUES(5,3,'2021-06-23 03:00:12.878');
INSERT INTO likes (user_id, post_id, created_at) VALUES(5,1,'2021-06-23 03:00:28.501');
INSERT INTO likes (user_id, post_id, created_at) VALUES(4,7,'2021-04-23 14:25:43.532');
COMMIT;
