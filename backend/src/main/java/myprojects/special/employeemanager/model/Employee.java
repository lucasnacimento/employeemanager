package myprojects.special.employeemanager.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.io.Serializable;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class Employee implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(nullable = false, updatable = false)
    private Long id;

    @Size(min = 6, max = 120 ,message = "{name.size}")
    @Pattern(regexp = "[a-zA-Z ]+")
    @NotBlank(message = "{name.not.blank}")
    @Column(nullable = false, length = 120)
    private String name;

    @NotBlank(message = "{name.not.blank}")
    @Email(message = "{email.email}")
    private  String email;

    @Size(min = 3, max = 80 ,message = "{jobTitle.size}")
    @Pattern(regexp = "[a-zA-Z ]+")
    @NotBlank(message = "{jobTitle.not.blank}")
    @Column(nullable = false, length = 80)
    private String jobTitle;

    @NotBlank
    @Column(nullable = false, length = 9)
    @Size(min = 9, max = 9, message = "{phone.size}")
    private String phone;

    private String imageUrl;

    @Column(nullable = false, updatable = false)
    private String employeeCode;
}
