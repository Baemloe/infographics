package chikanov.constuct.infographic.controllers;

import chikanov.constuct.infographic.Services.EomService;
import chikanov.constuct.infographic.models.ChecklistEom;
import chikanov.constuct.infographic.models.Eom;
import chikanov.constuct.infographic.repositories.ChecklistEomRepository;
import chikanov.constuct.infographic.repositories.EomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
public class SaveController {
    @Autowired
    EomService eomService;
    @Autowired
    ChecklistEomRepository checklistEomRepository;
    @PostMapping("/saveeom")
    @ResponseBody
    public String saveEom(Eom eom)
    {
        try
        {
            return eomService.Save(eom);
        }
        catch (Exception ex)
        {
            return ex.getMessage();
        }
    }
    @PostMapping("/savechecklist")
    @ResponseBody
    public Long saveCheck(ChecklistEom checklistEom)
    {
        checklistEom.GridCheck();
        ChecklistEom fromId = checklistEomRepository.save(checklistEom);
        return fromId.getId();
    }
}
