import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import bodyParser from 'body-parser';
import routes from '@Helper/Routes';
import { mongodb } from '@Configs/Database';

const app = express();
const PORT = process.env.SERVER_PORT;
const router = express.Router();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

(async () => {
    await mongodb.testConnection();
})();

app.use('/v1', routes(router));
app.set('json spaces', 2);

app.get('/dynamic_store', (req: any, res: any) => {
    res.json({ message: "Welcome to Dynamic Store!!" });
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});