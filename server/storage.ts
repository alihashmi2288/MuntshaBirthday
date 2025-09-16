import { type User, type InsertUser } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private usernameIndex: Map<string, string>;

  constructor() {
    this.users = new Map();
    this.usernameIndex = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const userId = this.usernameIndex.get(username);
    return userId ? this.users.get(userId) : undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    if (this.usernameIndex.has(insertUser.username)) {
      throw new Error(`Username '${insertUser.username}' already exists`);
    }
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    this.usernameIndex.set(user.username, id);
    return user;
  }
}

export const storage = new MemStorage();
