// src/middlewares/strip-role-type.ts
export default () => {
  return async (ctx: any, next: () => Promise<void>) => {
    await next();
  };
};