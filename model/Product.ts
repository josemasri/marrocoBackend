import mongoose, { Schema, Document } from 'mongoose';
import { ICategory } from './Category';

export interface IProduct extends Document {
    title: string;
    img: string;
    price: number;
    stock: number;
    description: string;
    active: boolean;
    category: ICategory['_id'];
}


const ProductSchema: Schema = new Schema({
    title: { type: String, required: true, unique: true },
    img: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    description: { type: String, required: true },
    active: {type: Boolean, default: true},
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true }
});

// Export the model and return your IUser interface
export default mongoose.model<IProduct>('Product', ProductSchema);