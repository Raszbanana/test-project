import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    ) {}

  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password);
    
    try {
      const user = await this.prisma.user.create({
        data: {
          email: 'test@mail.com',
          hash,
        },
      });
      delete user.hash;
      return this.signToken(user.id, user.email);

    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }
  }

  async signin(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user)
     throw new ForbiddenException(
       'Credentials incorrect'
       );

    const pwMatches = await argon.verify(
      user.hash, dto.password
      );

    if (!pwMatches)
     throw new ForbiddenException(
       'Credentials incorrect'
       );
       
    delete user.hash;
    return this.signToken(user.id, user.email);
  }

  signToken(
    userId: number,
    email: string
    ): Promise<string> {
      const payload = {
        sub: userId,
        email
      }

      return this.jwt.signAsync(payload, {
        expiresIn: '15m',
        secret: process.env.JWT_SECRET
      })
      }
}   