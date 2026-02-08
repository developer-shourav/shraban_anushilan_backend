import { TUserName } from '../modules/students/student.interface';

export const uniqueImageNameGenerator = (userName: TUserName) => {
  // -------- Generate a unique username
  let fullName = '';
  const firstName = userName?.firstName;
  const middleName = userName?.middleName;
  const lastName = userName?.lastName;

  if (firstName && middleName && lastName) {
    fullName = `${firstName}_${middleName}_${lastName}`;
  } else if (firstName && lastName) {
    fullName = `${firstName}_${lastName}`;
  } else {
    fullName = firstName;
  }

  // --------Final image name
  const imageName = `${fullName}-profile-image`;
  return { imageName };
};
