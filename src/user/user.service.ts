import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';

import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(@InjectModel(User) private readonly users: typeof User) {}
}
