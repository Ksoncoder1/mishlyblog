import { useEffect, useState } from "react";
import Post from "../Post";

export default function IndexPage (){
  const [posts, setPosts] = useState([]);
  const baseURL = import.meta.env.REACT_API_BASE_URL;
  useEffect(() =>{
    fetch(`${baseURL}/post`).then(response => {
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
