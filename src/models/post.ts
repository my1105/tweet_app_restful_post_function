import {databaseManager} from "@/db";
import {
  serializeToSQLiteDateTimeString,
  deserializeFromSQLiteDateTimeString,
} from "@/lib/convert_date";
import {User} from "@/models/user";
import {Like} from "@/models/like";

export interface PostRawData {
  content: string;
  user_id: number;
  created_at: string;
  updated_at: string;
}

export interface PostRawDataWithId extends PostRawData {
  id: number;
}

export class Post {
  public id?: number;

  static fromRawData(data: PostRawData): Post {
    return new Post(
      data.content,
      data.user_id,
      deserializeFromSQLiteDateTimeString(data.created_at),
      deserializeFromSQLiteDateTimeString(data.updated_at),
    );
  }

  static fromRawDataWithId(data: PostRawDataWithId): Post {
    const post = Post.fromRawData(data);
    post.id = data.id;
    return post;
  }

  constructor(
    public content: string,
    public userId: number,
    public createdAt?: Date,
    public updatedAt?: Date,
  ) {}

  async save(): Promise<void> {
    // Populate the datetime fields before insert so that we don't have to run
    // additional SELECT query to know `created_at` and `updated_at` fields.
    const now = new Date();
    this.createdAt = this.createdAt ?? now;
    this.updatedAt = this.updatedAt ?? now;

    const db = await databaseManager.getInstance();
    const {lastID} = await db.run(
      `INSERT INTO posts (content, user_id, created_at, updated_at)
         VALUES ($content, $userId, $createdAt, $updatedAt)`,
      {
        $content: this.content,
        $userId: this.userId,
        $createdAt: serializeToSQLiteDateTimeString(this.createdAt),
        $updatedAt: serializeToSQLiteDateTimeString(this.updatedAt),
      },
    );
    this.id = lastID;
  }

  async update(): Promise<void> {
    // Populate the datetime field before insert so that we don't have to run
    // additional SELECT query to know `updated_at`.
    this.updatedAt = new Date();

    const db = await databaseManager.getInstance();
    await db.run(
      "UPDATE posts SET content=$content, updated_at=$updatedAt WHERE id=$id",
      {
        $content: this.content,
        $updatedAt: serializeToSQLiteDateTimeString(this.updatedAt),
        $id: this.id,
      },
    );
  }

  async delete(): Promise<void> {
    const db = await databaseManager.getInstance();
    await db.run("DELETE FROM posts WHERE id=?", [this.id]);
  }

  async hasLikedCount(): Promise<number | undefined> {
    if (!this.id) {
      throw new Error("Invalid error: The post id is not set.");
    }
    return Like.countOfPost(this.id);
  }

  async user(): Promise<User | undefined> {
    return User.find(this.userId);
  }

  static async all(): Promise<Post[]> {
    const db = await databaseManager.getInstance();
    const postRowDataList = await db.all<PostRawDataWithId[]>(
      "SELECT p.id, p.content, p.user_id, p.created_at, p.updated_at FROM posts p ORDER BY p.created_at desc",
    );
    return postRowDataList.map(postRowData =>
      Post.fromRawDataWithId(postRowData),
    );
  }

  static async allByUser(userId: number): Promise<Post[]> {
    const db = await databaseManager.getInstance();
    const postRowDataList = await db.all<PostRawDataWithId[]>(
      "SELECT p.id, p.content, p.user_id, p.created_at, p.updated_at FROM posts p WHERE p.user_id=? ORDER BY p.created_at desc",
      [userId],
    );
    return postRowDataList.map(postRowData =>
      Post.fromRawDataWithId(postRowData),
    );
  }

  static async likedByUser(userId: number): Promise<Post[]> {
    const db = await databaseManager.getInstance();
    const postRowDataList = await db.all<PostRawDataWithId[]>(
      "SELECT p.id, p.content, p.user_id, p.created_at, p.updated_at FROM likes l INNER JOIN posts p ON l.post_id=p.id WHERE l.user_id=? ORDER BY p.created_at desc",
      [userId],
    );
    return postRowDataList.map(postRowData =>
      Post.fromRawDataWithId(postRowData),
    );
  }

  static async find(postId: number): Promise<Post | undefined> {
    const db = await databaseManager.getInstance();
    const postRowData = await db.get<PostRawDataWithId>(
      "SELECT p.id, p.content, p.user_id, p.created_at, p.updated_at FROM posts p WHERE p.id=?",
      [postId],
    );
    return postRowData && Post.fromRawDataWithId(postRowData);
  }
}
