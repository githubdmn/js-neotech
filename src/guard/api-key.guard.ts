import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const apiKey = request.headers["api-key"];

    return apiKey === "secret";
  }
}
