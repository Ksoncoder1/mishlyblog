import {formatISO9075} from "date-fns";
import {Link} from 'react-router-dom';
//import datascience from './images/datascience.png';
export default function Post({_id, title, summary, cover, content, createdAt, author}) {
  const baseURL = import.meta.env.REACT_API_BASE_URL;
    return (
      <div className='post'>
        <div className='image'>
          <Link to={`/post/${_id}`}>
              <img src={`${baseURL}/` + cover} alt='dataimage' />
          </Link>
            
        </div>
        <div className='text'>
            <Link to={`/post/${_id}`}>
                <h2>{title}</h2>
            </Link>
            <p className='info'>
              <a className='author'>{author.userName}</a>
              <time>{formatISO9075(new Date(createdAt))}</time>
            </p>
            <p className='summary'>
              {summary} 
            </p>
        </div>
      </div>
    )
}
