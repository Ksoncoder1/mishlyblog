import { useEffect, useState } from "react";
import Post from "../Post";

export default function IndexPage (){
  const [posts, setPosts] = useState([]);
  const url = `${process.env.REACT_APP_API_URL}/post`;
  useEffect(() =>{
    fetch('https://mishlyblog-api.vercel.app/post').then(response => {
    //fetch(url).then(response => {
      response.json().then(posts => {
        setPosts(posts);
      })
    })
  }, [])
    return(
        <div>
          {posts.length > 0 && posts.map((post,i) => (
            <Post key={i} {...post} />
          ))}
        </div>
    )
}
