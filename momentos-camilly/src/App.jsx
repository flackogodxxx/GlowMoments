import { useState, useRef, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import TinderCard from 'react-tinder-card'
import { motion, AnimatePresence } from 'framer-motion'

// Importando as imagens
import odontoImg from '/public/images/odonto.png'
import handImg from '/public/images/hand.png'
import happyImg from '/public/images/happy.png'
import rosesImg from '/public/images/roses.jpg'
import heartImg from '/public/images/heart.jpg'
import funImg from '/public/images/fun.jpg'
import smileImg from '/public/images/smile.jpg'
import cuteImg from '/public/images/cute.jpg'

const moments = [
  {
    id: 1,
    image: odontoImg,
    emoji: '🦷'
  },
  {
    id: 2,
    image: handImg,
    emoji: '🤝'
  },
  {
    id: 3,
    image: happyImg,
    emoji: '😄'
  },
  {
    id: 4,
    image: rosesImg,
    emoji: '🌹'
  },
  {
    id: 5,
    image: heartImg,
    emoji: '💖'
  },
  {
    id: 6,
    image: funImg,
    emoji: '✨'
  },
  {
    id: 7,
    image: smileImg,
    emoji: '😊'
  },
  {
    id: 8,
    image: cuteImg,
    emoji: '💝'
  }
]

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(moments.length - 1)
  const [lastDirection, setLastDirection] = useState()
  const [showIntro, setShowIntro] = useState(true)
  const [typedText, setTypedText] = useState('')
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [showConfirmButton, setShowConfirmButton] = useState(false)
  const [showText, setShowText] = useState(false)
  const [showContent, setShowContent] = useState(false)

  const fullText = "Feito com muito carinho, moied\n(foram 5 dias pra fazer isso aqui)"
  const currentIndexRef = useRef(currentIndex)
  const typingSpeed = 80
  const cardRefs = useRef({})

  // Corrige a altura em dispositivos móveis
  useEffect(() => {
    const setVH = () => {
      const vh = window.innerHeight * 0.01
      document.documentElement.style.setProperty('--vh', `${vh}px`)
    }

    setVH()
    window.addEventListener('resize', setVH)
    window.addEventListener('orientationchange', setVH)

    return () => {
      window.removeEventListener('resize', setVH)
      window.removeEventListener('orientationchange', setVH)
    }
  }, [])

  // Pré-carregar imagens
  useEffect(() => {
    const loadImages = async () => {
      try {
        const imagePromises = moments.map(moment => {
          return new Promise((resolve, reject) => {
            const img = new Image()
            img.onload = resolve
            img.onerror = reject
            img.src = moment.image
          })
        })

        await Promise.all(imagePromises)
        setImagesLoaded(true)
      } catch (error) {
        console.error('Erro ao carregar imagens:', error)
        setImagesLoaded(true) // Continua mesmo com erro
      }
    }

    loadImages()
  }, [])

  useEffect(() => {
    if (showIntro) {
      // Delay inicial para mostrar apenas a imagem
      const imageDelay = setTimeout(() => {
        setShowContent(true)
      }, 1500)

      return () => clearTimeout(imageDelay)
    }
  }, [showIntro])

  useEffect(() => {
    if (showIntro && showContent) {
      // Delay para começar a digitação
      const textDelay = setTimeout(() => {
        setShowText(true)
      }, 500)

      return () => clearTimeout(textDelay)
    }
  }, [showIntro, showContent])

  useEffect(() => {
    if (showIntro && showText && typedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setTypedText(fullText.substring(0, typedText.length + 1))
      }, typingSpeed)

      return () => clearTimeout(timeout)
    } else if (showIntro && showText && typedText.length === fullText.length) {
      const timeout = setTimeout(() => {
        setShowConfirmButton(true)
      }, 800)

      return () => clearTimeout(timeout)
    }
  }, [showIntro, showText, typedText])

  useEffect(() => {
    if (!showIntro) {
      setCurrentIndex(moments.length - 1)
      setLastDirection(null)
    }
  }, [showIntro])

  useEffect(() => {
    if (currentIndex < 0) {
      const timeout = setTimeout(() => {
        setCurrentIndex(moments.length - 1)
        setLastDirection(null)
      }, 500)

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

  return (
    <AnimatePresence mode="wait">
      {!imagesLoaded ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <LoadingContainer>
            <LoadingText>Carregando...</LoadingText>
          </LoadingContainer>
        </motion.div>
      ) : showIntro ? (
        <motion.div
          key="intro"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20, scale: 0.98 }}
          transition={{
            duration: 0.4,
            ease: [0.32, 0.72, 0, 1]
          }}
        >
          <IntroContainer>
            {showContent && (
              <IntroContent
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  ease: [0.32, 0.72, 0, 1]
                }}
              >
                <TypingText>
                  {showText && (
                    <>
                      {typedText.split('\n').map((line, i) => (
                        <TextLine key={i}>{line}</TextLine>
                      ))}
                      <Cursor>|</Cursor>
                    </>
                  )}
                </TypingText>
                {showConfirmButton && (
                  <ConfirmButton
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowIntro(false)}
                  >
                    <ButtonContent>
                      <ButtonText>Ver surpresa</ButtonText>
                      <ButtonEmoji>✨</ButtonEmoji>
                    </ButtonContent>
                  </ConfirmButton>
                )}
              </IntroContent>
            )}
          </IntroContainer>
        </motion.div>
      ) : (
        <motion.div
          key="main"
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.4,
            ease: [0.32, 0.72, 0, 1]
          }}
        >
          <AppContainer>
            <NavBar>
              <LogoText>Momentos Glows</LogoText>
            </NavBar>

            <CardsContainer>
              <AnimatePresence mode="wait">
                {moments.map((moment, index) => (
                  index === currentIndex && (
                    <StyledTinderCard
                      ref={(element) => cardRefs.current[index] = element}
                      key={`card_${moment.id}_${currentIndex}`}
                      preventSwipe={['up', 'down']}
                      onSwipe={(dir) => swiped(dir, index)}
                      onCardLeftScreen={() => outOfFrame('')}
                      swipeRequirementType="position"
                      swipeThreshold={50}
                    >
                      <Card
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{
                          opacity: 0,
                          x: lastDirection === 'left' ? -500 : lastDirection === 'right' ? 500 : 0,
                          rotate: lastDirection === 'left' ? -45 : lastDirection === 'right' ? 45 : 0,
                          scale: 0.8
                        }}
                        transition={{
                          duration: 0.2,
                          ease: "easeOut"
                        }}
                      >
                        <CardImage
                          src={moment.image}
                          alt={moment.emoji}
                          loading="eager"
                          draggable="false"
                        />

                        <CardOverlay>
                          <CardEmoji>{moment.emoji}</CardEmoji>
                        </CardOverlay>

                        <SwipeIndicator visible={lastDirection === 'left'} left>
                          ❌
                        </SwipeIndicator>

                        <SwipeIndicator visible={lastDirection === 'right'} right>
                          ❤️
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
        </motion.div>
      )}
    </AnimatePresence>
  )
}

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`

const LoadingContainer = styled.div`
  height: 100vh;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #fef6e6;
