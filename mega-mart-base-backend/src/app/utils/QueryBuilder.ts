import mongoose, { Query } from 'mongoose';

export class QueryBuilder<T> {
  public modelQuery: Query<T[], T>;
  public readonly query: Record<string, string>;

  constructor(modelQuery: Query<T[], T>, query: Record<string, string>) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchableFields: string[]): this {
    const searchTerm = this.query.searchTerm;

    if (searchTerm && typeof searchTerm === 'string') {
      const searchConditions = searchableFields.map(field => {
        if (field === '_id' && mongoose.Types.ObjectId.isValid(searchTerm)) {
          return { [field]: new mongoose.Types.ObjectId(searchTerm) };
        } else {
          return { [field]: { $regex: new RegExp(searchTerm, 'i') } };
        }
      });

      this.modelQuery = this.modelQuery.find({ $or: searchConditions });
    }

    return this;
  }

  filter(): this {
    const filter = { ...this.query };
    const excludeFields = ['searchTerm', 'sort', 'limit', 'page', 'fields'];

    for (const field of excludeFields) {
      delete filter[field];
    }

    if (filter.status) {
      this.modelQuery = this.modelQuery.find({
        'orderInfo.status': filter.status,
      });
      delete filter.status;
    }

    if(filter.vendorOrderId){
      this.modelQuery = this.modelQuery.find({
        'orderInfo.vendorId': filter.vendorOrderId,
      });
      delete filter.vendorOrderId;
    }
    

    if (Object.keys(filter).length) {
      this.modelQuery = this.modelQuery.find(filter);
    }

    return this;
  }

  sort(): this {
    const sort = this.query.sort || '-createdAt';

    this.modelQuery = this.modelQuery.sort(sort);

    return this;
  }
  fields(): this {
    const fields = this.query.fields?.split(',').join(' ') || '';

    this.modelQuery = this.modelQuery.select(fields);

    return this;
  }

  paginate(): this {
    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;
    const skip = (page - 1) * limit;

    this.modelQuery = this.modelQuery.skip(skip).limit(limit);

    return this;
  }

  build() {
    return this.modelQuery;
  }

  async getMeta() {
    const filter = this.modelQuery.getFilter();

    const totalDocuments = await this.modelQuery.model.countDocuments(filter);

    const page = Number(this.query.page) || 1;
    const limit = Number(this.query.limit) || 10;

    const totalPage = Math.ceil(totalDocuments / limit);

    return { page, limit, total: totalDocuments, totalPage };
  }
}
