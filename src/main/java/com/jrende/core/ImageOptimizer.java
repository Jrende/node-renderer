package com.jrende.core;

import com.google.gson.*;

import java.util.Map;

public class ImageOptimizer {
    private static Gson gson = new Gson();

    public static String optimizeGraph(String source) {
        JsonObject jsonArray = gson.fromJson(source, JsonObject.class);

        try {
            makeFinalOutputOrigo(jsonArray.getAsJsonObject("nodes"));
        } catch (Exception e) {
            e.printStackTrace();
        }
        String output = jsonArray.toString();
        return output;
    }

    private static double roundToDecimalPlaces(double value, int decimalPlaces) {
        double shift = Math.pow(10, decimalPlaces);
        return Math.round(value * shift) / shift;
    }

    private static void makeFinalOutputOrigo(JsonObject jsonArray) throws IllegalArgumentException {
        Float xZero, yZero;
        JsonObject finalOutput = jsonArray.get("0").getAsJsonObject();
        JsonArray outputPos = finalOutput.get("pos").getAsJsonArray();
        xZero = outputPos.get(0).getAsFloat();
        yZero = outputPos.get(1).getAsFloat();
        for (Map.Entry<String, JsonElement> entry : jsonArray.entrySet()) {
            JsonElement jsonElement = entry.getValue();
            if (!jsonElement.equals(JsonNull.INSTANCE)) {
                JsonObject jsonObject = jsonElement.getAsJsonObject();
                JsonArray pos = jsonObject.get("pos").getAsJsonArray();
                float oldX = pos.get(0).getAsFloat();
                float oldY = pos.get(1).getAsFloat();
                JsonPrimitive newX = new JsonPrimitive(roundToDecimalPlaces(oldX - xZero, 2));
                pos.set(0, newX);
                JsonPrimitive newY = new JsonPrimitive(roundToDecimalPlaces(oldY - yZero, 2));
                pos.set(1, newY);
            }
        }
    }

}
