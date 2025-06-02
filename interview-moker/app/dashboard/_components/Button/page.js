import React from 'react'

const LocalButton = (props) => {
    return (
        <div className='bg-indigo-400 px-2 py-1 rounded-md text-center cursor-pointer hover:font-semibold'>{props.title}</div>
    )
}

export default LocalButton