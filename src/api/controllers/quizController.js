import { Attempt } from '../../models/Attempted.js';
import { Quiz } from '../../models/Quiz.js';
import { AppError } from '../../utils/AppError.js';
import { catchAsync } from '../../utils/catchAsync.js';
import { Generate } from '../../models/Generate.js'
import { Question } from '../../models/Question.js';
import { QuestionBank } from '../../models/QuestionBank.js';

// *********************   generate quiz
// export const letGenerate = catchAsync(async (req, res) => {
// 	const { title, description, quantity, tags, status, category } = await req.body;
// 	const author = req.user.id;
// 	const questionCategorize = await QuestionBank.find({ category: category })
// 	const newData = await Quiz({
// 		title,
// 		description,
// 		quantity,
// 		tags,
// 		status: status,
// 		author,
// 		category: questionCategorize.category,
// 	}); // remove Quiz and add Generate Model
// 	await newData.save();
// 	return res.status(200).json(newData)
// })


// export const getGenerate = catchAsync(async (req, res) => {
// 	const paginationSize = 6;

// 	const { loggedIn, search, tag, page, } = req.query;

// 	const filters = {
// 		deleted: { $ne: true }
// 	};
// 	if (loggedIn) {
// 		filters.author = req.user.id;
// 	} else if (search) {
// 		filters.title = {
// 			$regex: search,
// 			$options: 'i'
// 		};
// 	} else if (tag) {
// 		filters.tags = { $in: [tag] };
// 	} else {
// 		filters.status = 'draft';
// 	}
// 	const quizes = await Generate.find({ ...filters })
// 		.populate('questionsCount attemptsCount')
// 		.limit(paginationSize)
// 		.skip(paginationSize * ((page || 1) - 1))
// 		.sort('-createdAt');
// 	const count = await Generate.countDocuments({ ...filters });
// 	// console.log({ count, pageNo, skip: paginationSize * (page - 1) });
// 	return res.status(200).json({
// 		status: 'success',
// 		quizes,
// 		count
// 	});
// });


// ********************   generate quiz end


export const getAllQuizes = catchAsync(async (req, res) => {
	const paginationSize = 20;

	const { loggedIn, search, tag, page } = req.query;

	const filters = {
		deleted: { $ne: true }
	};
	if (loggedIn) {
		filters.author = req.user.id;
	} else if (search) {
		filters.title = {
			$regex: search,
			$options: 'i'
		};
	} else if (tag) {
		filters.tags = { $in: [tag] };
	} else {
		filters.status = 'active';
	}
	const quizes = await Quiz.find({ ...filters })
		.populate('questionsCount attemptsCount')
		.limit(paginationSize)
		.skip(paginationSize * ((page || 1) - 1))
		.sort('-createdAt');
	const count = await Quiz.countDocuments({ ...filters });
	// console.log({ count, pageNo, skip: paginationSize * (page - 1) });
	return res.status(200).json({
		status: 'success',
		quizes,
		count
	});
});

export const createQuiz = catchAsync(async (req, res, next) => {
	const { title, description, tags, status, quantity, category, selectedOption} = req.body;
	const author = req.user.id;

	console.log({ title, description, category, selectedOption });
	if (!title || !description || !tags || !author || !quantity || !category || !selectedOption) {
		return next(new AppError('Please send Quiz title, description, tags, quantity, category, author ans selectedOption.', 400));
	}
	if (!Array.isArray(tags)) {
		return next(new AppError('Please send tags as array.', 400));
	}
	if (!(tags.length >= 1)) {
		return next(new AppError('Please send at least 1 tag in array.', 400));
	}

	if (selectedOption == "0") {
		console.log('you selected 0');
		const quiz = await Quiz.create({
			title,
			description,
			tags,
			author,
			status: status,
			quantity,
			category,
		});

		return res.status(200).json({
			status: 'success',
			quiz: quiz
		});
	}

	if (selectedOption == "1") {
		console.log('you selected 1');
		const newData = await Quiz({
			title,
			description,
			quantity,
			tags,
			status: status,
			author,
			category,
		});
		
		await newData.save(async (err, quiz) => {
			console.log(quiz._id);
			console.log(author);
			const categorize = await QuestionBank.find({ category: category }).limit(parseInt(quantity))
			categorize.map(i => {
				const quest = Question({
                   quiz:quiz._id,
				   category: i.category,
				   title: i.title,
				   correct: i.correct,
				   options: i.options,
				   author:author
				});
				quest.save();
			});

			
		});

		return res.status(200).json({
			status: 'success',
			quiz: newData
		})
	}




});

export const getQuiz = catchAsync(async (req, res, next) => {
	const { quizId } = req.params;

	const quiz = await Quiz.findById(quizId).populate('questionsCount');

	if (!quiz) {
		return next(new AppError('Quiz not found', 404));
	}

	return res.status(200).json({
		status: 'success',
		quiz: quiz
	});
});

export const updateQuiz = catchAsync(async (req, res, next) => {
	const { title, description, tags, status } = req.body;
	const { quizId } = req.params;
	const toUpdateData = {};

	if (title) {
		toUpdateData.title = title;
	}

	if (description) {
		toUpdateData.description = description;
	}

	if (tags) {
		if (!(tags.length >= 1)) return next(new AppError('Please send at least 1 tag.'), 400);
		toUpdateData.tags = tags;
	}

	if (status) {
		toUpdateData.status = status;
	}

	const updatedQuiz = await Quiz.findOneAndUpdate({ _id: quizId }, toUpdateData, {
		new: true,
		runValidators: true
	});

	return res.status(200).json({
		status: 'success',
		quiz: updatedQuiz
	});
});

export const deleteQuiz = catchAsync(async (req, res) => {
	const { quizId } = req.params;

	const attempts = await Attempt.findOne({ quiz: quizId });

	if (!attempts) {
		await Quiz.findOneAndDelete({ _id: quizId });
		return res.status(204).json({
			status: 'success'
		});
	}
	const quiz = await Quiz.findOneAndUpdate({ _id: quizId }, { deleted: true });

	if (!quiz) {
		throw new AppError("Quiz you are trying to delete doesn't exist.", 404);
	}

	return res.status(204).json({
		status: 'success'
	});
});
