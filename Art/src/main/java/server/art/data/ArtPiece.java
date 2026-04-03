package server.art.data;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.Instant;
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

    private String coverImage;

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

    @Builder.Default
    private int assetCount = 0;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    private Instant updatedAt;
}
