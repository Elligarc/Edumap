package com.roadmap.security;

import io.jsonwebtoken.io.SerializationException;
import io.jsonwebtoken.io.Serializer;
import tools.jackson.databind.ObjectMapper;

import java.io.OutputStream;
import java.util.Map;

public class Jackson3Serializer implements Serializer<Map<String, ?>> {

    private final ObjectMapper objectMapper;

    public Jackson3Serializer(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public byte[] serialize(Map<String, ?> map) throws SerializationException {
        try {
            return objectMapper.writeValueAsBytes(map);
        } catch (Exception e) {
            throw new SerializationException("Failed to serialize JWT object using Jackson 3", e);
        }
    }

    @Override
    public void serialize(Map<String, ?> map, OutputStream out) throws SerializationException {
        try {
            objectMapper.writeValue(out, map);
        } catch (Exception e) {
            throw new SerializationException("Failed to serialize JWT object to OutputStream using Jackson 3", e);
        }
    }
}
