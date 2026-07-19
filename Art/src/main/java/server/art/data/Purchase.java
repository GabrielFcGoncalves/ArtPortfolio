package server.art.data;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "purchases")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Purchase {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "art_piece_id", nullable = false)
    private ArtPiece artPiece;

    @Column(nullable = false)
    private long amountCents;

    @Column(nullable = false)
    private long platformFeeCents;

    @Column(nullable = false)
    private String currency;

    private String stripeSessionId;

    private String stripePaymentIntentId;

    @Column(nullable = false)
    @Builder.Default
    private String status = "PENDING";

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    private Instant completedAt;
}
