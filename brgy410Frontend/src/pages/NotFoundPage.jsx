import React from 'react'
import { Link } from 'react-router-dom'

const NotFoundPage = () => {
  return (
    <div>
        <h1>PAGE IS NOT FOUND</h1>
        <Link to="/">
            <Button>GO BACK HOME</Button>
        </Link>
    </div>
  )
}

export default NotFoundPage;