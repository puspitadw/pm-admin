import React from 'react';
import { useState } from "react";
import { ValidationNotification } from "../components/ValidNotification";

export function useValidationNotification() {
    const [notification, setNotification] = useState(null);

    const showNotification = (validationResult) => {
        if (validationResult.status !== 'VALID') {
            setNotification({
                message: validationResult.message,
                type: validationResult.type || 'warning',
            });
        }
    };

    const hideNotification = () => {
        setNotification(null);
    };

    const NotificationComponent = notification ? (
        <ValidationNotification
            message={notification.message}
            type={notification.type}
            onClose={hideNotification}
        />
    ) : null;

    return {
        notification,
        showNotification,
        NotificationComponent,
    };
}