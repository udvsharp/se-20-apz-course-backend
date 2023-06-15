export function isValidAuthHeader(authHeader) {
    if (!authHeader) {
        return false;
    }

    if (!authHeader.startsWith('Bearer ')) {
        return false;
    }

    return true;
}

export function tokenFromHeader(authHeader) {
    let token;
    if (isValidAuthHeader(authHeader)) {
        token = authHeader.split(' ')[1];
    }

    return token;
}