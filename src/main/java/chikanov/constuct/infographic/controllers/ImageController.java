package chikanov.constuct.infographic.controllers;

import chikanov.constuct.infographic.models.Image;
import chikanov.constuct.infographic.repositories.ImageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Controller
public class ImageController {
    @Autowired
    private ImageRepository imageRepository;
    @PostMapping("/image/{father}")
    @ResponseBody
    public String ImageSave(@RequestParam("file") MultipartFile file, @PathVariable Long father) throws IOException
    {
        try {
            Image image = new Image();
            image.setContentType(file.getContentType());
            image.setFileName(file.getOriginalFilename());
            image.setData(file.getBytes());
            image.setFatherId(father);
            Image saved = imageRepository.save(image);
            return saved.getId().toString() + "." + file.getOriginalFilename().substring(file.getOriginalFilename().lastIndexOf(".") + 1);
        }
        catch (Exception ex)
        {
            System.out.println(ex.getMessage());
            ex.printStackTrace();
            return ex.getMessage();
        }
    }
    @GetMapping("/getimage/{id}")
    public ResponseEntity<byte[]> getImage(@PathVariable String id)
    {
        String sliceId = id.substring(0,id.lastIndexOf("."));
        Optional<Image> imageOptional = imageRepository.findById(Long.parseLong(sliceId));
        if(imageOptional.isPresent())
        {
            Image image = imageOptional.get();
            HttpHeaders httpHeaders = new HttpHeaders();
            httpHeaders.setContentLength(image.getData().length);
            return new ResponseEntity<>(image.getData(), httpHeaders, HttpStatus.OK);
        }
        else
        {
            return ResponseEntity.notFound().build();
        }
    }
}
