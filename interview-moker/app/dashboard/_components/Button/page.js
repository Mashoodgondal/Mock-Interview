import React from 'react'

const LocalButton = (props) => {
    return (
        <div className="inline-block px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-white font-medium rounded-full hover:shadow-lg hover:shadow-cyan-500/60 transition cursor-pointer">{props.title}</div>
    )
}

export default LocalButton