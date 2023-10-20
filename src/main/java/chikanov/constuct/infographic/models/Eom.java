package chikanov.constuct.infographic.models;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class Eom {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Nullable
    private Long id;
    private String name;
    private String size;
    @Column(columnDefinition = "TEXT")
    private String elements;
    @Column(columnDefinition = "TEXT")
    private String draggable;
    private String colors;
    @Column(columnDefinition = "TEXT")
    private String infos;
        @JsonIgnore
    private LocalDateTime lastChange;

    public LocalDateTime getLastChange() {
        return lastChange;
    }

    public void setLastChange(LocalDateTime lastChange) {
        this.lastChange = lastChange;
    }

    public String getColors() {
        return colors;
    }

    public void setColors(String colors) {
        this.colors = colors;
    }

    public String getInfos() {
        return infos;
    }

    public void setInfos(String infos) {
        this.infos = infos;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        if(id != null)
        {
            this.id = id;
        }
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSize() {
        return size;
    }

    public void setSize(String size) {
        this.size = size;
    }

    public String getElements() {
        return elements;
    }

    public void setElements(String elements) {
        this.elements = elements;
    }

    public String getDraggable() {
        return draggable;
    }

    public void setDraggable(String draggable) {
        this.draggable = draggable;
    }
}
