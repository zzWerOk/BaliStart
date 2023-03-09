import React from 'react';
import { Button } from 'react-bootstrap';
import { FaPlus } from 'react-icons/fa';

const FabButton = () => {
    return (
        <Button
            variant="primary"
            className="rounded-circle shadow-lg d-block d-md-none"
            style={{
                position: 'fixed',
                bottom: '1rem',
                right: '1rem',
                width: '3rem',
                height: '3rem',
                fontSize: '1.5rem',
                lineHeight: '1.5rem',
                zIndex: 10,
                padding: 0
            }}
        >
            <FaPlus />
        </Button>
    );
};

export default FabButton;