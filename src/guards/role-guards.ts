import { CanActivate, ExecutionContext, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { roleEnum } from 'src/config/enums';
import { errorMessage } from 'utils/response';


@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const { user } = context.switchToHttp().getRequest();
    if(user.role === roleEnum.superAdmin){
      return true;
    }
    if(!requiredRoles.includes(user.role)){
      errorMessage('You do not have permission to access this resource.','Invalid Role',HttpStatus.FORBIDDEN);
    }
    return true;
  }
}
