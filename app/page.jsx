import Feed from '@components/Feed';

const Home = () => {
  return (
   <section className="w-full flex-center flex-col">
      <h1 className="head_text text-center">
      Discover & Share Prompt
      <br className="max-md:hidden"/>
      <span className="orange_gradient text-center">
        AI-powered prompt
      </span>
    </h1>
    <p>
      PromptShare is an open-source AI prompting tool for modern 
      world to discover, create and share creative prompt 
    </p>

    /* Feed */
    <Feed /> 
   </section>
  )
}

export default Home