{/*import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true},
    price: { type: Number, required: true},
    description: { type: String, required: true },
    images: { type: [String], required: true },
    category: { type: String, required: true },
    subCategory: { type: String, required: true },
    sizes: { type: Array, required: true },
    bestseller : { type: Boolean},
    date: { type: Number, required: true }
})

const productModel =mongoose.models.product || mongoose.model("product", productSchema);

export default productModel; */}
//--------------------------------------------------------------------------------//
import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: [100, 'Product name cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Product description is required'],
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    price: {
        type: Number,
        required: [true, 'Product price is required'],
        min: [0, 'Price cannot be negative']
    },
    images: {
        type: [String],
        required: [true, 'At least one image is required'],
        validate: {
            validator: function(images) {
                return images && images.length > 0;
            },
            message: 'At least one image is required'
        }
    },
    category: {
        type: String,
        required: [true, 'Product category is required'],
        trim: true
    },
    subCategory: {
        type: String,
        default: '',
        trim: true
    },
    sizes: {
        type: [String],
        default: []
    },
    date: {
        type: Number,
        default: Date.now
    },
    bestseller: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Add indexes for better performance
productSchema.index({ name: 1 });
productSchema.index({ category: 1 });
productSchema.index({ bestseller: 1 });

// Debug middleware
productSchema.pre('save', function(next) {
    console.log('Pre-save middleware: Validating product:', this.name);
    next();
});

productSchema.post('save', function(doc, next) {
    console.log('Post-save middleware: Product saved with ID:', doc._id);
    next();
});

const productModel = mongoose.model('Product', productSchema);

export default productModel;