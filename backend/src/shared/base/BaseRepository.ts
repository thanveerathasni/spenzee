import { Model, Document } from "mongoose";

export abstract class BaseRepository<T extends Document> {
  protected readonly model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async findOne(filter: Record<string, unknown>): Promise<T | null> {
    return this.model.findOne(filter).exec();
  }

  async create(data: Partial<T>): Promise<T> {
    const doc = new this.model(data);
    return doc.save();
  }

  async update(
    filter: Record<string, unknown>,
    update: Record<string, unknown>
  ): Promise<T | null> {
    return this.model
      .findOneAndUpdate(filter, update, { new: true })
      .exec();
  }

  async delete(filter: Record<string, unknown>): Promise<void> {
    await this.model.deleteOne(filter).exec();
  }
}