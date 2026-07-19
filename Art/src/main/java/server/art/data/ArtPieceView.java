package server.art.data;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "art_piece_views", indexes = @Index(columnList = "art_piece_id"))
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ArtPieceView {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "art_piece_id", nullable = false)
    private ArtPiece artPiece;

    @Column(nullable = true)
    private String viewerKeycloakId;

    @Column(nullable = false)
    @Builder.Default
    private Instant viewedAt = Instant.now();
}
