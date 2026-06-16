export interface User {
  id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
}

export type CommissionStatus = 'REQUESTED' | 'IN_PROGRESS' | 'REVIEW' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED' | 'PAID';

export interface Commission {
  id: string;
  title: string;
  description: string;
  status: CommissionStatus;
  total_price_cents: number;
  client_id: string;
  client_username: string;
  artist_id: string;
  artist_username: string;
  created_at: string;
  reference_image_urls?: string[];
  milestones?: CommissionMilestone[];
}

export interface CommissionSummary {
  id: string;
  title: string;
  status: string;
  client_username: string;
  artist_username: string;
  total_price_cents: number;
  created_at: string;
}

export interface CommissionMilestone {
  id: string;
  title: string;
  description?: string;
  status: string;
  order_index: number;
}

export interface CommissionCreateRequest {
  artist_id: string;
  title: string;
  description: string;
  reference_image_urls?: string[];
}

export interface ArtPiece {
  id: string;
  artistId: string;
  title: string;
  description?: string;
  imageUrl: string;
  createdAt: string;
}
