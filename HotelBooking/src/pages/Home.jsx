import React from 'react'
import Hero from '../components/Hero'
import FeaturedDestination from '../components/FeaturedDestination'
import ExclusiveOffers from '../components/ExclusiveOffers'
import Feedback from '../components/Feedback'
import NewsLetter from '../components/NewsLetter'

const Home = () => {
  return (
    <>
      <Hero/>
      <FeaturedDestination/>
      <ExclusiveOffers/>
      <Feedback/>
      <NewsLetter/>
    </>
  )
}

export default Home
