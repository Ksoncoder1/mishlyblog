import {useState} from 'react';
export default function RegisterPage (){
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const baseURL = import.meta.env.REACT_API_BASE_URL;

    async function register(ev){
        ev.preventDefault();
        const response = await fetch(`{baseURL}/register`, {
        //const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({userName, password}),
            headers: {'Content-Type':'text/plain'},
        });
        if(response.status === 200){
            alert('Registration successful');
        }else{
            alert('Registration failed');
        }

    }
    return (
        <form className="register" onSubmit={register} >
            <h1>Register</h1>
            <input type="text" 
            placeholder="username"
            value={userName}
            onChange = {ev => setUserName(ev.target.value)}
             />
            <input type="password" 
            placeholder="password"
            value={password}
            onChange = {ev => setPassword(ev.target.value)}
             />
            <button>Register</button>
        </form>
    )
}
