public String extractEmail(HttpServletRequest request) {
    String authHeader = request.getHeader("Authorization");
    String token = null;

    if (authHeader != null && authHeader.startsWith("Bearer ")) {
        // Extract token and trim any whitespace
        token = authHeader.substring(7).trim();

        // Additional check to ensure token doesn't have quotes
        if (token.startsWith("\"") && token.endsWith("\"")) {
            token = token.substring(1, token.length() - 1);
        }
    }

    // Only try to extract email if token is valid
    if (token != null && !token.isEmpty()) {
        return jwtUtil.extractEmail(token);
    }
    return null;
}