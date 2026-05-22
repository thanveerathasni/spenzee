import {
  Document,
  Model,
  QueryFilter,
  QueryOptions,
  UpdateQuery,
} from "mongoose";

interface PaginationOptions {
  page?: number;

  limit?: number;

  sort?: Record<
    string,
    1 | -1
  >;
}

interface PaginatedResult<T> {
  data: T[];

  total: number;

  page: number;

  limit: number;

  totalPages: number;
}

export abstract class BaseRepository<
  T extends Document,
> {
  protected readonly model: Model<T>;

  constructor(
    model: Model<T>,
  ) {
    this.model = model;
  }

  /* ====================================================== */
  /* FIND BY ID */
  /* ====================================================== */

  async findById(
    id: string,
  ): Promise<T | null> {
    return this.model
      .findById(id)
      .exec();
  }

  /* ====================================================== */
  /* FIND ONE */
  /* ====================================================== */

  async findOne(
    filter: QueryFilter<T>,
  ): Promise<T | null> {
    return this.model
      .findOne(filter)
      .exec();
  }

  /* ====================================================== */
  /* FIND MANY */
  /* ====================================================== */

  async findMany(
    filter: QueryFilter<T> = {},
  ): Promise<T[]> {
    return this.model
      .find(filter)
      .exec();
  }

  /* ====================================================== */
  /* CREATE */
  /* ====================================================== */

  async create(
    data: Partial<T>,
  ): Promise<T> {
    const document =
      new this.model(data);

    return document.save();
  }

  /* ====================================================== */
  /* UPDATE ONE */
  /* ====================================================== */

  async updateOne(
    filter: QueryFilter<T>,
    update: UpdateQuery<T>,
    options: QueryOptions = {
      new: true,
    },
  ): Promise<T | null> {
    const updated =
      await this.model
      .findOneAndUpdate(
        filter,
        update,
        options,
      )
      .exec();

    return updated as T | null;
  }

  /* ====================================================== */
  /* DELETE ONE */
  /* ====================================================== */

  async deleteOne(
    filter: QueryFilter<T>,
  ): Promise<void> {
    await this.model
      .deleteOne(filter)
      .exec();
  }

  /* ====================================================== */
  /* DELETE MANY */
  /* ====================================================== */

  async deleteMany(
    filter: QueryFilter<T>,
  ): Promise<void> {
    await this.model
      .deleteMany(filter)
      .exec();
  }

  /* ====================================================== */
  /* EXISTS */
  /* ====================================================== */

  async exists(
    filter: QueryFilter<T>,
  ): Promise<boolean> {
    const exists =
      await this.model.exists(
        filter,
      );

    return Boolean(exists);
  }

  /* ====================================================== */
  /* COUNT */
  /* ====================================================== */

  async count(
    filter: QueryFilter<T> = {},
  ): Promise<number> {
    return this.model.countDocuments(
      filter,
    );
  }

  /* ====================================================== */
  /* PAGINATION */
  /* ====================================================== */

  async paginate(
    filter: QueryFilter<T> = {},
    options: PaginationOptions = {},
  ): Promise<
    PaginatedResult<T>
  > {
    const page =
      options.page ?? 1;

    const limit =
      options.limit ?? 10;

    const skip =
      (page - 1) * limit;

    const sort =
      options.sort ?? {
        createdAt: -1,
      };

    const [data, total] =
      await Promise.all([
        this.model
          .find(filter)
          .sort(sort)
          .skip(skip)
          .limit(limit)
          .exec(),

        this.model.countDocuments(
          filter,
        ),
      ]);

    return {
      data,

      total,

      page,

      limit,

      totalPages:
        Math.ceil(
          total / limit,
        ),
    };
  }
}
