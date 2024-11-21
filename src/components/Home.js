import React from 'react'
import Header from './Header'
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div>
       Welcome to your mail box
       <Link to='/compose'>Compose</Link>
    </div>
  )
}

export default Home