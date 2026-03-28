export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
}

export type CommissionStatus = 'PENDING' | 'ACCEPTED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Commission {
  id: string;
  artistId: string;
  clientId: string;
  title: string;
  description: string;
  price: number;
  status: CommissionStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ArtPiece {
  id: string;
  artistId: string;
  title: string;
  description?: string;
  imageUrl: string;
  createdAt: string;
}
