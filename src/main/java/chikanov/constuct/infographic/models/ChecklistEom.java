package chikanov.constuct.infographic.models;

import jakarta.persistence.*;

@Entity
public class ChecklistEom {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String eomCode;
    @Column(columnDefinition = "TEXT")
    private String nameBlock;
    @Column(columnDefinition = "TEXT")
    private String cap;
    private String colors;
    @Column(columnDefinition = "TEXT")
    private String grids;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEomCode() {
        return eomCode;
    }

    public void setEomCode(String eomCode) {
        this.eomCode = eomCode;
    }

    public String getNameBlock() {
        return nameBlock;
    }

    public void setNameBlock(String nameBlock) {
        this.nameBlock = nameBlock;
    }

    public String getCap() {
        return cap;
    }

    public void setCap(String cap) {
        this.cap = cap;
    }

    public String getColors() {
        return colors;
    }

    public void setColors(String colors) {
        this.colors = colors;
    }

    public String getGrids() {
        return grids;
    }

    public void setGrids(String grids) {
        this.grids = grids;
    }

    public void GridCheck()
    {
        this.grids = this.grids.replaceAll("\\\\n", " ");
    }
}
