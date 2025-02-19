import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;

import java.io.*;
import java.net.InetSocketAddress;
import java.nio.file.Files;
import java.nio.file.Paths;

public class VectorStoreAppServer {

    public static String BUILD_DIR = "www";

    public static void main(String[] args) throws IOException {
        // Create an HttpServer instance on port 8000
        HttpServer server = HttpServer.create(new InetSocketAddress(8000), 0);

        // Define a context that serves files from the current directory
        server.createContext("/", new HttpHandler() {
            @Override
            public void handle(HttpExchange exchange) throws IOException {
                // Get the requested URI (path)
                String requestedFile = exchange.getRequestURI().getPath();

                // Handle all paths and serve index.html for any request
                if (requestedFile.equals("/") || requestedFile.matches("/[^.]*")) {
                    requestedFile = "/index.html"; // Serve index.html for all paths
                }

                // Define the directory to serve static files from
                String filePath = BUILD_DIR + requestedFile;

                // Set the response header
                File file = new File(filePath);
                if (file.exists() && file.isFile()) {
                    // Determine the content type
                    String contentType = Files.probeContentType(Paths.get(filePath));
                    if (contentType == null) {
                        contentType = "application/octet-stream"; // Default content type
                    }

                    // Read the file and send the content
                    byte[] fileBytes = Files.readAllBytes(file.toPath());

                    // Send the response
                    exchange.getResponseHeaders().set("Content-Type", contentType);
                    exchange.sendResponseHeaders(200, fileBytes.length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(fileBytes);
                    os.close();
                } else {
                    // If file is not found, send a 404 error
                    String response = "404 Not Found";
                    exchange.sendResponseHeaders(404, response.getBytes().length);
                    OutputStream os = exchange.getResponseBody();
                    os.write(response.getBytes());
                    os.close();
                }
            }
        });

        // Start the server
        server.start();
        System.out.println("Server started on port 8000");
    }
}
