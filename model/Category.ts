import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
    category: string;
}

const CategorySchema: Schema = new Schema({
    title: { type: String, required: true, unique: true },
  });
  
  // Export the model and return your IUser interface
  export default mongoose.model<ICategory>('Category', CategorySchema);