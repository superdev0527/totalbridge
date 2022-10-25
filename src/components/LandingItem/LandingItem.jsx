import React, { useEffect, useRef, useState } from 'react';
import './style.scss';


export default function Landing({ children, title, number, curstep }) {
    return (
        <div className={number === curstep ? "itemactive" : "iteminactive"}>
            <div className="title">
                <div className="circlenumber">{number}</div>
                {title}
            </div>
            {children}
        </div>
    );
}

