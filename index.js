import express from 'express'
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';

import userRoutes from './routes/users-routes.js'
import postRoutes from './routes/posts-routes.js'

// initialise express app
const app = express();

// bodyparser to parse requests
app.use(bodyParser.json({ limit: '30mb', extended: true }));
app.use(bodyParser.urlencoded({ limit: '30mb', extended: true }));

app.use(cors());

app.use('/users', userRoutes);
app.use('/posts', postRoutes);

// environment variables
const USERNAME = process.env.POSTR_USERNAME;
const PASSWORD = process.env.POSTR_PASSWORD;

const CONNECTION_URL = `mongodb+srv://${USERNAME}:${PASSWORD}@postr.aznsaak.mongodb.net/?retryWrites=true&w=majority`;
const PORT = process.env.PORT || 5000;

// mongoose to connect to MongoDB
// .then runs after successful connection, app listens to the port and runs callback function
mongoose
	.connect(CONNECTION_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() =>
		app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
	)
	.catch((error) => console.log(error.message));
