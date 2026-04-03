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

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "disputes")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Dispute {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "commission_id", nullable = false)
    private Commission commission;

    @Column(nullable = false)
    private UUID initiatedById;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String reason;

    @Column(columnDefinition = "TEXT")
    private String resolution;

    private String resolutionType;

    private UUID resolvedById;

    @Column(nullable = false)
    @Builder.Default
    private String status = "OPEN";

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private Instant createdAt = Instant.now();

    private Instant resolvedAt;
}
