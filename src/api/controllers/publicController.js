import { users } from '@clerk/clerk-sdk-node';
import { Attempt } from '../../models/Attempted.js';
import { Quiz } from '../../models/Quiz.js';
import { catchAsync } from '../../utils/catchAsync.js';

export const getStat = catchAsync(async (req, res, next) => {
	const quizesCount = await Quiz.count({});
	const attemptsCount = await Attempt.count({});
	const noOfUsers = await users.getUserList({ limit: 100 });
	// const teacher = await users.getUserList({ role:'teacher' });
	const teacher = await users.getUserList({limit:100});

	const result = {
		users: '',
		timesQuizesPlayed: '',
		quizes: '',
		teacher :'',
		student:''
	};

	if (noOfUsers) {
		result.users = noOfUsers.length;
	}
	if (teacher) {
		const userRole = teacher.map(item => {
		  return item.publicMetadata.role
		});
        function checkTeacher(role) {
			return role === 'teacher'
		}
		function checkStudent(role) {
			return role === 'student'
		}
		result.teacher = userRole.filter(checkTeacher).length;
		result.student = userRole.filter(checkStudent).length;
  
	}

	if (attemptsCount) {
		result.timesQuizesPlayed = attemptsCount;
	}

	if (quizesCount) {
		result.quizes = quizesCount;
	}

	return res.status(200).json({
		status: 'success',
		...result
	});
});
