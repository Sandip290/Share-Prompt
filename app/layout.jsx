import React from 'react'
import '@styles/global.css'
import Nav from '@components/nav';
import Provider from '@components/Provider'

export const metadata = {
    title: 'PromptShare',
    description: 'Discover & Share AI Prompt'
}

const RootLayout = ({ children }) => {
  return (
   
    <html lang="en">
        <body>
            <Provider>
            <div className="main">
                <div className="gradient" />
               
            </div>

            <main className="app">
                <Nav/>
                {children}
                <Provider/>
            </main>
            </Provider>
        </body>
    </html>
  )
}

export default RootLayout;