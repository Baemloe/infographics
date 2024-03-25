package chikanov.constuct.infographic.Services;

import chikanov.constuct.infographic.models.ChecklistEom;
import chikanov.constuct.infographic.models.Eom;
import chikanov.constuct.infographic.models.Image;
import chikanov.constuct.infographic.repositories.EomRepository;
import chikanov.constuct.infographic.repositories.ImageRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.URISyntaxException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class ZipCreator {
    @Autowired
    ImageRepository imageRepository;
    @Autowired
    EomRepository eomRepository;
    @Autowired
    private ResourceLoader resourceLoader;
    private Eom eom;

    public byte[] CreateInfographic(Eom eom) throws IOException, URISyntaxException {
        this.eom = eom;
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ZipOutputStream zip = new ZipOutputStream(baos);

        zip.putNextEntry(new ZipEntry("media/"));
        zip.closeEntry();
        zip.putNextEntry(new ZipEntry("js/"));
        zip.closeEntry();
        zip.putNextEntry(new ZipEntry("fonts/"));
        zip.closeEntry();

        this.CopyDir(zip, "fonts");
        this.CopyDir(zip, "js");
        this.ImageLoader(zip);
        this.CopyFiles(zip);
        this.CopyCats(zip);
        this.GenerateDataJSON(zip);
        this.CopyColorPics(zip);

        zip.close();
        return baos.toByteArray();
    }
    public byte[] createCheckList(ChecklistEom checklistEom) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ZipOutputStream zip = new ZipOutputStream(baos);

        zip.putNextEntry(new ZipEntry("media/"));
        zip.closeEntry();
        zip.putNextEntry(new ZipEntry("fonts/"));
        zip.closeEntry();

        this.CopyDir(zip, "fonts");

        zip.putNextEntry(new ZipEntry("styles.css"));
        zip.write(this.GetResourse("static/styles/playerStyles.css"));
        zip.closeEntry();
        Map<String, String> col = this.getColor(checklistEom.getColors());
        zip.putNextEntry(new ZipEntry("media/finger.png"));
        zip.write(this.GetResourse("static/fingers/" + col.get("color") + ".png"));
        zip.closeEntry();
        zip.putNextEntry(new ZipEntry("media/low.png"));
        zip.write(this.GetResourse("static/cats/false.png"));
        zip.closeEntry();
        zip.putNextEntry(new ZipEntry("media/high.png"));
        zip.write(this.GetResourse("static/cats/true.png"));
        zip.closeEntry();
        zip.putNextEntry(new ZipEntry("media/middle.png"));
        zip.write(this.GetResourse("static/cats/middle.png"));
        zip.closeEntry();
        zip.putNextEntry(new ZipEntry("media/back.png"));
        zip.write(this.GetResourse("static/backs/" + col.get("color") + ".png"));
        zip.closeEntry();
        zip.putNextEntry(new ZipEntry("media/empty.png"));
        String[] emp = col.get("empty").split("/");
        zip.write(this.GetResourse("static/images/" +  emp[emp.length - 1]));
        zip.closeEntry();
        zip.putNextEntry(new ZipEntry("media/full.png"));
        String[] ful = col.get("full").split("/");
        zip.write(this.GetResourse("static/images/" +  ful[ful.length - 1]));
        zip.closeEntry();
        zip.putNextEntry(new ZipEntry("eom.json"));
        zip.write(this.GetResourse("static/json/eom.json"));
        zip.closeEntry();
        zip.putNextEntry(new ZipEntry("index.html"));
        zip.write(this.createIndex(checklistEom, this.getColor(checklistEom.getColors())));
        zip.closeEntry();

        zip.close();
        return baos.toByteArray();
    }
    private byte[] createIndex(ChecklistEom checklistEom, Map<String, String> col) throws IOException {
        byte[] buff = this.GetResourse("templates/checklistclishe.html");
        String html = new String(buff);
        html = html.replace("$$name$$", checklistEom.getNameBlock());
        html = html.replace("$$description$$", checklistEom.getCap());
        html = html.replace("$$grids$$", checklistEom.getGrids());
        html = html.replace("$$colors$$", checklistEom.getColors());
        return html.getBytes();
    }
    private Map<String, String> getColor(String colors)
    {
        Map<String, String> map = new HashMap<>();
        map.put("color", this.getPattern("picture", colors));
        map.put("empty", this.getPattern("empty", colors));
        map.put("full", this.getPattern("full", colors));
        map.put("gradient", this.getPattern("gradient", colors));
        return map;
    }
    private String getPattern(String name, String colors)
    {
        Pattern pattern = Pattern.compile(name + "\":\\s*\"([^\"]+)\"");
        Matcher matcher = pattern.matcher(colors);
        if(matcher.find())
        {
            return matcher.group(1);
        }
        return null;
    }
    private byte[] GetResourse(String path) throws IOException {
        ClassLoader classLoader = getClass().getClassLoader();
        InputStream is = classLoader.getResourceAsStream(path);
        byte[] buff = is.readAllBytes();
        return buff;
    }
    private ZipEntry CreateEntry(String name)
    {
        ZipEntry zipEntry = new ZipEntry(name);
        return zipEntry;
    }
    private void CopyDir(ZipOutputStream zip, String folderName) throws IOException{

        File fontsDir = new File("tozip/" + folderName);
        for(File oneTtf : fontsDir.listFiles())
        {
            try(FileInputStream fos = new FileInputStream(oneTtf))
            {
                ZipEntry newEntry = new ZipEntry(folderName + "/" + oneTtf.getName());
                byte[] buff = fos.readAllBytes();
                zip.putNextEntry(newEntry);
                zip.write(buff);
                zip.closeEntry();
            }
        }
    }
    private void CopyCats(ZipOutputStream zip) throws IOException
    {
        File pics = new File("tozip/cats");
        for(File cat : pics.listFiles())
        {
            try(FileInputStream fos = new FileInputStream(cat))
            {
                ZipEntry newEntry = new ZipEntry( "media/" + cat.getName());
                byte[] buff = fos.readAllBytes();
                zip.putNextEntry(newEntry);
                zip.write(buff);
                zip.closeEntry();
            }
        }
    }
    private void ImageLoader(ZipOutputStream zip) throws IOException {
        List<Image> images = imageRepository.findByFatherId(this.eom.getId());
        for(Image img: images)
        {
            String newName = img.getId() + "." + img.getFileName().substring(img.getFileName().lastIndexOf(".") + 1);
            ZipEntry imag = new ZipEntry("media/" + newName);
            zip.putNextEntry(imag);
            zip.write(img.getData());
            zip.closeEntry();
        }
    }
    private void CopyFiles(ZipOutputStream zip) throws IOException {
        File folder = new File("tozip");
        File[] files = folder.listFiles();
        for(File file : files)
        {
            if(file.isFile())
            {
                try (FileInputStream fis = new FileInputStream(file)) {
                    ZipEntry fl = new ZipEntry(file.getName());
                    zip.putNextEntry(fl);
                    byte[] buff = fis.readAllBytes();
                    zip.write(buff);
                    zip.closeEntry();
                }
            }
        }
    }
    private void GenerateDataJSON(ZipOutputStream zip) throws IOException {
        ZipEntry dataJSON = new ZipEntry("data.json");
        zip.putNextEntry(dataJSON);
        zip.write(this.getEomData());
        zip.closeEntry();
    }
    private byte[] getEomData() throws JsonProcessingException {
        ObjectMapper om = new ObjectMapper();
        String s = om.writeValueAsString(this.eom);
        return s.getBytes();
    }
    private void CopyColorPics(ZipOutputStream zip) throws IOException
    {
        String color = new String();
        String pattern = "\"background\":\"(.*?)\"";
        Pattern regex = Pattern.compile(pattern);
        Matcher matcher = regex.matcher(this.eom.getColors());
        if (matcher.find()) {
            color = matcher.group(1);
        }
        File[] files = {new File("tozip/backs/" + color + ".png"), new File("tozip/fingers/" + color + ".png")};
        try(FileInputStream fis = new FileInputStream(files[0]))
        {
            ZipEntry f = new ZipEntry("media/back.png");
            zip.putNextEntry(f);
            zip.write(fis.readAllBytes());
            zip.closeEntry();
        }
        try(FileInputStream fis = new FileInputStream(files[1]))
        {
            ZipEntry f = new ZipEntry("media/finger.png");
            zip.putNextEntry(f);
            zip.write(fis.readAllBytes());
            zip.closeEntry();
        }

    }
}
