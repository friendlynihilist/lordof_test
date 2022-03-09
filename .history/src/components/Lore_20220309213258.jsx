import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { connect } from '../redux/blockchain/blockchainActions';
import { fetchData } from '../redux/data/dataActions';
import { NavLink } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import * as s from '../styles/globalStyles';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TypeWriterEffect from 'react-typewriter-effect';

export const StyledButton = styled.button`
  padding: 10px;
  border: 1px solid black;
  background-color: var(--secondary);
  font-family: 'VCROSDMONO', monospace;
  font-size: 2rem;
  font-weight: bold;
  color: var(--secondary-text);
  width: 200px;
  cursor: pointer;
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 20px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImgBak = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const HeaderTitle = styled.span`
  text-shadow: 2px 4px var(--secondary);
  text-align: center;
  font-size: 3rem;
  color: var(--primary-text);
  font-family: 'Alagard', monospace;
  font-weight: bold;
  color: 'var(--accent-text)';
  @media (min-width: 900px) {
    font-size: 4rem;
    text-shadow: 2px 6px var(--secondary);
  }
  @media (min-width: 1000px) {
    font-size: 5.5rem;
    text-shadow: 2px 8px var(--secondary);
  }
  transition: width 0.5s;
`;

export const DivTitle = styled.span`
  text-shadow: 2px 4px var(--secondary);
  text-align: center;
  font-size: 1.6rem;
  color: var(--primary-text);
  font-family: 'Alagard', monospace;
  font-weight: bold;
  color: 'var(--accent-text)';
  @media (min-width: 900px) {
    font-size: 2rem;
  }
  @media (min-width: 1000px) {
    font-size: 2.5rem;
  }
  transition: width 0.5s;
`;

export const StyledViewer = styled.img`
  width: 250px;
  @media (min-width: 900px) {
    width: 350px;
  }
  @media (min-width: 1000px) {
    width: 60%;
  }
  @media (min-width: 1200px) {
    width: 50%;
  }
  transition: width 0.5s;
