import { useState } from 'react';

export default function UserModel() {
  const [user, setUser] = useState<User>();

  return { user, setUser };
}
