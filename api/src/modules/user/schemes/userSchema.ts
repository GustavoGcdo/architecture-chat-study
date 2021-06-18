interface UserSchema {
  id?: number;
  emailChecked: boolean;
  completeName: string;
  displayName?: string;
  email: string;
  password: string;
  userName: string;
  birthDate: Date;
  createdAt: Date;
  updatedAt?: Date;
  createdBy?: number;
  updatedBy?: number;
}

export default UserSchema;
