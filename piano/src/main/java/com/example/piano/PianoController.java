package com.example.piano;

import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;

@RestController
@RequestMapping("/api/audio")
public class PianoController {

    @GetMapping("/{note}")
    public ResponseEntity<Resource> getNoteAudio(@PathVariable String note) {
        try {
            // Decode the note parameter to handle %23 as #
            String decodedNote = URLDecoder.decode(note, StandardCharsets.UTF_8.name());
            Resource resource = new ClassPathResource("static/audio/" + decodedNote + ".wav");
            if (!resource.exists()) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType("audio/wav"))
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}