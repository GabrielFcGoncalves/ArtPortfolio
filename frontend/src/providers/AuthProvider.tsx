'use client';

import { ReactKeycloakProvider } from '@react-keycloak/web'
import keycloak from './keycloak'
import { useState, useCallback } from 'react'

const isSecureContext = typeof window !== 'undefined' && (window.isSecureContext || window.location.hostname === 'localhost');

const initOptions: Keycloak.KeycloakInitOptions = {
  onLoad: "login-required",
  pkceMethod: isSecureContext ? "S256" : undefined,
  responseMode: "query",
  checkLoginIframe: false,
};

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const onEvent = useCallback((event: string, error: any) => {
        if (event === 'onInitError') {
            const errorMsg = error instanceof Error ? error.message : JSON.stringify(error)
            setErrorMessage(`Keycloak init error: ${errorMsg}`)
            console.error('Keycloak init error:', error)
        }
    }, [])

    return (
        <>
            {errorMessage && <div className="fixed top-0 left-0 right-0 bg-red-500 text-white p-4 z-50 text-center">{errorMessage}</div>}
            <ReactKeycloakProvider
                authClient={keycloak}
                initOptions={initOptions}
                onEvent={onEvent}
            >
                {children}
            </ReactKeycloakProvider>
        </>
    );
}