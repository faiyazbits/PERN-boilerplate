import type { Schema } from 'mongoose';

export interface QueryResult {
  results: any[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

export interface PaginateOptions {
  sortBy?: string;
  populate?: string;
  limit?: number;
  page?: number;
}

interface PopulateObj {
  path: string;
  populate?: PopulateObj;
}

const paginate = (schema: Schema) => {
  schema.statics.paginate = async function (
    filter: Record<string, unknown>,
    options: PaginateOptions
  ): Promise<QueryResult> {
    let sort = '';
    if (options.sortBy) {
      const sortingCriteria: string[] = [];
      options.sortBy.split(',').forEach((sortOption) => {
        const [key, order] = sortOption.split(':');
        sortingCriteria.push((order === 'desc' ? '-' : '') + key);
      });
      sort = sortingCriteria.join(' ');
    } else {
      sort = 'createdAt';
    }

    const limit = options.limit && parseInt(String(options.limit), 10) > 0 ? parseInt(String(options.limit), 10) : 10;
    const page = options.page && parseInt(String(options.page), 10) > 0 ? parseInt(String(options.page), 10) : 1;
    const skip = (page - 1) * limit;

    const countPromise = this.countDocuments(filter).exec();
    let docsPromise = this.find(filter).sort(sort).skip(skip).limit(limit);

    if (options.populate) {
      options.populate.split(',').forEach((populateOption) => {
        const parts = populateOption.split('.').reverse();
        const populateObj = parts.reduce<PopulateObj>((a, b) => ({ path: b, populate: a }), {} as PopulateObj);
        docsPromise = docsPromise.populate(populateObj);
      });
    }

    docsPromise = docsPromise.exec();

    return Promise.all([countPromise, docsPromise]).then((values) => {
      const [totalResults, results] = values;
      const totalPages = Math.ceil(totalResults / limit);
      return {
        results,
        page,
        limit,
        totalPages,
        totalResults,
      };
    });
  };
};

export { paginate };
