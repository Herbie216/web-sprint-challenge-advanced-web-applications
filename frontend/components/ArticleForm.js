import React, { useEffect, useState } from 'react'
import PT from 'prop-types'

const initialFormValues = { title: '', text: '', topic: '' }

export default function ArticleForm({
  postArticle,
  updateArticle,
  currentArticle,
  setCurrentArticle,
  // eslint-disable-next-line no-unused-vars
  setCurrentArticleId,
}) {
  
  const [values, setValues] = useState(initialFormValues);

  useEffect(() => {
    if (currentArticle) {
      setValues(currentArticle);
    } else {
      setValues({ title: '', text: '', topic: '' });
    }
  }, [currentArticle]);

  const onChange = (evt) => {
    const { id, value } = evt.target;
    setValues({ ...values, [id]: value });
  };

  const onSubmit = (evt) => {
    evt.preventDefault();
    if (currentArticle) {
      updateArticle({ article_id: currentArticle.article_id, newArticle: values });
      setValues({ title: '', text: '', topic: '' });
      setCurrentArticle(null);
      //setCurrentArticleId(null);
    } else {
      postArticle(values);
      setValues({ title: '', text: '', topic: '' });
    }
  };

  const onCancelEdit = () => {
    setValues({ title: '', text: '', topic: '' });
    setCurrentArticle(null);
    //setCurrentArticleId(null);
  };

  const isDisabled = () => {
    return !(values.title.trim() && values.text.trim() && values.topic.trim());
  };

  return (
    <form id="form" onSubmit={onSubmit}>
      <h2>{currentArticle ? 'Edit Article' : 'Create Article'}</h2>
      <input maxLength={50} onChange={onChange} value={values.title} placeholder="Enter title" id="title" />
      <textarea maxLength={200} onChange={onChange} value={values.text} placeholder="Enter text" id="text" />
      <select onChange={onChange} id="topic" value={values.topic}>
        <option value="">-- Select topic --</option>
        <option value="JavaScript">JavaScript</option>
        <option value="React">React</option>
        <option value="Node">Node</option>
      </select>
      <div className="button-group">
        <button disabled={isDisabled()} id="submitArticle" type="submit">
          Submit
        </button>
        {currentArticle && (
          <button onClick={onCancelEdit}>Cancel edit</button>
        )}
      </div>
    </form>
  );
}

// 🔥 No touchy: ArticleForm expects the following props exactly:
ArticleForm.propTypes = {
  postArticle: PT.func.isRequired,
  updateArticle: PT.func.isRequired,
  setCurrentArticleId: PT.func.isRequired,
  currentArticle: PT.shape({ // can be null or undefined, meaning "create" mode (as opposed to "update")
    article_id: PT.number.isRequired,
    title: PT.string.isRequired,
    text: PT.string.isRequired,
    topic: PT.string.isRequired,
  })
}
