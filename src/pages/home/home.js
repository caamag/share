import './home.css'
//imgs
import profileImage from './assets/account.png';
import points from './assets/three-points.png';
import whiteHeart from './assets/heart-without-background.png';
import redHeart from './assets/red-heart.png';
import commentIcon from './assets/comment.png';

//hooks
import { useNavigate, Link } from 'react-router-dom';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, collectionGroup } from 'firebase/firestore';
import 'firebase/firestore';
import { useState, useEffect } from 'react';
import { flushSync } from 'react-dom';
import { doc, updateDoc } from 'firebase/firestore';
import firebase from 'firebase/compat/app';

const firebaseConfig = {
    apiKey: "AIzaSyBGLBmTqvO98NQtW_w86djsk4zzlaU4Z2Y",
    authDomain: "miniblog-98f6f.firebaseapp.com",
    projectId: "miniblog-98f6f",
    storageBucket: "miniblog-98f6f.appspot.com",
    messagingSenderId: "740036450506",
    appId: "1:740036450506:web:384e14461f0a56325dbc33"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

function Home() {

    const [posts, setPosts] = useState([]);
    const [newComment, setNewComment] = useState('');

    //get posts
    useEffect(() => {
        const fetchPosts = async () => {
            const postCollection = collection(db, 'posts');
            try {
                const querySnapshot = await getDocs(postCollection);
                const postsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    isLiked: false,
                    imageDestiny: false,
                }));
                setPosts(postsData);
            } catch (error) {
                return;
            }
        }
        fetchPosts();
    }, [db]);

    function handleLikeToggle(postId) {
        setPosts(prevPosts => prevPosts.map(post => {
            if (post.id === postId) {
                return { ...post, isLiked: !post.isLiked };
            }
            return post;
        }));
    }

    function imageDestinyToggle(postId) {
        setPosts(prevPost => prevPost.map(post => {
            if (post.id === postId) {
                return { ...post, imageDestiny: !post.imageDestiny };
            }
            return post;
        }));
    }

    return <div className="container">

        <div className='posts-container'>

            {posts.map((post) => (
                <section key={post.id} className='post-container'>
                    <div className='post-author-content'>

                        <img src={profileImage} alt="profile image" />
                        <h4>{post.userName}</h4>
                        <button onClick={() => imageDestinyToggle(post.id)}><img src={points} alt="" /></button>

                        {post.imageDestiny && <div className='img-url-container'>
                            <a href={post.image} target='blank'>Visit this image</a>
                        </div>}

                    </div>

                    <img src={post.image} alt="" className='post-image' /><br /><br />

                    <div className='post-author-content'>
                        <button onClick={() => handleLikeToggle(post.id)}>
                            {post.isLiked ? (
                                <img src={redHeart} alt="" className='red-heart' />
                            ) : (
                                <img src={whiteHeart} alt="" />
                            )}
                        </button>
                        <p className='post-body'>{post.body}</p><br />
                    </div>
                </section>
            ))}

        </div>

    </div>
};

export default Home;


