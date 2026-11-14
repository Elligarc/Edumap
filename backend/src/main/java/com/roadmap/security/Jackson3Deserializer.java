package com.roadmap.security;

import io.jsonwebtoken.io.DeserializationException;
import io.jsonwebtoken.io.Deserializer;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

import java.io.Reader;
import java.util.Map;

public class Jackson3Deserializer implements Deserializer<Map<String, ?>> {

    private static final TypeReference<Map<String, Object>> TYPE_REF = new TypeReference<>() {};
    private final ObjectMapper objectMapper;

    public Jackson3Deserializer(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public Map<String, ?> deserialize(byte[] bytes) throws DeserializationException {
        try {
            return objectMapper.readValue(bytes, TYPE_REF);
        } catch (Exception e) {
            throw new DeserializationException("Failed to deserialize JWT object using Jackson 3", e);
        }
    }

    @Override
    public Map<String, ?> deserialize(Reader reader) throws DeserializationException {
        try {
            return objectMapper.readValue(reader, TYPE_REF);
        } catch (Exception e) {
            throw new DeserializationException("Failed to deserialize JWT reader using Jackson 3", e);
        }
    }
}
