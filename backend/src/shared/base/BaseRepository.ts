import { Model, Document } from "mongoose";

export abstract class BaseRepository<T extends Document> {
  constructor(protected model: Model<T>) {}

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  async deleteById(id: string): Promise<void> {
    await this.model.findByIdAndDelete(id);
  }
}