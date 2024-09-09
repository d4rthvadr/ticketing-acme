// @ts-nocheck

import { useState } from 'react';

export default () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmit = (ev) => {

        ev.preventDefault();


    };

    return (
        <form onSubmit={onSubmit}>
            <h1>Sign Up</h1>
            <div className="form-group">
                <label>Email Address</label>
                <input className="form-control" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} />
            </div>
            <button className="btn btn-primary">Sign Up</button>
        </form>
    )
}