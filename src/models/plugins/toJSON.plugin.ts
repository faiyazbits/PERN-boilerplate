import type { HydratedDocument, Schema } from 'mongoose';

const deleteAtPath = (obj: any, path: string[], index: number) => {
  if (index === path.length - 1) {
    delete obj[path[index]];
    return;
  }
  deleteAtPath(obj[path[index]], path, index + 1);
};

const toJSON = (schema: Schema) => {
  let transform: ((doc: any, ret: any, options?: any) => any) | undefined;
  if (schema.options.toJSON && (schema.options.toJSON as any).transform) {
    transform = (schema.options.toJSON as any).transform;
  }

  schema.options.toJSON = Object.assign(schema.options.toJSON || {}, {
    transform(doc: HydratedDocument<any>, ret: any, options?: any) {
      Object.keys(schema.paths).forEach((path) => {
        if (schema.paths[path].options && (schema.paths[path].options as any).private) {
          deleteAtPath(ret, path.split('.'), 0);
        }
      });

      ret.id = ret._id.toString();
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
