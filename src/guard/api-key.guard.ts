import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
  constructor() {}

  checkArgs(method: string, url: string) {
    return method === "GET" && url.includes("/customer/");
  }

  canActivate(context: ExecutionContext): boolean {
    const { method, url } = context.getArgs()[0];
    if (this.checkArgs(method, url)) return true;
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers["api-key"];
    return apiKey === "695315ba-0b60-45e4-b70a-2d52698f459c";
  }
}
