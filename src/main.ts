import { HttpAdapter } from './core/http';

(() => {
  console.log('Hello World!'); // Display the string.
  const httpAdapter = new HttpAdapter();
  httpAdapter.initHttpServer({});
  httpAdapter.get('/', (req, res) => {
    res.send('Hello world!');
  });
  httpAdapter.listen(3002);
})();
