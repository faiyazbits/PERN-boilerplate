import type { HydratedDocument, Schema } from 'mongoose';

const deleteAtPath = (obj: Record<string, unknown>, path: string[], index: number) => {
  if (index === path.length - 1) {
    delete obj[path[index]];
    return;
  }
  const nextObj = obj[path[index]];
  if (nextObj && typeof nextObj === 'object') {
    deleteAtPath(nextObj as Record<string, unknown>, path, index + 1);
  }
};

const toJSON = (schema: Schema) => {
  let transform: ((doc: any, ret: any, options?: any) => any) | undefined;
  if (schema.options.toJSON && (schema.options.toJSON as any).transform) {
    transform = (schema.options.toJSON as any).transform;
  }

  schema.options.toJSON = Object.assign(schema.options.toJSON || {}, {
    transform(doc: HydratedDocument<any>, ret: Record<string, unknown>, options?: any) {
      Object.keys(schema.paths).forEach((path) => {
        const pathOptions = schema.paths[path]?.options;
        if (pathOptions && (pathOptions as any).private) {
          deleteAtPath(ret, path.split('.'), 0);
        }
      });

      ret.id = (ret._id as any)?.toString();
      delete ret._id;
      delete ret.__v;
      delete ret.createdAt;
      delete ret.updatedAt;
      if (transform) {
        return transform(doc, ret, options);
      }
    },
  });
};

export { toJSON };
