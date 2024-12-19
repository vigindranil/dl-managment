import React from 'react'

const base64Image = ({ base64String, alt }) => {
  return (
    <div>
      <img
        src={`data:image/png;base64,${base64String}`}
        alt={alt || 'Base64 Image'}
        style={{ maxWidth: '100%', height: 'auto' }}
      />
    </div>
  )
}

export default base64image