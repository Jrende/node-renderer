package com.jrende.model;

import com.google.gson.*;

public class ImageOptimizer {
    private static Gson gson = new Gson();

    public static String optimizeGraph(String source) {
        JsonObject jsonArray = gson.fromJson(source, JsonObject.class);

        makeFinalOutputOrigo(jsonArray.getAsJsonArray("nodes"));
        String output = jsonArray.toString();
        return output;
    }

    private static double roundToDecimalPlaces(double value, int decimalPlaces) {
        double shift = Math.pow(10, decimalPlaces);
        return Math.round(value * shift) / shift;
    }

    private static void makeFinalOutputOrigo(JsonArray jsonArray) throws IllegalArgumentException {
        Float xZero = 0.0f, yZero = 0.0f;
        JsonObject finalOutput = jsonArray.get(0).getAsJsonObject();
        JsonArray outputPos = finalOutput.get("pos").getAsJsonArray();
        xZero = outputPos.get(0).getAsFloat();
        yZero = outputPos.get(1).getAsFloat();
        for (JsonElement jsonElement : jsonArray) {
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
