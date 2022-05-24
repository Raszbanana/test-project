import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express'
import { JwtGuard } from 'src/auth/guard';
import { GetUser } from '../auth/decorator/index'
@Controller('users')
export class UserController {
    @UseGuards(JwtGuard)
    @Get('me')
    getMe(@GetUser() req: Request) {
        return req.user;
    }
}
