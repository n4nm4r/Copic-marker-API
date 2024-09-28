import express from 'express';
import copicRouter from './routes/copics.js';
app.use('/api/contacts', copicRouter);


const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// app.get('/', (req, res) => {
//   res.send('Hello Express!');
// });

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
