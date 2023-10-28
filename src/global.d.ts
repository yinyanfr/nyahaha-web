interface User {
  uid: string;
  auth_date: string;
  hash: string;
  id?: string;
  role: string;
  first_name: string;
}

interface LoginQuery {
  id: string;
  auth_date: string;
  hash: string;
}

interface UserData {
  balance: number;
}

interface CGSSCard {
  title: string;
  name_only: string;
  rarity: {
    rarity: number;
  };
}

interface Song {
  id: string;
  title: string;
  youtubeId: string;
  tags: string[];
  updatedAt?: {
    toDate: () => Date;
  };
}
