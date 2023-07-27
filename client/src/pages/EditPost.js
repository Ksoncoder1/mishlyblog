import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../Editor";

  /*const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent',
    'link', 'image'
  ];*/

export default function EditPost() {
    const {id} = useParams();
    const [title, setTitle] = useState('');
    const [summary, setSummary] = useState('');
    const [content, setContent] = useState('');
    const [files, setFiles] = useState('');
    //const [cover, setCover] = useState('');
    const [redirect, setRedirect] = useState(false );
    const baseURL = import.meta.env.REACT_API_BASE_URL;
    useEffect(() => {
        //fetch('https://mishlyblog-api.vercel.app/post/'+id)
        fetch(`${baseURL}/post/`+id)
        .then(response =>{
            response.json().then(postInfo => {
                setTitle(postInfo.title);
                setContent(postInfo.content);
                setSummary(postInfo.summary);
            })
        });
    }, [])

    async function updatePost(ev) {
        ev.preventDefault();
        const data = new FormData();
        data.set('title', title);
        data.set('summary', summary);
        data.set('content', content);
        data.set('id', id);
        if(files?.[0]){
            data.set('file', files?.[0]);
        }
        const response = await fetch(`${baseURL}/post`, {
        //const response = await fetch(url, {
            method: 'PUT',
            body: data,
            credentials: 'include',
        });
        if(response.ok){
            setRedirect(true);
        }
    }
    if(redirect){
        return <Navigate to={'/post/'+id} />
    }
    
    return (
        <form onSubmit={updatePost}>
            <input type="title" 
            placeholder={'Title'}
            value={title}
            onChange={ev => setTitle(ev.target.value)}
            />
            <input type="summary"
             placeholder={'Summary'}
             value={summary}
             onChange={ev => setSummary(ev.target.value)}
            />
            <input type="file"
            //value={files}
            onChange={ev => setFiles(ev.target.files)}
             />
             <Editor onChange={setContent} value={content} />
            
            <button className="update-btn" style={{marginTop:'5px'}}>Update Post</button>
        </form>
    )
}
