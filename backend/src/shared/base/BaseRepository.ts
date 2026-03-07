import { Model, Document, FilterQuery, UpdateQuery } from "mongoose";

export abstract class BaseRepository<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id);
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter);
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  async update(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>
  ): Promise<T | null> {
    return this.model.findOneAndUpdate(filter, update, { new: true });
  }

  async delete(filter: FilterQuery<T>): Promise<void> {
    await this.model.deleteOne(filter);
  }
}