import {useState} from 'react';
export default function RegisterPage (){
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const url = `${process.env.REACT_APP_API_URL}/register`;

    async function register(ev){
        ev.preventDefault();
        const response = await fetch('https://mishlyblog-api.vercel.app/register', {
        //const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({userName, password}),
            headers: {'Content-Type':'application/json'},
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
