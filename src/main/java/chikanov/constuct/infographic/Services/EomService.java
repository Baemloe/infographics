package chikanov.constuct.infographic.Services;

import chikanov.constuct.infographic.models.Eom;
import chikanov.constuct.infographic.models.Image;
import chikanov.constuct.infographic.repositories.EomRepository;
import chikanov.constuct.infographic.repositories.ImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EomService {
    @Autowired
    EomRepository eomRepository;
    @Autowired
    ImageRepository imageRepository;

    public String Save(Eom eom)
    {
        try {
            if (eom.getId() != null) {
                this.deleteMore(this.getEomImages(eom.getId()), eom);
            }
            eom.setLastChange(LocalDateTime.now());
            Eom ids = eomRepository.save(eom);
            return ids.getId().toString();
        }
        catch (Exception ex)
        {
            System.out.println(ex.getMessage());
            return ex.getMessage();
        }

    }
    public List<Image> getEomImages(Long eomId)
    {
        List<Image> eomImages = imageRepository.findByFatherId(eomId);
        return eomImages;
    }
    public void deleteMore(List<Image> images, Eom eom)
    {
        String allElements = eom.getElements() + eom.getDraggable();
        for(Image img : images)
        {
            if(!allElements.contains("\"pic\":\"" + img.getId()))
            {
                imageRepository.deleteById(img.getId());
            }
        }
    }
    public Map<String, Long> getEomsToFind()
    {
        Map<String, Long> map = new HashMap<>();
        List<Eom> list = eomRepository.getAll();
        for( Eom eom : list)
        {
            if(eom.getName() != null)
            {
                map.put(this.twiceNameRecursion(map, new String[]{eom.getName(), eom.getName()}, 0), eom.getId());
            }
        }
        return map;
    }
    public Map<String, Long> getEoms(String prefix)
    {
        Map<String, Long> map = new HashMap<>();
        List<Eom> list = eomRepository.getFind(prefix);
        for( Eom eom : list)
        {
            map.put(this.twiceNameRecursion(map, new String[]{eom.getName(), eom.getName()}, 0), eom.getId());
        }
        return map;
    }
    private String twiceNameRecursion(Map<String, Long> map, String[] names, int count)
    {
        if(map.containsKey(names[0]))
        {
            count++;
            names[0] = this.twiceNameRecursion(map, new String[]{names[1] + "_" + count, names[1]}, count);
        }
        return names[0];
    }
}
