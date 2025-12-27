import {databaseManager} from "@/db";
import {
  serializeToSQLiteDateTimeString,
  deserializeFromSQLiteDateTimeString,
} from "@/lib/convert_date";
import {Post} from "./post";

export interface LikeRawData {
  user_id: number;
  post_id: number;
  created_at: string;
}

export class Like {
  static fromRawData(data: LikeRawData): Like {
    return new Like(
      data.user_id,
      data.post_id,
      deserializeFromSQLiteDateTimeString(data.created_at),
    );
  }

  constructor(
    readonly userId: number,
    readonly postId: number,
    public createdAt?: Date,
  ) {}

  async save(): Promise<void> {
    // Populate the datetime field before insert so that we don't have to run
    // additional SELECT query to know `created_at` field.
    const now = new Date();
    this.createdAt = this.createdAt ?? now;

    const db = await databaseManager.getInstance();
    await db.run(
      "INSERT INTO likes (user_id, post_id, created_at) VALUES ($userId, $postId, $createdAt)",
      {
        $userId: this.userId,
        $postId: this.postId,
        $createdAt: serializeToSQLiteDateTimeString(this.createdAt),
      },
    );
  }

  async delete(): Promise<void> {
    const db = await databaseManager.getInstance();
    await db.run(
      "DELETE FROM likes WHERE user_id=$userId AND post_id=$postId",
      {
        $userId: this.userId,
        $postId: this.postId,
      },
    );
  }

  async post(): Promise<Post> {
    const post = await Post.find(this.postId);
    if (!post) {
      throw new Error("not exist post");
    }
    return post;
  }

  static async find(userId: number, postId: number): Promise<Like | undefined> {
    const db = await databaseManager.getInstance();
    const likeRowData = await db.get<LikeRawData>(
      "SELECT l.user_id, l.post_id, l.created_at FROM likes l WHERE l.user_id=$userId AND l.post_id=$postId",
      {$userId: userId, $postId: postId},
    );
    return likeRowData && Like.fromRawData(likeRowData);
  }

  static async countOfPost(postId: number): Promise<number | undefined> {
    const db = await databaseManager.getInstance();
    const likeRowData = await db.get<{count: number}>(
      "SELECT COUNT(*) as count FROM likes l WHERE l.post_id=$postId",
      {$postId: postId},
    );
    return likeRowData && likeRowData.count;
  }

  static async isExistByUser(
    userId: number,
    postId: number,
  ): Promise<boolean | undefined> {
    const db = await databaseManager.getInstance();
    const likeRowData = await db.get<{count: number}>(
      "SELECT COUNT(*) as count FROM likes l WHERE l.post_id=$postId AND l.user_id=$userId",
      {$postId: postId, $userId: userId},
    );
    return likeRowData && likeRowData.count !== 0;
  }
}
