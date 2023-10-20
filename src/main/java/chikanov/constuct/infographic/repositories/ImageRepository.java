package chikanov.constuct.infographic.repositories;

import chikanov.constuct.infographic.models.Image;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ImageRepository extends JpaRepository<Image, Long> {
    public List<Image> findByFatherId(Long father);
}
