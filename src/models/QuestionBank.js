import mongoose from 'mongoose';

const questionSchema = mongoose.Schema(
	{
		category:{ 
			type: String,
		},
		title: {
			type: String,
			required: [true, 'Question title required']
		},
		correct: {
			type: String,
			required: [true, 'Correct option required']
		},
		options: {
			type: [{ value: String }],
			validate: [arrayLimit, '{PATH} length should only be 4']
		},
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
		timestamps: true
	}
);

export const QuestionBank = mongoose.models.QuestionBank || mongoose.model('QuestionBank', questionSchema);

// https://stackoverflow.com/questions/28514790/how-to-set-limit-for-array-size-in-mongoose-schema
function arrayLimit(val) {
	return val.length === 4;
}
