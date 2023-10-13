interface User {
  uid: string;
  auth_date: string;
  hash: string;
  id?: string;
  role: string;
}

interface LoginQuery {
  id: string;
  auth_date: string;
  hash: string;
}

interface UserData {
  balance: number;
}