`;

export const StyledImg = styled.img`
  width: 350px;
  @media (min-width: 900px) {
    width: 550px;
  }
  @media (min-width: 1000px) {
    width: 800px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

function Lore(){
    const dispatch = useDispatch();
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(``);
  const [mintAmount, setMintAmount] = useState(1);
  const [CONFIG, SET_CONFIG] = useState({
    CONTRACT_ADDRESS: '',
    SCAN_LINK: '',
    NETWORK: {
      NAME: '',
      SYMBOL: '',
      ID: 0,
    },
    NFT_NAME: '',
    SYMBOL: '',
    MAX_SUPPLY: 1,
    WEI_COST: 0,
    DISPLAY_COST: 0,
    GAS_LIMIT: 0,
    MARKETPLACE: '',
    MARKETPLACE_LINK: '',
    SHOW_BACKGROUND: false,
  });
  const TOKENS_ARRAY = [];
  const [lords, setLords] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  const getData = () => {
    if (blockchain.account !== '' && blockchain.smartContract !== null) {
      dispatch(fetchData(blockchain.account));
    }
  };

  const getConfig = async () => {
    const configResponse = await fetch('/config/config.json', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    const config = await configResponse.json();
    SET_CONFIG(config);
  };

  function start_and_end(str) {
    if (str.length > 10) {
      return str.substr(0, 5) + '...' + str.substr(str.length-4, str.length);
    }
    return str;
  }

  useEffect(() => {
    getConfig();
  }, []);

  useEffect(() => {
    getData();
  }, [blockchain.account]);

    return (
        <s.Screen>
          {/* <MusicCard></MusicCard> */}
          <s.Container
            flex={1}
            ai={'center'}
            style={{ padding: 24, backgroundColor: 'var(--primary)' }}
            image={CONFIG.SHOW_BACKGROUND ? '/config/images/bg.png' : null}
          >
            {/* <HeaderTitle></HeaderTitle>
            <s.SpacerSmall /> */}
            <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
              
    
                <s.SpacerLarge />
    
                <HeaderTitle>
                  <TypeWriterEffect
                    // textStyle={{ fontFamily: 'Red Hat Display' }}
                    startDelay={100}
                    cursorColor="white"
                    hideCursorAfterText="true"
                    text="The Saga unfolds..."
                    typeSpeed={100}
                    // scrollArea={myAppRef}
                  />
                </HeaderTitle>
    
                <s.SpacerLarge />
    
                <s.SpacerLarge />
              <s.SpacerLarge />
            </ResponsiveWrapper>
            <s.SpacerMedium />
    
            {/* SECTION */}
            <s.respContainer
              jc={'center'}
              ai={'center'}
              style={{
                // width: "90%",
                backgroundColor: '#00000061',
                color: 'white',
                fontFamily: 'Courier New, monospace',
                textAlign: 'left',
                paddingTop: 30,
                paddingLeft: 30,
                paddingRight: 30,
                paddingBottom: 30,
                // height: "100%",
                // backgroundImage: `url(${Background})`,
                // backgroundRepeat: "no-repeat",
                // backgroundSize: "cover",
                // backgroundPosition: "center"
              }}
            >
              <s.SpacerMedium />
              <DivTitle>Who are Fantom Lords?</DivTitle>
              <s.SpacerMedium />
    
              <ResponsiveWrapper flex={1}>
                <s.Container
                  flex={1}
                  jc={'start'}
                  ai={'center'}
                  style={{ padding: 10 }}
                >
                  <StyledImg
                    alt={'Fantom Lords preview'}
                    src={'/config/images/previewsite.gif'}
                    style={{ width: '100%', imageRendering: 'pixelated' }}
                  />
                </s.Container>
    
                <s.Container
                  flex={2}
                  jc={'start'}
                  ai={'center'}
                  style={{ padding: 10 }}
                >
                  <s.TextDescription
                    style={{
                      textAlign: 'left',
                    }}
                  >
                    <span style={{ fontWeight: 'bold' }}>
                      Fantom Lords are an epic collection of 3333 randomly generated
                      lordly NFTs on the Fantom blockchain.
                    </span>
                  </s.TextDescription>
                  {/* <br /> */}
                  <s.TextDescription
                    style={{
                      textAlign: 'left',
                      paddingBottom: 20,
                    }}
                  >
                    Fantom Lords are powerful multidimensional travelers with their
                    own agendas of gallant quests, treacheries, warfare and galas.
                    Each Fantom Lord is magically{' '}
                    <span style={{ fontWeight: 'bold' }}>
                      generated from over 70+ possible traits
                    </span>
                    , including Classes, Ancestries, Weapons, Armors, Relics and
                    more. Moreover, Lords metadata are
                    hosted on IPFS and
                    validated on the Blockchain as ERC-721 tokens on the Fantom
                    blockchain.
                  </s.TextDescription>
                  <s.SpacerMedium />
                  {/* <s.SpacerSmall /> */}
                </s.Container>
              </ResponsiveWrapper>
              <DivTitle>How do I summon my Lord?</DivTitle>
              <s.SpacerMedium />
              <s.TextDescription
                style={{
                  textAlign: 'left',
                }}
              >
                {/* {actualDate.getTime() < mintDate.getTime() ? 'NOT READY' : 'READY'} */}
                The original collection was launched in November of 2021, but you
                can still find some vagrant Lord in the secondary market on{' '}
                <StyledLink
                  target={'_blank'}
                  href={'https://nftkey.app/collections/fantomlords/'}
                >
                  NFTKey
                </StyledLink>
                ,{' '}
                <StyledLink
                  target={'_blank'}
                  href={
                    'https://paintswap.finance/marketplace/collections/0xfee8077c909d956e9036c2d2999723931cefe548'
                  }
                >
                  PaintSwap
                </StyledLink>{' '}
                and others.
              </s.TextDescription>
              <s.SpacerMedium />
              <s.SpacerMedium />
              <DivTitle>What if I summon a Lord?</DivTitle>
              <s.SpacerMedium />
              <s.TextDescription
                style={{
                  textAlign: 'left',
                }}
              >
                Owning a Fantom Lord gives you immediate access to lordly rewards: first and foremost, you gain the title of
                Gallant Lord and could join our The Guild DAO in order to participate to major exclusive events, giveaway and collective
                decentralised world-building.
              </s.TextDescription>
              <s.SpacerMedium />
              <s.TextDescription
                style={{
                  textAlign: 'left',
                }}
              >
                Additionally, you gain access to The Stronghold, our staking platform (see below). Send your Lord to a quest and receive daily yield in Arcane Relics
                ($XRLC). Buy and collect Artifacts, or burn them to make your Lords ascend and become super-cool powerhouses (April 2022).
               
              </s.TextDescription>
              <s.SpacerMedium />
              <s.TextDescription
                style={{
                  textAlign: 'left',
                }}
              >
                Last but not least, you will be eligible to join the closed-beta of the first Fantom dungeon-crawler Play2Earn game (June 2022). Delve deeper into The Maze,
                level up your Lords, unleash deadly spells and call forth the power of Fantom to defeat your foes and gain REAL loot!
               
              </s.TextDescription>
              <s.SpacerMedium />
              <s.TextDescription
                style={{
                  textAlign: 'left',
                }}
              >
                But, most of all, have fun. Fantom Lords are{' '}
                <span style={{ fontWeight: 'bold' }}>
                  an ode to the "days of high adventure"
                </span>{' '}
                of old-school roleplaying games, taking inspiration from Golden Age
                of fantasy memorabilia!
              </s.TextDescription>
    
              <s.SpacerLarge />
    
              <s.SpacerLarge />
              <DivTitle>Future Plans</DivTitle>
              <s.SpacerMedium />
              <s.TextDescription
                style={{
                  textAlign: 'center',
                  width: '70%',
                }}
              >
                {/* {actualDate.getTime() < mintDate.getTime() ? 'NOT READY' : 'READY'} */}
                <span style={{ fontStyle: 'italic' }}>
                  About the future of the Fantom Lords, as foretold by the ancient
                  Cryptic Scrolls...
                </span>
              </s.TextDescription>
              <s.SpacerMedium />
              <ResponsiveWrapper
                flex={1}
                // style={{ backgroundColor: 'rgb(189, 117, 74)' }}
              >
                <s.Container
                  flex={1}
                  jc={'center'}
                  ai={'center'}
                  style={{ padding: 10, borderTop: '2px solid #fff' }}
                >
                  <StyledImg
                    alt={'The Great Summoning'}
                    src={'/config/images/stakingdiagram_template.png'}
                    style={{ imageRendering: 'pixelated', width: '100%' }}
                  />
                </s.Container>
              </ResponsiveWrapper>
              <s.SpacerSmall />
            </s.respContainer>
            {/* END SECTION */}
          </s.Container>
        </s.Screen>
      );

}

export default Lore;