import userEvent from '@testing-library/user-event';
import React, { useEffect, useRef, useState } from 'react';

import 'react-multi-carousel/lib/styles.css';
import './style.scss';


export default function Footer() {
    
    return (
        <div className = "footer">
            <a href = "mailto:support@allbridge.io" className = "support">support@allbridge.io</a>
            <div className = "socials">
                <a href = "https://twitter.com/Allbridge_io"><img src = "twitter.svg"/></a>
                <a href = "https://t.me/allbridge_official"><img src = "telegram.svg"/></a>
                <a href = "https://allbridge.medium.com/"><img src = "medium.svg"/></a>
                <a href = "https://github.com/allbridge-io"><img src = "github.svg"/></a>
                <a href = "https://docs.allbridge.io/"><img src = "doc.svg"/></a>
            </div>
        </div>
    );
}

