package server.art.data;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;


@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)

    @Column(nullable = false)
    @NotBlank()
    @Size(min = 1, max = 20)
    private String firstName;

    @Column(nullable = false)
    @NotBlank()
    @Size(min = 1, max = 20)
    private String lastName;

    @Column(nullable = false)
    @NotBlank()
    @Size(min = 4, max = 20)
    private String email;

    @Column(nullable = false)
    @NotBlank()
    @Size(min = 12, max = 20)
    private String password;


}
