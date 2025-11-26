import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthDeveloperGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const token = this.extractTokenFromHeader(request);

        if (!token) {
            throw new UnauthorizedException('Token no encontrado');
        }

        try {
            const payload = await this.jwtService.verifyAsync(token);

            if (payload.role !== 'developer') {
                return false;
            }

            request['user'] = payload;

            return true;
        } catch (error) {
            throw new UnauthorizedException();
        }
    }

    private extractTokenFromHeader(request: any): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}