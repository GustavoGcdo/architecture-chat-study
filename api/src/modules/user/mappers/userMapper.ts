import CreateUserDto from '../dtos/createUserDto';
import User from '../models/user';
import UserSchema from '../schemes/userSchema';

export abstract class UserMapper {
  public static modelToSchema(user: User): UserSchema {
    const mapped: UserSchema = {
      id: user.id,
      emailChecked: user.emailChecked || false,
      email: user.email,
      birthDate: user.birthDate,
      completeName: user.completeName,
      password: user.password,
      userName: user.userName,
      displayName: user.displayName,
      createdAt: user.createdAt || new Date(),
      updatedAt: user.updatedAt
    };

    return mapped;
  }

  public static schemaToModel(user: UserSchema): User {
    const mapped: UserSchema = {
      id: user.id,
      emailChecked: user.emailChecked,
      email: user.email,
      birthDate: user.birthDate,
      completeName: user.completeName,
      password: user.password,
      userName: user.userName,
      displayName: user.displayName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      createdBy: user.createdBy,
      updatedBy: user.updatedBy
    };

    return mapped;
  }

  public static createDtoToModel(user: CreateUserDto): User {
    const mapped: UserSchema = {
      emailChecked: false,
      email: user.email,
      birthDate: new Date(user.birthDate),
      completeName: user.completeName,
      password: user.password,
      userName: user.userName,
      displayName: user.displayName,
      createdAt: new Date()
    };

    return mapped;
  }
}