`

const LoadingText = styled.div`
  font-size: 24px;
  font-family: 'Poppins', sans-serif;
  color: #333;
  text-align: center;
`

const IntroContainer = styled.div`
  height: 100vh;
  height: -webkit-fill-available;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, rgba(254, 246, 230, 0.85) 0%, rgba(255, 241, 220, 0.85) 100%);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  -webkit-overflow-scrolling: touch;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url(${handImg});
    background-size: cover;
    background-position: center;
    opacity: 0.25;
    z-index: 0;
    transform: scale(1.1);
    filter: brightness(1.1) contrast(1.1);
  }
`

const IntroContent = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 25px;
  padding: 35px;
  max-width: 90%;
  text-align: center;
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  backdrop-filter: blur(15px);
  -webkit-backdrop-filter: blur(15px);
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.3) inset;
  border: 1px solid rgba(255, 255, 255, 0.4);
  transform: translateZ(0);
  will-change: transform;
  -webkit-transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  -webkit-perspective: 1000;
  transform-style: preserve-3d;
  backface-visibility: hidden;
`

const TextLine = styled.div`
  margin: 8px 0;
  position: relative;
  display: inline-block;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
    transform: scaleX(0);
    transform-origin: center;
    transition: transform 0.5s ease;
  }

  &:hover::after {
    transform: scaleX(1);
  }
`

const TypingText = styled.div`
  font-size: 32px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  color: #fff;
  text-align: center;
  padding: 25px;
  max-width: 100%;
  line-height: 1.5;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 2;
  letter-spacing: -0.5px;
  transform: translateZ(0);
  will-change: transform;
  -webkit-transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  -webkit-perspective: 1000;
  transform-style: preserve-3d;
  backface-visibility: hidden;

  @media (max-width: 768px) {
    font-size: 28px;
    padding: 20px;
  }
`

const Cursor = styled.span`
  display: inline-block;
  animation: ${blink} 1s infinite;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
`

const AppContainer = styled.div`
  width: 100%;
  height: 100vh;
  height: -webkit-fill-available;
  display: flex;
  flex-direction: column;
  background-color: #fef6e6;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
`

const NavBar = styled.nav`
  width: 100%;
  height: 60px;
  background: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  z-index: 10;
  position: relative;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.9);

  @supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
    background-color: rgba(255, 255, 255, 0.8);
  }
`

const LogoText = styled.h1`
  font-size: 24px;
  font-weight: 600;
  background: linear-gradient(45deg, #ff6b6b, #ffd93d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: 'Poppins', sans-serif;
  letter-spacing: -0.5px;
`

const CardsContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  position: relative;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
  touch-action: none;
  -webkit-overflow-scrolling: touch;
`

const StyledTinderCard = styled(TinderCard)`
  position: absolute;
  width: 90%;
  max-width: 340px;
  height: calc(100vh - 200px);
  height: calc((var(--vh, 1vh) * 100) - 200px);
  cursor: grab;
  touch-action: none;
  -webkit-tap-highlight-color: transparent;
  will-change: transform;
  user-select: none;

  &:active {
    cursor: grabbing;
  }

  @media (max-width: 768px) {
    width: 85%;
    height: calc(100vh - 180px);
    height: calc((var(--vh, 1vh) * 100) - 180px);
  }

  @media (max-height: 667px) {
    height: calc(100vh - 160px);
    height: calc((var(--vh, 1vh) * 100) - 160px);
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
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  transform-origin: center;
  will-change: transform;
  -webkit-tap-highlight-color: transparent;
  touch-action: none;
  user-select: none;

  @media (max-width: 768px) {
    border-radius: 15px;
  }
`

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  will-change: transform;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
  pointer-events: none;
  transform: scale(1.02); /* Evita bordas brancas durante a animação */
`

const CardOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 25px;
  background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  pointer-events: none;
`

const CardEmoji = styled.div`
  font-size: 42px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.3);
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));

  @media (max-width: 768px) {
    font-size: 36px;
  }
`

const SwipeIndicator = styled.div`
  position: absolute;
  top: 50px;
  padding: 15px 20px;
  border-radius: 15px;
  font-size: 32px;
  transform: rotate(${props => props.left ? '-20deg' : '20deg'}) scale(1.2);
  left: ${props => props.left ? '20px' : 'auto'};
  right: ${props => props.right ? '20px' : 'auto'};
  opacity: ${props => props.visible ? 1 : 0};
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 10;
  filter: drop-shadow(0 2px 8px rgba(0,0,0,0.2));
  pointer-events: none;
  transform-origin: center;
`

const ActionButtons = styled.div`
  width: 100%;
  height: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 35px;
  padding: 15px 20px;
  background: rgba(255, 255, 255, 0.9);
  -webkit-tap-highlight-color: transparent;
  position: relative;
  z-index: 10;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);

  @media (max-width: 768px) {
    height: 80px;
    gap: 30px;
    padding: 10px;
  }

  @supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
    background-color: rgba(255, 255, 255, 0.8);
  }
`

const ActionButton = styled(motion.button)`
  width: 65px;
  height: 65px;
  border-radius: 50%;
  border: none;
  background: white;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${props => props.color};
  border: 2px solid transparent;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  padding: 0;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  font-size: 32px;

  &:hover {
    border-color: ${props => props.color};
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    transform: translateY(-3px) scale(1.05);
  }

  &:active {
    transform: translateY(0) scale(0.95);
  }

  @media (max-width: 768px) {
    width: 58px;
    height: 58px;
    font-size: 28px;
  }
`

const ActionIcon = styled.span`
  font-size: inherit;
  line-height: 1;
  display: block;
`

const ConfirmButton = styled(motion.button)`
  margin-top: 45px;
  padding: 18px 36px;
  font-size: 20px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, rgba(255, 107, 139, 0.9), rgba(255, 142, 83, 0.9));
  border: none;
  border-radius: 35px;
  cursor: pointer;
  box-shadow:
    0 10px 20px rgba(0, 0, 0, 0.2),
    0 0 0 1px rgba(255, 255, 255, 0.2) inset;
  -webkit-tap-highlight-color: transparent;
  transition: all 0.3s cubic-bezier(0.32, 0.72, 0, 1);
  overflow: hidden;
  position: relative;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  transform: translateZ(0);
  will-change: transform;
  -webkit-transform: translateZ(0);
  -webkit-backface-visibility: hidden;
  -webkit-perspective: 1000;
  transform-style: preserve-3d;
  backface-visibility: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.2) 0%,
      rgba(255, 255, 255, 0.05) 100%
    );
    pointer-events: none;
  }

  &:active {
    transform: translateY(2px) scale(0.98);
  }

  @media (max-width: 768px) {
    font-size: 18px;
    padding: 16px 32px;
    margin-top: 40px;
  }

  @supports (-webkit-touch-callout: none) {
    padding: 20px 38px;
  }
`

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: relative;
  z-index: 1;
`

const ButtonText = styled.span`
  transform: translateY(1px);
  letter-spacing: 0.5px;
`

const ButtonEmoji = styled.span`
  font-size: 22px;
  transform: translateY(-1px);
  animation: ${keyframes`
    0%, 100% { transform: translateY(-1px) scale(1); }
    50% { transform: translateY(-1px) scale(1.2); }
  `} 2s infinite;
`

export default App
