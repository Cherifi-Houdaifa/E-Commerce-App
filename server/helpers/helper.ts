export function getImgMime(img: string) {
    if (img.startsWith("iVBORw0KGgo=")) {
        // png
        return "image/png";
    } else if (img.startsWith("/9j/")) {
        // jpeg
        return "image/jpeg";
    } else if (img.startsWith("R0lGODlh") || img.startsWith("R0lGODdh")) {
        // gif
        return "image/gif";
    }
}