const users = [
    {email: "test@test.com", password: "password", name: "Jane Doe"},
];

/** About the Record<> helper from typescript
    remember that a Record is a helper function in typescript that tells us what the shape of an object should look like
    so the sessions below will look like this: 
    sessions = {
        '23': {SessionId: '123', email: "test@test.com", valid: true}
    }
*/
export const sessions: Record<
    string,
    { sessionId: string; email: string; valid: boolean }
> = {};

// returns a session, only if the session is valid
export function getSession(sessionId: string) {
    const session = sessions[sessionId];

    return session && session.valid ? session : null;
}

// updates the session to invalid, which will be valid: false
export function invalidateSession(sessionId: string) {
    const session = sessions[sessionId];

    if (session) {
        sessions[sessionId].valid = false;
    }

    return sessions[sessionId];
}

// creates a new session with user email and name
export function createSession(email: string, name: string) {
    const sessionId = String(Object.keys(sessions).length + 1); // Object.keys returns all the object keys in an array

    const session = { sessionId, email, valid: true, name };

    // creates a new session and returns it
    sessions[sessionId] = session;
    return session;
}

// returns a getUser
export function getUser(email: string) {
    return users.find((user) => user.email === email);
}