import mongoose from 'mongoose'

const category = mongoose.Schema(
    {
      category:{
        type: "php",
        required : [true, "category must required"]
      },
      quest:{
        type: mongoose.Schema.Types.ObjectId,
        required:true
      },
      author:{
        type: String,
        required:true
      }
    },
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
		timestamps: true
	}
);
export const Category = mongoose.model('Category', category);