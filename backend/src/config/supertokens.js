import supertokens from 'supertokens-node';
import EmailPassword from 'supertokens-node/recipe/emailpassword/index.js';
import Session from 'supertokens-node/recipe/session/index.js';
import environment from './environment.js';

export function initSuperTokens() {
    supertokens.init({
        framework: 'express',
        supertokens: {
            connectionURI: environment.supertokens.connectionUri,
            apiKey: environment.supertokens.apiKey,
        },
        appInfo: {
            appName: 'Bisafix',
            apiDomain: `http://${environment.host}:${environment.port}`,
            websiteDomain: environment.clientUrl,
            apiBasePath: '/api/v1/st-auth', // Changed to avoid conflict with custom auth routes
            websiteBasePath: '/auth',
        },
        recipeList: [
            EmailPassword.init({
                // We'll handle signup/signin manually in our controllers
                // SuperTokens will manage sessions
                override: {
                    apis: (originalImplementation) => {
                        return {
                            ...originalImplementation,
                            // Disable default signup/signin endpoints
                            // We'll use custom endpoints
                            signUpPOST: undefined,
                            signInPOST: undefined,
                        };
                    },
                },
            }),
            Session.init({
                cookieSecure: environment.isProduction,
                cookieSameSite: environment.isProduction ? 'none' : 'lax',
            }),
        ],
    });
}

export default initSuperTokens;
