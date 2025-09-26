import { Model } from "mongoose";

export const bulkUpsert = async (model: Model<any>, docs: any[], idField: string) => {
  if (!docs.length) return;
  const ops = docs.map(doc => ({
    updateOne: {
      filter: { [idField]: doc[idField] },
      update: { $set: doc },
      upsert: true
    }
  }));
  const chunkSize = 500;
  for (let i = 0; i < ops.length; i += chunkSize) {
    const chunk = ops.slice(i, i + chunkSize);
    await model.bulkWrite(chunk);
  }
};