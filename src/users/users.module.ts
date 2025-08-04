import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { ConnectionsModule } from 'src/connections/connections.module';
import { IamModule } from 'src/iam/iam.module';
import { User, UserSchema } from './entities/user.entity';
import { UsersService } from './services/users.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
    }),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    IamModule,
    ConnectionsModule,
  ],
  controllers: [],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
