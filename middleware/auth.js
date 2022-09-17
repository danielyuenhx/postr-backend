import jwt, { decode } from 'jsonwebtoken';

// continuously check if token authentication
// if a user likes a post, must pass through auth middleware 
// call next only if good to go
// next: do something, then move to the next thing
const auth = async (req, res, next) => {
	try {
		// get token from header, first item representing the token
		const token = req.headers.authorization.split(' ')[1];

		let decodedData;
		if (token) {
			decodedData = jwt.verify(token, 'test');
			req.userId = decodedData?.id;
		}
        next();
	} catch (error) {
		console.log(error);
	}
};

export default auth;