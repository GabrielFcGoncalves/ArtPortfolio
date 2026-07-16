package server.art.services;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.oauth2.jwt.Jwt;
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
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CommentServiceTest {

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private ArtPieceRepository artPieceRepository;

    @Mock
    private UserRepository userRepository;

    private TestIdentityService identityService;
    private CommentService commentService;

    private User currentUser;
    private ArtPiece artPiece;
    private Comment topLevelComment;

    private static class TestIdentityService extends IdentityService {
        private String currentSub = "user-keycloak-id";

        public void setCurrentSub(String sub) {
            this.currentSub = sub;
        }

        @Override
        public String getCurrentUserSub() {
            return currentSub;
        }

        @Override
        public Jwt getCurrentJwt() {
            return null;
        }
    }

    @BeforeEach
    void setUp() {
        identityService = new TestIdentityService();
        commentService = new CommentService(commentRepository, artPieceRepository, userRepository, identityService);

        currentUser = User.builder()
                .id(UUID.randomUUID())
                .keycloakId("user-keycloak-id")
                .username("john_doe")
                .avatarUrl("avatar.png")
                .role("USER")
                .build();

        artPiece = ArtPiece.builder()
                .id(UUID.randomUUID())
                .user(currentUser)
                .title("Beautiful Sunrise")
                .build();

        topLevelComment = Comment.builder()
                .id(UUID.randomUUID())
                .user(currentUser)
                .artPiece(artPiece)
                .content("Stunning work!")
                .parent(null)
                .createdAt(Instant.now())
                .replies(new ArrayList<>())
                .build();
    }

    @Test
    void createComment_Success_TopLevel() {
        identityService.setCurrentSub("user-keycloak-id");
        when(userRepository.findByKeycloakId("user-keycloak-id")).thenReturn(Optional.of(currentUser));
        when(artPieceRepository.findById(artPiece.getId())).thenReturn(Optional.of(artPiece));
        when(commentRepository.save(any(Comment.class))).thenAnswer(invocation -> {
            Comment c = invocation.getArgument(0);
            c.setId(UUID.randomUUID());
            return c;
        });

        CommentCreateRequestDTO request = CommentCreateRequestDTO.builder()
                .content("I love the colors!")
                .build();

        CommentResponseDTO response = commentService.createComment(artPiece.getId(), request);

        assertNotNull(response);
        assertEquals("I love the colors!", response.getContent());
        assertNull(response.getParentId());
        assertEquals(currentUser.getId(), response.getUserId());
        assertEquals("john_doe", response.getUsername());
        verify(commentRepository, times(1)).save(any(Comment.class));
    }

    @Test
    void createComment_Success_Reply() {
        identityService.setCurrentSub("user-keycloak-id");
        when(userRepository.findByKeycloakId("user-keycloak-id")).thenReturn(Optional.of(currentUser));
        when(artPieceRepository.findById(artPiece.getId())).thenReturn(Optional.of(artPiece));
        when(commentRepository.findById(topLevelComment.getId())).thenReturn(Optional.of(topLevelComment));
        when(commentRepository.save(any(Comment.class))).thenAnswer(invocation -> {
            Comment c = invocation.getArgument(0);
            c.setId(UUID.randomUUID());
            return c;
        });

        CommentCreateRequestDTO request = CommentCreateRequestDTO.builder()
                .content("Thanks for sharing!")
                .parentId(topLevelComment.getId())
                .build();

        CommentResponseDTO response = commentService.createComment(artPiece.getId(), request);

        assertNotNull(response);
        assertEquals("Thanks for sharing!", response.getContent());
        assertEquals(topLevelComment.getId(), response.getParentId());
        verify(commentRepository, times(1)).save(any(Comment.class));
    }

    @Test
    void createComment_ResolveOneLevelParenting_ReplyToReply() {
        Comment firstReply = Comment.builder()
                .id(UUID.randomUUID())
                .user(currentUser)
                .artPiece(artPiece)
                .content("Indeed!")
                .parent(topLevelComment)
                .createdAt(Instant.now())
                .build();

        identityService.setCurrentSub("user-keycloak-id");
        when(userRepository.findByKeycloakId("user-keycloak-id")).thenReturn(Optional.of(currentUser));
        when(artPieceRepository.findById(artPiece.getId())).thenReturn(Optional.of(artPiece));
        when(commentRepository.findById(firstReply.getId())).thenReturn(Optional.of(firstReply));
        when(commentRepository.save(any(Comment.class))).thenAnswer(invocation -> {
            Comment c = invocation.getArgument(0);
            c.setId(UUID.randomUUID());
            return c;
        });

        CommentCreateRequestDTO request = CommentCreateRequestDTO.builder()
                .content("Replying to first reply!")
                .parentId(firstReply.getId())
                .build();

        CommentResponseDTO response = commentService.createComment(artPiece.getId(), request);

        assertNotNull(response);
        assertEquals("Replying to first reply!", response.getContent());
        // Parent ID should be resolved to the top-level comment ID instead of the first reply ID
        assertEquals(topLevelComment.getId(), response.getParentId());
        verify(commentRepository, times(1)).save(any(Comment.class));
    }

    @Test
    void createComment_ThrowsException_EmptyContent() {
        CommentCreateRequestDTO request = CommentCreateRequestDTO.builder()
                .content("")
                .build();

        assertThrows(BusinessLogicException.class, () -> 
                commentService.createComment(artPiece.getId(), request));
    }

    @Test
    void getComments_Success() {
        PageRequest pageRequest = PageRequest.of(0, 10, org.springframework.data.domain.Sort.by("createdAt").descending());
        List<Comment> commentsList = List.of(topLevelComment);
        Page<Comment> page = new PageImpl<>(commentsList, pageRequest, 1);

        when(commentRepository.findByArtPieceIdAndParentIsNull(eq(artPiece.getId()), any(PageRequest.class)))
                .thenReturn(page);

        PaginatedResponse<CommentResponseDTO> response = commentService.getComments(artPiece.getId(), 1, 10);

        assertNotNull(response);
        assertEquals(1, response.getTotal());
        assertEquals(1, response.getData().size());
        assertEquals("Stunning work!", response.getData().get(0).getContent());
    }

    @Test
    void deleteComment_Success_Owner() {
        identityService.setCurrentSub("user-keycloak-id");
        when(userRepository.findByKeycloakId("user-keycloak-id")).thenReturn(Optional.of(currentUser));
        when(commentRepository.findById(topLevelComment.getId())).thenReturn(Optional.of(topLevelComment));

        SimpleMessageResponseDTO response = commentService.deleteComment(topLevelComment.getId());

        assertNotNull(response);
        assertTrue(response.isSuccess());
        verify(commentRepository, times(1)).delete(topLevelComment);
    }

    @Test
    void deleteComment_AccessDenied_NotOwner() {
        User otherUser = User.builder()
                .id(UUID.randomUUID())
                .keycloakId("other-keycloak-id")
                .role("USER")
                .build();

        identityService.setCurrentSub("other-keycloak-id");
        when(userRepository.findByKeycloakId("other-keycloak-id")).thenReturn(Optional.of(otherUser));
        when(commentRepository.findById(topLevelComment.getId())).thenReturn(Optional.of(topLevelComment));

        assertThrows(AccessDeniedException.class, () -> 
                commentService.deleteComment(topLevelComment.getId()));
        verify(commentRepository, never()).delete(any(Comment.class));
    }
}
