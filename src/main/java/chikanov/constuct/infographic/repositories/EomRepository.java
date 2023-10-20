package chikanov.constuct.infographic.repositories;

import chikanov.constuct.infographic.models.Eom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.data.domain.Pageable;
import java.util.List;

public interface EomRepository extends JpaRepository<Eom, Long> {
    @Query("SELECT e FROM Eom e ORDER BY id DESC")
    public List<Eom> getAll();
    @Query("SELECT e FROM Eom e WHERE name LIKE %:prefix%")
    public List<Eom> getFind(@Param("prefix") String prefix);
}
