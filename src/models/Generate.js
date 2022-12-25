import mongoose from 'mongoose';

const quizSchema = mongoose.Schema(
	{

		// quiz id yahan dalni hogii title me
		title: {
			type: String,
			required: [true, 'Quiz title required']
		},
		description: {
			type: String,
			default: 'No Description'
		},
		quantity:{type:String,},
		category:[{type: String,}],
		tags: [
			{
				type: String,
				required: [true, 'Tags are required']
			}
		],
		
		status: {
			type: String,
			default: 'inactive',
			enum: ['draft', 'active', 'inactive']
		},
		deleted: {
			type: Boolean,
			default: false,
			select: false
		},
		author: {
			type: String,
			required: [true, 'A quiz needs an author.']
		}
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
		timestamps: true
	}
);



quizSchema.virtual('questions', {
	ref: 'Question',
	foreignField: 'quiz',
	localField: '_id'
});

// https://github.com/Automattic/mongoose/issues/7573#issuecomment-516440616
quizSchema.virtual('questionsCount', {
	ref: 'Question',
	foreignField: 'quiz',
	localField: '_id',
	count: true
});

quizSchema.virtual('attemptsCount', {
	ref: 'Attempt',
	foreignField: 'quiz',
	localField: '_id',
	count: true
});

// quizSchema.pre(/^find/, function (next) {
//     this.find({ deleted: { $ne: true } })
//     next()
// })

// export const Quiz = mongoose.models.Quiz || mongoose.model('Generate', quizSchema);
export const Generate = mongoose.model('Generate', quizSchema);
