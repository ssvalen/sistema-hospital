package com.hospitaldb.backend.utils;

import java.util.Objects;

public class AppUtils {
    public static String validNull(String parametro){
        return Objects.isNull(parametro) ? "":parametro;
    }
}
