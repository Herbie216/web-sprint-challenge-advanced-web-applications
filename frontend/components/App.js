import React, { useState } from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

export default function App() {
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticle, setCurrentArticle] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)
  const navigate = useNavigate()

  const redirectToLogin = () => {
    navigate('/');
  };

  const redirectToArticles = () => {
    navigate('/articles');
  };

  const logout = () => {
    const token = localStorage.getItem('token')
    if (token) {
      localStorage.removeItem('token');
      setMessage("Goodbye!");
      redirectToLogin();
    }
  };

  const login = async ({ username, password }) => {
    setMessage('');
    setSpinnerOn(true);
    try {
      const response = await axios.post(loginUrl, {
        username,
        password
      }
      )
      localStorage.setItem('token', response.data.token);
      redirectToArticles();
    } catch (error) {
      setMessage('An error occurred. Please try again later.');
    } finally {
      setSpinnerOn(false);
    }
  };

  const getArticles = async () => {
    setSpinnerOn(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        redirectToLogin();
        return;
      }

      const response = await axios.get(articlesUrl, {
        headers: {
          Authorization: `${token}`,
        },
      });

      const data = response.data;
      setArticles(data.articles);
      setMessage(data.message);

    } catch (error) {
      setMessage('An error occurred. Please try again later.');
    } finally {
      setSpinnerOn(false);
    }
  };

  const postArticle = async (article) => {
    setSpinnerOn(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(articlesUrl, article, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
      });
      const data = response.data;
      setMessage(data.message);
      setArticles([...articles, article])
    } catch (error) {
      setMessage('An error occurred. Please try again later.');
    } finally {
      setSpinnerOn(false);
    }
  };

  const updateArticle = async ({ article_id, newArticle }) => {
    setSpinnerOn(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${articlesUrl}/${article_id}`, newArticle, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
      });
      const data = response.data;
      setMessage(data.message);

      const updatedArticles = articles.map(art => {
        if (art.article_id === article_id) {
          console.log(newArticle)
          return newArticle
        }
        else
          return art  // unchanged 
      });
      setArticles(updatedArticles)
    } catch (error) {
      setMessage('An error occurred. Please try again later.');
    } finally {
      setSpinnerOn(false);
    }
  };

  const deleteArticle = async (article_id) => {
    setSpinnerOn(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${articlesUrl}/${article_id}`, {
        headers: {
          Authorization: `${token}`,
        },
      });
      const data = response.data;
      setMessage(data.message);
      const updatedArticles = articles.filter(article => article.article_id !== article_id);
      setArticles(updatedArticles)
    } catch (error) {
      setMessage('An error occurred. Please try again later.');
    } finally {
      setSpinnerOn(false);
    }
  };


  return (
    <>
      <Spinner on={spinnerOn} />
      <Message message={message} />
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}>
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login} />} />
          <Route
            path="articles"
            element={(
              <>
                <ArticleForm
                  postArticle={postArticle}
                  updateArticle={updateArticle}
                  currentArticle={currentArticle}
                  setCurrentArticle={setCurrentArticle}
                  setCurrentArticleId={setCurrentArticleId}
                />
                <Articles
                  articles={articles}
                  getArticles={getArticles}
                  deleteArticle={deleteArticle}
                  currentArticle={currentArticle}
                  setCurrentArticle={setCurrentArticle}
                  setCurrentArticleId={setCurrentArticleId}
                />
              </>
            )}
          />
        </Routes>
        <footer>Bloom Institute of Technology 2024</footer>
      </div>
    </>
  )
}
