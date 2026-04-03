package server.art.data;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "art_piece_assets")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArtPieceAsset {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    // ✅ Foreign key to parent art piece
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "art_piece_id", nullable = false)
    private ArtPiece artPiece;
    
    // ✅ Image metadata (NOT the image bytes - those go to Azure)
    @Column(nullable = false)
    private String blobPath;  // "portfolio/user_id/timestamp-filename.png"
    
    @Column(nullable = false)
    private String blobUrl;   // "https://storage.blob.core.windows.net/..."
    
    @Column(nullable = false)
    private Long fileSizeBytes;
    
    @Column(nullable = false)
    private String fileType;  // "image/png", "image/jpeg"
    
    // ✅ Ordering for gallery (which image shows first, second, etc.)
    @Column(nullable = false)
    @Builder.Default
    private Integer sequenceOrder = 0;
    
    // ✅ Optional: image metadata
    private String imageTitle;      // User can rename image
    private String imageDescription; // User can add caption
    
    @Column(nullable = false)
    @Builder.Default
    private boolean isDeleted = false;  // Soft delete
    
    @Column(nullable = false, updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();
    
    private Instant updatedAt;
}
