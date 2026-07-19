package server.art.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import server.art.data.ArtPiece;
import server.art.data.Favorite;
import server.art.data.User;
import server.art.data.dto.social.FavoriteToggleResponseDTO;
import server.art.exceptions.ResourceNotFoundException;
import server.art.repositories.ArtPieceRepository;
import server.art.repositories.FavoriteRepository;
import server.art.repositories.UserRepository;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final ArtPieceRepository artPieceRepository;
    private final UserRepository userRepository;
    private final IdentityService identityService;

    @Transactional
    public FavoriteToggleResponseDTO toggleFavorite(UUID pieceId) {
        User user = getCurrentUser();
        ArtPiece piece = artPieceRepository.findById(pieceId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio piece not found: " + pieceId));

        boolean exists = favoriteRepository.existsByUserIdAndArtPieceId(user.getId(), pieceId);

        if (exists) {
            favoriteRepository.deleteByUserIdAndArtPieceId(user.getId(), pieceId);
            piece.setFavoriteCount(Math.max(0, piece.getFavoriteCount() - 1));
        } else {
            Favorite favorite = Favorite.builder()
                    .user(user)
                    .artPiece(piece)
                    .build();
            favoriteRepository.save(favorite);
            piece.setFavoriteCount(piece.getFavoriteCount() + 1);
        }

        artPieceRepository.save(piece);

        return FavoriteToggleResponseDTO.builder()
                .isFavorited(!exists)
                .favoriteCount(piece.getFavoriteCount())
                .build();
    }

    public FavoriteToggleResponseDTO getFavoriteStatus(UUID pieceId) {
        boolean isFavorited = false;
        try {
            User user = getCurrentUser();
            isFavorited = favoriteRepository.existsByUserIdAndArtPieceId(user.getId(), pieceId);
        } catch (Exception e) {
            // Not authenticated or user not found, that's fine for a GET request
        }
        
        ArtPiece piece = artPieceRepository.findById(pieceId)
                .orElseThrow(() -> new ResourceNotFoundException("Portfolio piece not found: " + pieceId));

        return FavoriteToggleResponseDTO.builder()
                .isFavorited(isFavorited)
                .favoriteCount(piece.getFavoriteCount())
                .build();
    }

    public boolean isFavorited(UUID pieceId) {
        try {
            User user = getCurrentUser();
            return favoriteRepository.existsByUserIdAndArtPieceId(user.getId(), pieceId);
        } catch (Exception e) {
            return false;
        }
    }

    private User getCurrentUser() {
        String keycloakId = identityService.getCurrentUserSub();
        return userRepository.findByKeycloakId(keycloakId)
                .orElseThrow(() -> new ResourceNotFoundException("Current user not found"));
    }
}
