package chikanov.constuct.infographic.controllers;

import chikanov.constuct.infographic.Services.ZipCreator;
import chikanov.constuct.infographic.models.ChecklistEom;
import chikanov.constuct.infographic.models.Eom;
import chikanov.constuct.infographic.repositories.ChecklistEomRepository;
import chikanov.constuct.infographic.repositories.EomRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.web.ServerProperties;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;

import java.io.*;
import java.net.URISyntaxException;
import java.util.ArrayList;
import java.util.List;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Controller
public class ZipController {
    @Autowired
    EomRepository eomRepository;
    @Autowired
    ZipCreator zipCreator;

    @Autowired
    ChecklistEomRepository checklistEomRepository;
    @GetMapping("/getzip/{id}")
    public ResponseEntity<Resource> GetInfographicZip(@PathVariable Long id) throws IOException, URISyntaxException {
        String eomName = eomRepository.findById(id).get().getName();
        File zip = zipCreator.CreateInfographic(eomRepository.findById(id).get());
        Resource res = new FileSystemResource(zip);
        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename="+ eomName +".zip")
                .contentType(MediaType.APPLICATION_OCTET_STREAM).body(res);
    }
    private byte[] getEomData(Long id) throws JsonProcessingException {
        Eom eom = eomRepository.findById(id).get();
        ObjectMapper om = new ObjectMapper();
        String s = om.writeValueAsString(eom);
        return s.getBytes();
    }
    @GetMapping("/getcheck/{id}")
    public ResponseEntity<Resource> getChecklistZip(@PathVariable Long id) throws IOException
    {
        ChecklistEom checklistEom = checklistEomRepository.findById(id).get();
        File zip = zipCreator.createCheckList(checklistEom);
        Resource res = new FileSystemResource(zip);
        return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename="+ checklistEom.getEomCode() +".zip")
                .contentType(MediaType.APPLICATION_OCTET_STREAM).body(res);
    }

}
