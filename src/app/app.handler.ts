import { AppService } from './app.service';

export class AppHandler {
  constructor(private readonly appService: AppService) {}

  handle(req: any, res: any) {
    const { name = 'World' } = req.query;
    res.send(this.appService.sayHello(name as string));
  }
}
