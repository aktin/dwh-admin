package org.aktin.dwh.admin;

import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;

public class Helper {

    public static JsonObject enumParser(JsonObject jsonObj, String jsonKey, Class<?> enumClass) throws Exception {

        if(!enumClass.isEnum()) throw new Exception("No Enum Class found");
        Object[] enumValues = enumClass.getEnumConstants();

        JsonObjectBuilder builder = Json.createObjectBuilder();
        jsonObj.entrySet().forEach(e -> builder.add(e.getKey(), e.getValue()));
        builder.add(jsonKey, enumValues[jsonObj.getInt(jsonKey)].toString());
        return builder.build();
    }
}
