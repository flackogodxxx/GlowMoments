import { useState, useRef, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import TinderCard from 'react-tinder-card'
import { motion, AnimatePresence } from 'framer-motion'

// Importe as imagens diretamente para garantir que sejam empacotadas corretamente
import roses from '../public/images/roses.jpg'
import heart from '../public/images/heart.jpg'
import fun from '../public/images/fun.jpg'
import smile from '../public/images/smile.jpg'
import cute from '../public/images/cute.jpg'

const moments = [
  {
    id: 1,
    image: roses
  },
  {
    id: 2,
    image: heart
  },
  {
    id: 3,
    image: fun
  },
  {
    id: 4,
    image: smile
  },
  {
    id: 5,
    image: cute
  }
]

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(moments.length - 1)
  const [lastDirection, setLastDirection] = useState()
  const [showIntro, setShowIntro] = useState(true)
  const [typedText, setTypedText] = useState('')
  const fullText = "Impossível você saber quem fez isso, moied"
  const currentIndexRef = useRef(currentIndex)
  const typingSpeed = 100 // ms per character
  const cardRefs = useRef({})

  useEffect(() => {
    if (showIntro && typedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.substring(0, typedText.length + 1))
      }, typingSpeed)
      
      return () => clearTimeout(timeout)
    } else if (showIntro && typedText.length === fullText.length) {
      const timeout = setTimeout(() => {
        setShowIntro(false)
      }, 2000) // Wait 2 seconds after typing finishes
      
      return () => clearTimeout(timeout)
    }
  }, [showIntro, typedText])

  // Reset the card state when the component mounts or when showIntro changes
  useEffect(() => {
    if (!showIntro) {
      setCurrentIndex(moments.length - 1)
      setLastDirection(null)
    }
  }, [showIntro])

  // Auto-reset cards when they run out
  useEffect(() => {
    if (currentIndex < 0) {
      const timeout = setTimeout(() => {
        setCurrentIndex(moments.length - 1)
        setLastDirection(null)
      }, 500) // Small delay before resetting
      
      return () => clearTimeout(timeout)
    }
  }, [currentIndex])

  const updateCurrentIndex = (val) => {
    setCurrentIndex(val)
    currentIndexRef.current = val
  }

  const swiped = (direction, index) => {
    setLastDirection(direction)
    updateCurrentIndex(index - 1)
  }

  const outOfFrame = (name) => {
    console.log(name + ' left the screen!')
  }

  const swipe = async (dir) => {
    if (currentIndex < 0) return
    
    try {
      if (cardRefs.current[currentIndex]) {
        await cardRefs.current[currentIndex].swipe(dir)
      }
    } catch (error) {
      console.log('Erro ao deslizar:', error)
    }
  }

  if (showIntro) {
    return (
      <IntroContainer>
        <TypingText>
          {typedText}
          <Cursor>|</Cursor>
        </TypingText>
      </IntroContainer>
    )
  }

  return (
    <AppContainer>
      <NavBar>
        <LogoText>Momentos Glows</LogoText>
      </NavBar>
      
      <CardsContainer>
        <AnimatePresence initial={false}>
          {moments.map((moment, index) => (
            index === currentIndex && (
              <StyledTinderCard
                ref={(element) => cardRefs.current[index] = element}
                key={`card_${moment.id}_${currentIndex}`}
                preventSwipe={['up', 'down']}
                onSwipe={(dir) => swiped(dir, index)}
                onCardLeftScreen={() => outOfFrame('')}
                swipeRequirementType="position"
                swipeThreshold={100}
              >
                <Card
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ 
                    opacity: 0,
                    x: lastDirection === 'left' ? -300 : lastDirection === 'right' ? 300 : 0,
                    rotate: lastDirection === 'left' ? -30 : lastDirection === 'right' ? 30 : 0
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <CardImage src={moment.image} alt="Momento especial" />
                  
                  <SwipeIndicator visible={lastDirection === 'left'} left>
                    NOPE
                  </SwipeIndicator>
                  
                  <SwipeIndicator visible={lastDirection === 'right'} right>
                    LIKE
                  </SwipeIndicator>
                </Card>
              </StyledTinderCard>
            )
          ))}
        </AnimatePresence>
      </CardsContainer>
      
      <ActionButtons>
        <ActionButton 
          color="#fe3f61" 
          onClick={() => swipe('left')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ActionIcon>×</ActionIcon>
        </ActionButton>
        <ActionButton 
          color="#29c3be" 
          onClick={() => swipe('up')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ActionIcon>★</ActionIcon>
        </ActionButton>
        <ActionButton 
          color="#21d07c" 
          onClick={() => swipe('right')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ActionIcon>♥</ActionIcon>
        </ActionButton>
      </ActionButtons>
    </AppContainer>
  )
}

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`

const IntroContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fef6e6;
`

const TypingText = styled.div`
  font-size: 24px;
  font-family: 'Poppins', sans-serif;
  color: #333;
  text-align: center;
  padding: 20px;
  max-width: 80%;
`

const Cursor = styled.span`
  display: inline-block;
  animation: ${blink} 1s infinite;
  font-weight: bold;
`

const AppContainer = styled.div`
  height: 100vh;
  background: #fef6e6;
  display: flex;
  flex-direction: column;
`

const NavBar = styled.nav`
  height: 60px;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
`

const LogoText = styled.h1`
  font-size: 22px;
  font-weight: 600;
  background: linear-gradient(45deg, #ff6b6b, #ffd93d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: 'Poppins', sans-serif;
`

const CardsContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
`

const StyledTinderCard = styled(TinderCard)`
  position: absolute;
  width: 100%;
  max-width: 360px;
  height: calc(100vh - 180px);
  cursor: grab;

  &:active {
    cursor: grabbing;
  }
`

const Card = styled(motion.div)`
  position: relative;
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 20px;
  background-size: cover;
  background-position: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transform-origin: center;
  will-change: transform;
`

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const SwipeIndicator = styled.div`
  position: absolute;
  top: 50px;
  padding: 10px 15px;
  border-radius: 10px;
  border: 3px solid;
  font-weight: bold;
  font-size: 24px;
  transform: rotate(${props => props.left ? '-20deg' : '20deg'});
  left: ${props => props.left ? '20px' : 'auto'};
  right: ${props => props.right ? '20px' : 'auto'};
  border-color: ${props => props.left ? '#fe3f61' : '#21d07c'};
  color: ${props => props.left ? '#fe3f61' : '#21d07c'};
  opacity: ${props => props.visible ? 1 : 0};
  transition: opacity 0.3s ease;
  z-index: 10;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
`

const ActionButtons = styled.div`
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  padding: 20px;
  background: white;
`

const ActionButton = styled(motion.button)`
  width: 65px;
  height: 65px;
  border-radius: 50%;
  border: none;
  background: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color};
  border: 2px solid transparent;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  padding: 0;

  &:hover {
    border-color: ${props => props.color};
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  }
`

const ActionIcon = styled.span`
  font-size: 32px;
  line-height: 1;
  display: block;
`

export default App
