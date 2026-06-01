
export type KeycloakToken = {
    accessToken: string;
    accessTokenExpiresIn: number;
    refreshToken: string;
    refreshExpiresIn: number;
    tokenType: string;
    idToken: string;
    sessionState: string;
    scope: string;
};
