import React from 'react'
import Header from './Header'

interface ILayout {
    children: React.ReactElement
}

const Layout:React.FC<ILayout> = ({children}) => {
  return (
    <>
     <Header/>
     {children}
    </>
  )
}

export default Layout