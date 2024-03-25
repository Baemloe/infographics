package chikanov.constuct.infographic.controllers;

import chikanov.constuct.infographic.Services.ZipCreator;
import chikanov.constuct.infographic.models.ChecklistEom;
import chikanov.constuct.infographic.models.Eom;
import chikanov.constuct.infographic.repositories.ChecklistEomRepository;
import chikanov.constuct.infographic.repositories.EomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.net.URISyntaxException;

@Controller
public class ZipController {
    @Autowired
    EomRepository eomRepository;
    @Autowired
    ZipCreator zipCreator;

    @Autowired
    ChecklistEomRepository checklistEomRepository;

    @GetMapping("/getzip/{id}")
    public ResponseEntity<byte[]> GetInfographicZip(@PathVariable Long id) throws IOException, URISyntaxException {
        Eom eom = eomRepository.findById(id).get();
        byte[] zipBytes = zipCreator.CreateInfographic(eom);
        String eomName = eom.getName();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentDispositionFormData("attachment", eomName + ".zip");
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);

        return new ResponseEntity<>(zipBytes, headers, HttpStatus.OK);
    }

    @GetMapping("/getcheck/{id}")
    public ResponseEntity<byte[]> getChecklistZip(@PathVariable Long id) throws IOException {
        ChecklistEom checklistEom = checklistEomRepository.findById(id).get();
        byte[] zipBytes = zipCreator.createCheckList(checklistEom);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentDispositionFormData("attachment", checklistEom.getEomCode() + ".zip");
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);

        return new ResponseEntity<>(zipBytes, headers, HttpStatus.OK);
    }
}
