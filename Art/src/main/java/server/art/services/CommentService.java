package server.art.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import server.art.data.ArtPiece;
import server.art.data.Comment;
import server.art.data.User;
import server.art.data.dto.comment.CommentCreateRequestDTO;
import server.art.data.dto.comment.CommentResponseDTO;
import server.art.data.dto.common.SimpleMessageResponseDTO;
import server.art.dto.PaginatedResponse;
import server.art.exceptions.BusinessLogicException;
import server.art.exceptions.ResourceNotFoundException;
import server.art.repositories.ArtPieceRepository;
import server.art.repositories.CommentRepository;
import server.art.repositories.UserRepository;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final ArtPieceRepository artPieceRepository;
    private final UserRepository userRepository;
    private final IdentityService identityService;

    @Transactional(readOnly = true)
    public PaginatedResponse<CommentResponseDTO> getComments(UUID artPieceId, int page, int limit) {
        PageRequest pageRequest = PageRequest.of(page - 1, limit, Sort.by("createdAt").descending());
        Page<Comment> commentsPage = commentRepository.findByArtPieceIdAndParentIsNull(artPieceId, pageRequest);

        List<CommentResponseDTO> dtoList = commentsPage.getContent().stream()
                .map(this::mapToResponseDTO)
                .toList();

        return PaginatedResponse.of(dtoList, commentsPage.getTotalElements(), page, limit);
    }

    @Transactional
    public CommentResponseDTO createComment(UUID artPieceId, CommentCreateRequestDTO request) {
        if (request.getContent() == null || request.getContent().trim().isEmpty()) {
            throw new BusinessLogicException("Comment content cannot be empty");
        }

        User user = getCurrentUser();
        ArtPiece artPiece = artPieceRepository.findById(artPieceId)
                .orElseThrow(() -> new ResourceNotFoundException("Art piece not found: " + artPieceId));

        Comment parentComment = null;
        if (request.getParentId() != null) {
            Comment requestedParent = commentRepository.findById(request.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent comment not found: " + request.getParentId()));

            // Ensure parent comment is on the same art piece
            if (!requestedParent.getArtPiece().getId().equals(artPieceId)) {
                throw new BusinessLogicException("Parent comment is not associated with this art piece");
            }

            // Resolve top-level parent to guarantee only 1 level of nesting
            parentComment = requestedParent.getParent() != null ? requestedParent.getParent() : requestedParent;
        }

        Comment comment = Comment.builder()
                .user(user)
                .artPiece(artPiece)
                .content(request.getContent())
                .parent(parentComment)
                .build();

        Comment saved = commentRepository.save(comment);
        return mapToResponseDTO(saved);
    }

    @Transactional
    public SimpleMessageResponseDTO deleteComment(UUID commentId) {
        User user = getCurrentUser();
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new ResourceNotFoundException("Comment not found: " + commentId));

        // Check if user is the comment author, the art piece owner, or admin
        boolean isAuthor = comment.getUser().getId().equals(user.getId());
        boolean isArtPieceOwner = comment.getArtPiece().getUser().getId().equals(user.getId());
        boolean isAdmin = "ADMIN".equalsIgnoreCase(user.getRole());

        if (!isAuthor && !isArtPieceOwner && !isAdmin) {
            throw new AccessDeniedException("Unauthorized to delete this comment");
        }

        commentRepository.delete(comment);

        return SimpleMessageResponseDTO.builder()
                .success(true)
                .message("Comment deleted successfully")
                .build();
    }

    private CommentResponseDTO mapToResponseDTO(Comment comment) {
        List<CommentResponseDTO> replyDTOs = new ArrayList<>();
        if (comment.getReplies() != null && !comment.getReplies().isEmpty()) {
            replyDTOs = comment.getReplies().stream()
                    .map(this::mapToResponseDTO)
                    .toList();
        }

        return CommentResponseDTO.builder()
                .id(comment.getId())
                .userId(comment.getUser().getId())
                .username(comment.getUser().getUsername())
                .userAvatarUrl(comment.getUser().getAvatarUrl())
                .content(comment.getContent())
                .parentId(comment.getParent() != null ? comment.getParent().getId() : null)
                .createdAt(comment.getCreatedAt().toString())
                .replies(replyDTOs)
                .build();
    }

    private User getCurrentUser() {
        String keycloakId = identityService.getCurrentUserSub();
        return userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));
    }
}
