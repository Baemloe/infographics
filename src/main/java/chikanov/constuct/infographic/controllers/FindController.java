package chikanov.constuct.infographic.controllers;

import chikanov.constuct.infographic.Services.EomService;
import chikanov.constuct.infographic.models.ChecklistEom;
import chikanov.constuct.infographic.repositories.ChecklistEomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class FindController {
    @Autowired
    EomService eomService;
    @Autowired
    ChecklistEomRepository checklistEomRepository;
    @GetMapping("/allList")
    @ResponseBody
    public Map<String, Long> getAll()
    {
        return eomService.getEomsToFind();
    }

    @PostMapping("/finded")
    @ResponseBody
    public  Map<String, Long> getFind(@RequestBody String finded)
    {
        return eomService.getEoms(finded);
    }
    @GetMapping("/loadchecklist")
    @ResponseBody
    public Map<String, Long> loadChecklist()
    {
        Map<String, Long> map = new HashMap<>();
        List<ChecklistEom> list = checklistEomRepository.findAll();
        for(ChecklistEom eom : list)
        {
            map.put(eom.getEomCode(), eom.getId());
        }
        return map;
    }
    @GetMapping("/checkedit/{id}")
    @ResponseBody
    public ChecklistEom getChecklist(@PathVariable Long id)
    {
        return checklistEomRepository.findById(id).get();
    }
}
