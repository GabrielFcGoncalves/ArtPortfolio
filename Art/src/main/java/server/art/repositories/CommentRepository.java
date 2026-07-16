package server.art.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import server.art.data.Comment;
import java.util.UUID;

@Repository
public interface CommentRepository extends JpaRepository<Comment, UUID> {
    
    // Find top-level comments for a specific art piece
    Page<Comment> findByArtPieceIdAndParentIsNull(UUID artPieceId, Pageable pageable);

    // Count all comments for a specific art piece
    long countByArtPieceId(UUID artPieceId);
}
