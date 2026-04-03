// --- 1. CORE & AUTHENTICATION ---
Table users {
id integer [primary key]
username varchar [unique]
email varchar [unique]
role varchar // 'artist', 'client', 'admin'
tier varchar [default: 'freemium'] // 'freemium', 'pro'
avatar_url varchar
bio text
stripe_customer_id varchar
created_at timestamp
}

Table user_social_accounts {
id integer [primary key]
user_id integer [ref: > users.id]
platform varchar // 'instagram', 'twitter', 'tiktok'
access_token varchar
refresh_token varchar
last_synced_at timestamp
}

// --- 2. THE SMART COMMISSION TIMELINE ---
Table commissions {
id integer [primary key]
client_id integer [ref: > users.id]
artist_id integer [ref: > users.id]
title varchar
total_price decimal
platform_fee decimal
status varchar // 'pending', 'active', 'completed', 'disputed'
revision_limit integer [default: 3]
revisions_used integer [default: 0]
created_at timestamp
}

Table milestones {
id integer [primary key]
commission_id integer [ref: > commissions.id]
title varchar // e.g., 'Sketch', 'Lineart', 'Final'
description text
order_index integer
status varchar // 'locked', 'in_progress', 'waiting_approval', 'approved'
watermarked_preview_url varchar
final_file_url varchar // Locked until payment/approval
}

// --- 3. TOURNAMENT ARENA (GROWTH ENGINE) ---
Table tournaments {
id integer [primary key]
title varchar
theme_description text
entry_fee decimal [default: 3.00]
prize_pool decimal
start_date timestamp
end_date timestamp
status varchar // 'open', 'ongoing', 'voting', 'finished'
}

Table tournament_entries {
id integer [primary key]
tournament_id integer [ref: > tournaments.id]
artist_id integer [ref: > users.id]
art_url varchar
process_proof_url varchar // For AI verification (timelapse/layers)
is_disqualified boolean [default: false]
rank integer
}

Table blind_votes {
id integer [primary key]
voter_id integer [ref: > users.id]
entry_id integer [ref: > tournament_entries.id]
created_at timestamp

Note: 'Ensures users vote without seeing artist identity'
}

// --- 4. SOCIAL ASSEMBLY & ANALYTICS ---
Table posts {
id integer [primary key]
user_id integer [ref: > users.id]
content_url varchar
caption text
scheduled_for timestamp
is_published boolean
}

Table social_analytics {
id integer [primary key]
post_id integer [ref: > posts.id]
platform varchar
views integer
clicks_to_commission integer // The "Conversion" metric
}

// --- 5. SYSTEMA DE PONTOS (CONCEPT) ---
Table loyalty_points {
id integer [primary key]
user_id integer [ref: > users.id]
points_balance integer [default: 0]
last_updated timestamp
}

Table point_history {
id integer [primary key]
user_id integer [ref: > users.id]
amount integer
reason varchar // 'tournament_win', 'commission_completed', 'referral'
created_at timestamp
}

// --- PORTFOLIO & STOREFRONT ---
/*
SQL IMPLEMENTATION:
CREATE TABLE art_pieces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  tags VARCHAR(255),
  is_for_sale BOOLEAN DEFAULT FALSE,
  price DECIMAL(10,2),
  currency VARCHAR(3) DEFAULT 'EUR',
  status VARCHAR(50) DEFAULT 'public',
  is_published BOOLEAN DEFAULT TRUE,
  commission_id UUID,
  asset_count INT DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP
);

CREATE TABLE art_piece_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  art_piece_id UUID NOT NULL REFERENCES art_pieces(id) ON DELETE CASCADE,
  blob_path VARCHAR(2048) NOT NULL,
  blob_url VARCHAR(2048) NOT NULL,
  file_size_bytes BIGINT NOT NULL,
  file_type VARCHAR(50) NOT NULL,
  sequence_order INT NOT NULL DEFAULT 0,
  image_title VARCHAR(255),
  image_description TEXT,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP,
  
  -- Ensure order is unique per art piece (no two images with same order)
  UNIQUE(art_piece_id, sequence_order)
);

-- Index for fast queries
CREATE INDEX idx_art_piece_assets_art_piece_id ON art_piece_assets(art_piece_id);
*/

Table art_pieces {
  id uuid [primary key, default: `gen_random_uuid()`]
  user_id uuid [ref: > users.id]
  title varchar(255) [not null]
  description text
  tags varchar(255)
  is_for_sale boolean [default: false]
  price decimal(10,2)
  currency varchar(3) [default: 'EUR']
  status varchar(50) [default: 'public']
  is_published boolean [default: true]
  commission_id uuid
  asset_count int [default: 0]
  created_at timestamp [not null, default: `now()`]
  updated_at timestamp
}

Table art_piece_assets {
  id uuid [primary key, default: `gen_random_uuid()`]
  art_piece_id uuid [ref: > art_pieces.id]
  blob_path varchar(2048) [not null]
  blob_url varchar(2048) [not null]
  file_size_bytes bigint [not null]
  file_type varchar(50) [not null]
  sequence_order int [not null, default: 0]
  image_title varchar(255)
  image_description text
  is_deleted boolean [default: false]
  created_at timestamp [not null, default: `now()`]
  updated_at timestamp

  Note: 'Ensure order is unique per art piece (no two images with same order)'
}

// --- SALES TRACKING ---
// This is different from the 'commissions' table
Table art_sales {
id integer [primary key]
art_piece_id integer [ref: > art_pieces.id]
buyer_id integer [ref: > users.id]
seller_id integer [ref: > users.id]

transaction_id varchar // Link to Stripe/Payment record
amount_paid decimal
platform_fee decimal

purchased_at timestamp
}

// --- DIGITAL VAULT (The "Download" Logic) ---
Table digital_assets {
id integer [primary key]
art_piece_id integer [ref: > art_pieces.id]
user_id integer [ref: > users.id] // Owner of the specific copy
download_token uuid [unique] // A one-time or expiring link for the buyer
expires_at timestamp
}

// --- PHYSICAL ARTWORK DETAILS ---
Table physical_art_details {
id integer [primary key]
art_piece_id integer [ref: - art_pieces.id] // 1-to-1 relationship

weight_kg decimal
dimensions_cm varchar // e.g., "50x70x5"
material_type varchar // e.g., "Canvas", "Bronze", "Paper"
is_framed boolean [default: false]

shipping_cost_est decimal // Artist-set estimate
shipping_included boolean [default: false]
}

// --- SECURE SHIPPING INFO ---
Table shipping_addresses {
id integer [primary key]
user_id integer [ref: > users.id]

full_name varchar
phone_number varchar
address_line1 varchar
address_line2 varchar
city varchar
state_province varchar
postal_code varchar
country_code varchar // ISO 2-letter

is_default boolean [default: false]
}

// --- TRACKING THE SHIPMENT ---
Table shipments {
id integer [primary key]
sale_id integer [ref: - art_sales.id]

carrier_name varchar // e.g., "DHL", "FedEx", "CTT"
tracking_number varchar
status varchar // 'pending', 'shipped', 'in_transit', 'delivered', 'returned'

shipped_at timestamp
estimated_arrival timestamp
}
