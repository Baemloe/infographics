package chikanov.constuct.infographic.controllers;

import chikanov.constuct.infographic.models.Eom;
import chikanov.constuct.infographic.repositories.EomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.ResponseBody;

import java.time.LocalDateTime;
import java.util.List;

@Controller
public class MainController {
    @Autowired
    EomRepository eomRepository;
    @GetMapping("/")
    public String getHomePage()
    {
        return "home";
    }
    @GetMapping("/interactive")
    public String getInteractive()
    {
        return "homepage";
    }
    @GetMapping("/checklist")
    public String getChecklist()
    {
        return "checklist";
    }
    @GetMapping("/system")
    public String getSystemPage()
    {
        return  "systemFileLoader";
    }
    @GetMapping("/saveeom/{name}")
    @ResponseBody
    public String SaveEom(@PathVariable String name)
    {
        Eom eom = new Eom();
        eom.setName(name);
        Eom getID = eomRepository.save(eom);
        return getID.getId().toString();
    }
    @GetMapping("/loadeom")
    public String loadEoms(Model model)
    {
        List<Eom> eoms = eomRepository.findAll();
        model.addAttribute("eoms", eoms);
        return "eom_list";
    }
    @GetMapping("/editeom/{id}")
    @ResponseBody
    public Eom editEom(@PathVariable Long id)
    {
        return eomRepository.findById(id).get();
    }
    @GetMapping("/player/{id}")
    public String loadPlayer(Model model, @PathVariable Long id)
    {
        model.addAttribute("id", id);
        return "player";
    }
    @GetMapping("/getdate/{id}")
    @ResponseBody
    public LocalDateTime getLastChange(@PathVariable Long id)
    {
        Eom ids = eomRepository.findById(id).get();
        return ids.getLastChange();
    }
}
