import {databaseManager} from "@/db";
import {
  serializeToSQLiteDateTimeString,
  deserializeFromSQLiteDateTimeString,
} from "@/lib/convert_date";
import {Post} from "@/models/post";
import {Like} from "@/models/like";

export interface UserRawData {
  name: string;
  email: string;
  image_name: string;
  created_at: string;
  updated_at: string;
}

export interface UserRawDataWithId extends UserRawData {
  id: number;
}

export interface UserRawDataWithPassword extends UserRawDataWithId {
  password: string;
}

export class User {
  public id?: number;

  static fromRawData(data: UserRawData): User {
    return new User(
      data.name,
      data.email,
      undefined,
      data.image_name,
      deserializeFromSQLiteDateTimeString(data.created_at),
      deserializeFromSQLiteDateTimeString(data.updated_at),
    );
  }

  static fromRawDataWithId(data: UserRawDataWithId): User {
    const user = User.fromRawData(data);
    user.id = data.id;
    return user;
  }

  static fromRawDataWithPassword(data: UserRawDataWithPassword): User {
    const user = User.fromRawData(data);
    user.password = data.password;
    return user;
  }

  constructor(
    public name: string,
    public email: string,
    public password?: string,
    public imageName: string = "/image/users/default_user.jpg",
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
      `
        INSERT INTO users
          (name, email, password, image_name, created_at, updated_at)
        VALUES ($name, $email, $password, $imageName, $createdAt, $updatedAt)`,
      {
        $name: this.name,
        $email: this.email,
        $password: this.password,
        $imageName: this.imageName,
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
      "UPDATE users SET name=$name, email=$email, image_name=$imageName, updated_at=$updatedAt WHERE id=$id",
      {
        $name: this.name,
        $email: this.email,
        $imageName: this.imageName,
        $updatedAt: serializeToSQLiteDateTimeString(this.updatedAt),
        $id: this.id,
      },
    );
  }

  async posts(): Promise<Post[]> {
    if (!this.id) {
      throw new Error("Invalid error: The user id is not set.");
    }
    return Post.allByUser(this.id);
  }

  async likedPosts(): Promise<Post[]> {
    if (!this.id) {
      throw new Error("Invalid error: The user id is not set.");
    }
    return Post.likedByUser(this.id);
  }

  async hasLikedPost(postId: number): Promise<boolean | undefined> {
    if (!this.id) {
      throw new Error("Invalid error: The user id is not set.");
    }
    return Like.isExistByUser(this.id, postId);
  }

  static async all(): Promise<User[]> {
    const db = await databaseManager.getInstance();
    const userRawDataList = await db.all<UserRawDataWithId[]>(
      "SELECT u.id, u.name, u.email, u.image_name, u.created_at, u.updated_at FROM users u",
    );
    return userRawDataList.map(userRawData =>
      User.fromRawDataWithId(userRawData),
    );
  }

  static async find(userId: number): Promise<User | undefined> {
    const db = await databaseManager.getInstance();
    const userRawData = await db.get<UserRawDataWithId>(
      "SELECT u.id, u.name, u.email, u.image_name, u.created_at, u.updated_at FROM users u WHERE u.id=?",
      [userId],
    );
    return userRawData && User.fromRawDataWithId(userRawData);
  }

  static async findByEmail(email: string): Promise<User | undefined> {
    const db = await databaseManager.getInstance();
    const userRawData = await db.get<UserRawDataWithId>(
      "SELECT u.id, u.name, u.email, u.image_name, u.created_at, u.updated_at FROM users u WHERE u.email=?",
      [email],
    );
    return userRawData && User.fromRawDataWithId(userRawData);
  }

  static async findByEmailWithPassword(
    email: string,
  ): Promise<User | undefined> {
    const db = await databaseManager.getInstance();
    const userRawData = await db.get<UserRawDataWithPassword>(
      "SELECT u.id, u.name, u.email, u.password, u.image_name, u.created_at, u.updated_at FROM users u WHERE u.email=?",
      [email],
    );
    return userRawData && User.fromRawDataWithPassword(userRawData);
  }

  equal(user: User): boolean {
    return this.id === user.id;
  }
}
