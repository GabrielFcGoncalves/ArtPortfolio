package server.art.data;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "art_pieces")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArtPiece {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
    
    @Column(nullable = false)
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    private String tags;
    
    // ✅ Remove coverImage - derived from first asset
    // private String coverImage;
    
    @Builder.Default
    private boolean isForSale = false;
    
    private BigDecimal price;
    
    @Builder.Default
    private String currency = "EUR";
    
    @Column(nullable = false)
    @Builder.Default
    private String status = "public";
    
    @Builder.Default
    private boolean isPublished = true;
    
    private UUID commissionId;
    
    // ✅ Denormalized count for fast reads (update on asset add/delete)
    @Builder.Default
    private int assetCount = 0;
    
    // ✅ NEW: One-to-many relationship to assets
    @Builder.Default
    @OneToMany(mappedBy = "artPiece", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sequenceOrder ASC")
    private List<ArtPieceAsset> assets = new ArrayList<>();
    
    @Column(nullable = false, updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();
    
    private Instant updatedAt;
    
    // ✅ Helper method to get cover image (first asset)
    public ArtPieceAsset getCoverImage() {
        return assets != null && !assets.isEmpty() ? assets.get(0) : null;
    }
    
    // ✅ Helper method to add asset and update count
    public void addAsset(ArtPieceAsset asset) {
        if (assets == null) {
            assets = new ArrayList<>();
        }
        asset.setArtPiece(this);
        assets.add(asset);
        this.assetCount = assets.size();
    }
    
    // ✅ Helper method to remove asset and update count
    public void removeAsset(ArtPieceAsset asset) {
        if (assets != null) {
            assets.remove(asset);
            this.assetCount = assets.size();
        }
    }
}
